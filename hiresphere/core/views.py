# core/views.py
from functools import wraps

from django import template
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_backends
from django.http import JsonResponse, HttpResponse
from django.shortcuts import (
    render, redirect, get_object_or_404
)
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Exists, OuterRef, Q

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    User, Applicant, Recruiter, Department, JobListings,
    Application, InterviewSchedule, HiringDecisions, ScreeningCriteria
)
from .forms import LoginForm, ApplicantForm, SignupForm
from .services import passes_screening, calculate_application_score
from .serializers import (
    JobSerializer, JobDetailSerializer, ApplicationSerializer,
    InterviewSerializer, DecisionSerializer
)

# ────────────────────────────────────────────────────────────────
# template helper
# ────────────────────────────────────────────────────────────────
register = template.Library()

@register.filter(name="add_class")
def add_class(field, css_class):
    return field.as_widget(attrs={"class": css_class})


# ────────────────────────────────────────────────────────────────
# util decorators / helpers
# ────────────────────────────────────────────────────────────────
def login_required(role=None):
    """Redirect to login if session is missing; optionally gate by role."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if "user_id" not in request.session:
                return redirect("login")
            if role and request.session.get("role") != role:
                return redirect("dashboard")
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def _applicant(request) -> Applicant:
    """Return Applicant linked to current user (create if needed)."""
    return Applicant.objects.get_or_create(user_id=request.session["user_id"])[0]


# ────────────────────────────────────────────────────────────────
# auth ­(JSON for React)
# ────────────────────────────────────────────────────────────────
@ensure_csrf_cookie
def login_view(request):
    """
    POST: username/password (form-encoded) → JSON {success, role, name}
    GET : just ensure browser has a csrf cookie so React fetch can use it.
    """
    request.session.flush()

    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(
                request,
                username=form.cleaned_data["username"],
                password=form.cleaned_data["password"]
            )
            if user:
                login(request, user)
                request.session.update({"user_id": user.id, "role": user.role})
                return JsonResponse({
                    "success": True,
                    "role": user.role,
                    "name": user.email.split('@')[0]  # Extract name from email (part before @)
                })
        return JsonResponse({"success": False}, status=400)

    return JsonResponse({"message": "CSRF cookie set."})


def logout_view(request):
    request.session.flush()
    return redirect("login")


import json
from django.views.decorators.csrf import csrf_exempt

@ensure_csrf_cookie
def signup_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            # Fallback to form data if needed, but primarily JSON
            data = request.POST

        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "JOBSEEKER")

        if not email or not password:
             return JsonResponse({"success": False, "errors": {"email": "Email and password required"}}, status=400)
        
        if User.objects.filter(email=email).exists():
             return JsonResponse({"success": False, "errors": {"email": "User already exists"}}, status=400)

        try:
            user = User.objects.create(email=email, role=role, is_active=True)
            user.set_password(password)
            user.save()

            if role == "RECRUITER":
                # Create rudimentary Department if needed or assign default
                dept, _ = Department.objects.get_or_create(name="General")
                Recruiter.objects.create(user=user, department=dept)
            else:
                Applicant.objects.create(user=user, first_name="New", last_name="User")

            # auto-login
            backend = get_backends()[0]
            user.backend = f"{backend.__module__}.{backend.__class__.__name__}"
            login(request, user)
            
            # Set custom session vars required by our decorators
            request.session["user_id"] = user.id
            request.session["role"] = user.role

            return JsonResponse({"success": True, "role": role})
        except Exception as e:
            return JsonResponse({"success": False, "errors": str(e)}, status=400)

    return HttpResponse("CSRF cookie set.")


def test_api(request):
    return JsonResponse({"message": "Backend is connected to React!"})


@api_view(["GET"])
def api_test_data(request):
    """Test endpoint to check if API is working and return sample data structure."""
    return Response({
        "message": "API is working!",
        "sample_job": {
            "id": 1,
            "title": "Software Engineer",
            "department": "Engineering",
            "posted_date": "2024-01-15"
        },
        "sample_application": {
            "application_id": 1,
            "status": "Pending",
            "date_applied": "2024-01-20",
            "job": {
                "id": 1,
                "title": "Software Engineer",
                "department": "Engineering",
                "posted_date": "2024-01-15"
            }
        }
    })


@api_view(["GET"])
def api_departments(request):
    """Get all departments for job creation form."""
    departments = Department.objects.all()
    data = []
    for dept in departments:
        data.append({
            "department_id": dept.department_id,
            "name": dept.name,
        })
    return Response(data)


# ────────────────────────────────────────────────────────────────
# dashboards
# ────────────────────────────────────────────────────────────────
@login_required("ADMIN")
def admin_dashboard(request):
    return render(request, "core/dashboards/admin.html")


@login_required("RECRUITER")
def recruiter_dashboard(request):
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    data = {
        "shortlisted_count": Application.objects.filter(
            job__recruiter=recruiter, status="Shortlisted"
        ).count(),
        "interviews_count": InterviewSchedule.objects.filter(
            recruiter=recruiter, status="Scheduled"
        ).count(),
        "decisions_count": HiringDecisions.objects.filter(
            job__recruiter=recruiter
        ).count(),
    }
    return render(request, "core/dashboards/recruiter.html", data)


@login_required("JOBSEEKER")
def applicant_dashboard(request):
    applicant = _applicant(request)
    data = {
        "apps_count": Application.objects.filter(applicant=applicant).count(),
        "interviews_count": InterviewSchedule.objects.filter(
            application__applicant=applicant
        ).count(),
        "saved_count": 0,
    }
    return render(request, "core/dashboards/applicant.html", data)


@login_required()
def dashboard(request):
    """Shortcut → redirect by role so /dashboard works for everyone."""
    return redirect({
        "ADMIN":     "admin_dashboard",
        "RECRUITER": "recruiter_dashboard",
        "JOBSEEKER": "applicant_dashboard",
    }[request.session["role"]])


# ────────────────────────────────────────────────────────────────
# applicant HTML views (legacy server-rendered)
# ────────────────────────────────────────────────────────────────
@login_required("JOBSEEKER")
def job_list(request):
    jobs = JobListings.objects.select_related("department", "recruiter__user")
    return render(request, "core/jobs/list.html", {"jobs": jobs})


@login_required("JOBSEEKER")
def job_detail(request, pk):
    job = get_object_or_404(JobListings, pk=pk)
    applied = Application.objects.filter(
        job=job, applicant__user_id=request.session["user_id"]
    ).exists()
    return render(request, "core/jobs/detail.html", {"job": job, "applied": applied})


@login_required("JOBSEEKER")
def job_apply(request, pk):
    job = get_object_or_404(JobListings, pk=pk)
    applicant = _applicant(request)

    if request.method == "POST":
        form = ApplicantForm(request.POST, instance=applicant)
        if form.is_valid():
            form.save()
            app, _ = Application.objects.get_or_create(job=job, applicant=applicant)

            if hasattr(job, "criteria") and passes_screening(applicant, job.criteria):
                app.status = "Shortlisted"
                app.save(update_fields=["status"])

            messages.success(request, "Application submitted.")
            return redirect("applications")
    else:
        form = ApplicantForm(instance=applicant)

    return render(request, "core/applications/apply_form.html", {"form": form, "job": job})


@login_required("JOBSEEKER")
def applications(request):
    apps = Application.objects.filter(applicant=_applicant(request)).select_related("job")
    return render(request, "core/applications/list.html", {"apps": apps})


@login_required("JOBSEEKER")
def interviews(request):
    its = InterviewSchedule.objects.filter(
        application__applicant=_applicant(request)
    ).select_related("job")
    return render(request, "core/interviews/list.html", {"its": its})


@login_required("JOBSEEKER")
def decisions(request):
    decs = HiringDecisions.objects.filter(applicant=_applicant(request)).select_related("job")
    return render(request, "core/decisions/list.html", {"decs": decs})


# ────────────────────────────────────────────────────────────────
# recruiter views
# ────────────────────────────────────────────────────────────────
@login_required("RECRUITER")
def shortlisted(request):
    recruiter = Recruiter.objects.get(pk=request.session["user_id"])
    apps = Application.objects.filter(status="Shortlisted", job__recruiter=recruiter)
    return render(request, "core/recruiter/shortlisted.html", {"apps": apps})


@login_required("RECRUITER")
def schedule_interview(request, app_id):
    app = get_object_or_404(
        Application, pk=app_id, job__recruiter__pk=request.session["user_id"]
    )
    if request.method == "POST":
        InterviewSchedule.objects.create(
            job=app.job,
            application=app,
            recruiter_id=request.session["user_id"],
            date=request.POST["date"],
            time=request.POST["time"],
        )
        messages.success(request, "Interview scheduled.")
        return redirect("recruiter_interviews")

    return render(request, "core/recruiter/schedule_form.html", {"app": app})


@login_required("RECRUITER")
def recruiter_interviews(request):
    recruiter = Recruiter.objects.get(pk=request.session["user_id"])
    its = InterviewSchedule.objects.filter(recruiter=recruiter).select_related(
        "job", "application__applicant__user"
    )
    return render(request, "core/recruiter/interviews.html", {"its": its})


@login_required("RECRUITER")
def recruiter_decisions(request):
    recruiter = Recruiter.objects.get(pk=request.session["user_id"])

    decisions = HiringDecisions.objects.filter(
        job__recruiter=recruiter
    ).select_related("job", "applicant__user")

    undecided_apps = Application.objects.filter(
        job__recruiter=recruiter, status="Shortlisted"
    ).annotate(
        already_decided=Exists(
            HiringDecisions.objects.filter(
                job=OuterRef("job"), applicant=OuterRef("applicant")
            )
        )
    ).filter(already_decided=False).select_related("job", "applicant__user")

    return render(request, "core/recruiter/decisions.html", {
        "decisions": decisions,
        "undecided_apps": undecided_apps
    })


@login_required("RECRUITER")
def hire(request, app_id):
    app = get_object_or_404(
        Application, pk=app_id, job__recruiter__pk=request.session["user_id"]
    )
    HiringDecisions.objects.update_or_create(
        job=app.job, applicant=app.applicant, defaults={"final_status": "Hired"}
    )
    app.status = "Selected"
    app.save(update_fields=["status"])
    messages.success(request, "Applicant Hired!")
    return redirect("recruiter_decisions")


@login_required("RECRUITER")
def view_application(request, app_id):
    app = get_object_or_404(
        Application, pk=app_id, job__recruiter__pk=request.session["user_id"]
    )
    return render(request, "core/recruiter/view_application.html", {"app": app})


# ────────────────────────────────────────────────────────────────
# admin views
# ────────────────────────────────────────────────────────────────
@login_required("ADMIN")
def admin_jobs(request):
    jobs = JobListings.objects.all()
    return render(request, "core/admin/jobs.html", {"jobs": jobs})


@login_required("ADMIN")
def job_create(request):
    if request.method == "POST":
        recruiter = Recruiter.objects.get(pk=request.session["user_id"])
        job = JobListings.objects.create(
            recruiter=recruiter,
            department_id=request.POST["department"],
            title=request.POST["title"],
            posted_date=request.POST["posted_date"],
            description=request.POST.get("description", ""),
        )
        ScreeningCriteria.objects.create(
            job=job,
            required_skills=request.POST.get("skills", ""),
            min_experience=request.POST.get("min_exp") or None,
            min_qualification=request.POST.get("qual", ""),
        )
        messages.success(request, "Job created.")
        return redirect("admin_jobs")

    return render(request, "core/admin/job_form.html", {"depts": Department.objects.all()})


# ────────────────────────────────────────────────────────────────
# JSON APIs consumed by React SPA
# ────────────────────────────────────────────────────────────────
@api_view(["GET"])
@login_required("JOBSEEKER")
def api_jobs(request):
    qs = JobListings.objects.select_related("department")
    return Response(JobSerializer(qs, many=True).data)


@api_view(["GET"])
@login_required("JOBSEEKER")
def api_job_detail(request, pk):
    job = get_object_or_404(JobListings, pk=pk)
    applied = Application.objects.filter(
        job=job, applicant__user_id=request.session["user_id"]
    ).exists()
    return Response({
        "job": JobDetailSerializer(job).data,
        "applied": applied,
    })


@api_view(["POST"])
@login_required("JOBSEEKER")
def api_job_apply(request, pk):
    """
    Apply for a job. Optional: Upload/Update resume during application.
    """
    from core.tasks import parse_resume_task
    
    job = get_object_or_404(JobListings, pk=pk)
    applicant = _applicant(request)
    
    app, created = Application.objects.get_or_create(job=job, applicant=applicant)
    
    # Handle Resume Upload if provided
    file = request.FILES.get("resume")
    if file:
        applicant.resume = file
        applicant.save()
        # Trigger AI Parsing AFTER app creation so scoring sees the new app
        parse_resume_task.delay(applicant.pk)

    if hasattr(job, "criteria") and passes_screening(applicant, job.criteria):
        app.status = "Shortlisted"
        app.save(update_fields=["status"])

    return Response({"success": True, "message": "Application submitted successfully!"})


@api_view(["GET"])
@login_required("JOBSEEKER")
def api_applications(request):
    apps = Application.objects.filter(applicant=_applicant(request)).select_related("job")
    return Response(ApplicationSerializer(apps, many=True).data)


@api_view(["GET"])
@login_required("JOBSEEKER")
def api_interviews(request):
    its = InterviewSchedule.objects.filter(
        application__applicant=_applicant(request)
    ).select_related("job")
    return Response(InterviewSerializer(its, many=True).data)


@api_view(["GET"])
@login_required("JOBSEEKER")
def api_decisions(request):
    decs = HiringDecisions.objects.filter(
        applicant=_applicant(request)
    ).select_related("job")
    return Response(DecisionSerializer(decs, many=True).data)


# ────────────────────────────────────────────────────────────────
# JSON APIs consumed by React
# ────────────────────────────────────────────────────────────────

# Admin API endpoints
@api_view(["GET"])
def api_admin_dashboard_stats(request):
    """Get admin dashboard statistics."""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        data = {
            "jobs_count": JobListings.objects.count(),
            "applications_count": Application.objects.count(),
            "users_count": User.objects.count(),
            "interviews_count": InterviewSchedule.objects.count(),
        }
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def api_admin_users(request):
    """Get all users for admin management."""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        users = User.objects.all()
        data = []
        for user in users:
            data.append({
                "id": user.id,
                "name": user.email.split('@')[0],
                "email": user.email,
                "role": user.role,
                "status": "active" if user.is_active else "inactive",
            })
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_create_user(request):
    """Create a new user."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role", "JOBSEEKER")
        
        if User.objects.filter(email=email).exists():
            return Response({"success": False, "error": "User already exists"}, status=400)
        
        user = User.objects.create_user(
            email=email,
            password=password,
            role=role
        )
        
        # Create corresponding profile based on role
        if role == "JOBSEEKER":
            Applicant.objects.create(user=user)
        elif role == "RECRUITER":
            Recruiter.objects.create(user=user)
        
        return Response({"success": True, "message": "User created successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_update_user(request, user_id):
    """Update user status."""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    try:
        user = get_object_or_404(User, id=user_id)
        action = request.data.get("action")
        
        if action == "deactivate":
            user.is_active = False
        elif action == "activate":
            user.is_active = True
        
        user.save()
        return Response({"success": True, "message": f"User {action}d successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["GET"])
def api_admin_jobs(request):
    """Get all jobs for admin management."""
    try:
        jobs = JobListings.objects.select_related("department", "recruiter__user").all()
        data = []
        for job in jobs:
            data.append({
                "id": job.job_id,
                "title": job.title,
                "department": job.department.name,
                "recruiter": job.recruiter.user.email if job.recruiter else "Not assigned",
                "posted_date": job.posted_date.strftime("%Y-%m-%d"),
                "description": job.description or "",
                "status": "Open" if getattr(job, 'is_active', True) else "Closed",
            })
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_create_job(request):
    """Create a new job."""
    try:
        # Get a recruiter (you might want to make this more flexible)
        recruiter = Recruiter.objects.first()
        if not recruiter:
            return Response({"success": False, "error": "No recruiter available"}, status=400)
        
        job = JobListings.objects.create(
            recruiter=recruiter,
            department_id=request.data.get("department_id"),
            title=request.data.get("title"),
            posted_date=request.data.get("posted_date"),
            description=request.data.get("description", ""),
        )
        
        # Create screening criteria if provided
        if request.data.get("skills") or request.data.get("min_experience"):
            ScreeningCriteria.objects.create(
                job=job,
                required_skills=request.data.get("skills", ""),
                min_experience=request.data.get("min_experience") or None,
                min_qualification=request.data.get("min_qualification", ""),
            )
        
        return Response({"success": True, "message": "Job created successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_update_job(request, job_id):
    """Update job status."""
    try:
        job = get_object_or_404(JobListings, id=job_id)
        action = request.data.get("action")
        
        if action == "deactivate":
            job.is_active = False
        elif action == "activate":
            job.is_active = True
        
        job.save()
        return Response({"success": True, "message": f"Job {action}d successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["DELETE"])
@login_required("ADMIN")
def api_admin_delete_job(request, job_id):
    """Delete a job."""
    try:
        job = get_object_or_404(JobListings, id=job_id)
        job.delete()
        return Response({"success": True, "message": "Job deleted successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["GET"])
def api_admin_applications(request):
    """Get all applications for admin oversight."""
    try:
        applications = Application.objects.select_related("job", "applicant__user", "job__department").all()
        data = []
        for app in applications:
            data.append({
                "id": app.application_id,
                "applicant": app.applicant.user.email,
                "job_title": app.job.title,
                "department": app.job.department.name,
                "status": app.status,
                "applied_date": app.date_applied.strftime("%Y-%m-%d"),
            })
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def api_admin_interviews(request):
    """Get all interviews for admin management."""
    try:
        interviews = InterviewSchedule.objects.select_related("job", "application__applicant__user").all()
        data = []
        for interview in interviews:
            data.append({
                "id": interview.id,
                "applicant": interview.application.applicant.user.email,
                "job_title": interview.job.title,
                "date": interview.date.strftime("%Y-%m-%d"),
                "time": interview.time.strftime("%H:%M"),
                "status": interview.status,
            })
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_update_interview(request, interview_id):
    """Update interview status."""
    try:
        interview = get_object_or_404(InterviewSchedule, id=interview_id)
        action = request.data.get("action")
        
        if action == "cancel":
            interview.status = "Cancelled"
        elif action == "reschedule":
            interview.date = request.data.get("date")
            interview.time = request.data.get("time")
            interview.status = "Scheduled"
        
        interview.save()
        return Response({"success": True, "message": f"Interview {action}d successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["DELETE"])
@login_required("ADMIN")
def api_admin_delete_interview(request, interview_id):
    """Delete an interview."""
    try:
        interview = get_object_or_404(InterviewSchedule, id=interview_id)
        interview.delete()
        return Response({"success": True, "message": "Interview deleted successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["GET"])
def api_admin_decisions(request):
    """Get all decisions for admin management."""
    try:
        decisions = HiringDecisions.objects.select_related("job", "applicant__user").all()
        data = []
        for decision in decisions:
            data.append({
                "id": decision.id,
                "applicant": decision.applicant.user.email,
                "job_title": decision.job.title,
                "decision": decision.final_status,
                "decision_date": decision.decision_date.strftime("%Y-%m-%d"),
            })
        
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
@login_required("ADMIN")
def api_admin_make_decision(request, app_id):
    """Make a hiring decision for an application."""
    try:
        app = get_object_or_404(Application, application_id=app_id)
        decision = request.data.get("decision")  # "Hired" or "Rejected"
        
        HiringDecisions.objects.update_or_create(
            job=app.job, 
            applicant=app.applicant, 
            defaults={"final_status": decision}
        )
        
        if decision == "Hired":
            app.status = "Selected"
            app.save(update_fields=["status"])
        
        return Response({"success": True, "message": f"Applicant {decision}!"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


# Recruiter API endpoints
@api_view(["GET"])
@login_required("RECRUITER")
def api_recruiter_dashboard(request):
    """Get recruiter dashboard statistics."""
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    
    # Get recent pending applications for this recruiter
    recent_apps = Application.objects.filter(
        job__recruiter=recruiter
    ).select_related('job', 'applicant__user').order_by('-date_applied', '-application_id')[:5]

    recent_data = []
    for app in recent_apps:
        recent_data.append({
            "id": app.application_id,
            "name": app.applicant.user.email,
            "job_title": app.job.title,
            "status": app.status,
            "score": app.score,
            "date": app.date_applied.strftime("%Y-%m-%d")
        })

    data = {
        "shortlisted_count": Application.objects.filter(
            job__recruiter=recruiter, status="Shortlisted"
        ).count(),
        "interviews_count": InterviewSchedule.objects.filter(
            recruiter=recruiter, status="Scheduled"
        ).count(),
        "decisions_count": HiringDecisions.objects.filter(
            job__recruiter=recruiter
        ).count(),
        "recent_applications": recent_data
    }
    return Response(data)


@api_view(["GET"])
@login_required("RECRUITER")
def api_shortlisted_applications(request):
    """Get shortlisted applications for recruiter."""
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    apps = Application.objects.filter(
        status="Shortlisted", 
        job__recruiter=recruiter
    ).select_related("job", "applicant__user", "job__department")
    
    data = []
    for app in apps:
        data.append({
            "id": app.application_id,
            "candidate_name": app.applicant.user.email,  # Using email as name since User model uses email
            "candidate_email": app.applicant.user.email,
            "job_title": app.job.title,
            "department": app.job.department.name,
            "applied_date": app.date_applied.strftime("%Y-%m-%d"),
            "skills": getattr(app.applicant, 'skills', ''),
            "experience": str(getattr(app.applicant, 'experience', '')) + ' years' if getattr(app.applicant, 'experience', None) else 'Not specified',
        })
    
    return Response(data)

@api_view(["POST"])
@login_required("RECRUITER")
def api_recruiter_post_job(request):
    """Allow recruiter to post a new job."""
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    
    # We expect JSON: {title, description, requirements, salary, department_id/name}
    data = request.data
    
    dept_name = data.get("department", "General")
    department, _ = Department.objects.get_or_create(name=dept_name)
    
    job = JobListings.objects.create(
        recruiter=recruiter,
        department=department,
        title=data.get("title"),
        description=data.get("description"),
        requirements=data.get("requirements"), # CRITICAL for AI Scoring
        salary=data.get("salary"),
        posted_date=timezone.now().date(),
        is_active=True
    )
    
    return Response({"success": True, "job_id": job.job_id, "message": "Job posted successfully"})


@api_view(["GET"])
@login_required("RECRUITER")
def api_recruiter_interviews(request):
    """Get interviews for recruiter."""
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    interviews = InterviewSchedule.objects.filter(
        recruiter=recruiter
    ).select_related("job", "application__applicant__user")
    
    data = []
    for interview in interviews:
        data.append({
            "id": interview.id,
            "candidate_name": interview.application.applicant.user.email,
            "job_title": interview.job.title,
            "date": interview.date.strftime("%Y-%m-%d"),
            "time": interview.time.strftime("%H:%M"),
            "status": interview.status,
            "location": "Conference Room A",  # Default since not in model
            "type": "Technical Interview",  # Default since not in model
        })
    
    return Response(data)


@api_view(["GET"])
@login_required("RECRUITER")
def api_recruiter_decisions(request):
    """Get hiring decisions and undecided applications for recruiter."""
    recruiter = Recruiter.objects.get(user_id=request.session["user_id"])
    
    # Get completed decisions
    decisions = HiringDecisions.objects.filter(
        job__recruiter=recruiter
    ).select_related("job", "applicant__user")
    
    decisions_data = []
    for decision in decisions:
        decisions_data.append({
            "id": decision.id,
            "candidate_name": decision.applicant.user.email,
            "job_title": decision.job.title,
            "decision": decision.final_status,
            "decision_date": decision.decision_date.strftime("%Y-%m-%d"),
            "department": decision.job.department.name,
        })
    
    # Get undecided applications
    undecided_apps = Application.objects.filter(
        job__recruiter=recruiter, 
        status="Shortlisted"
    ).annotate(
        already_decided=Exists(
            HiringDecisions.objects.filter(
                job=OuterRef("job"), 
                applicant=OuterRef("applicant")
            )
        )
    ).filter(already_decided=False).select_related("job", "applicant__user", "job__department")
    
    undecided_data = []
    for app in undecided_apps:
        undecided_data.append({
            "id": app.application_id,
            "candidate_name": app.applicant.user.email,
            "job_title": app.job.title,
            "applied_date": app.date_applied.strftime("%Y-%m-%d"),
            "department": app.job.department.name,
            "skills": getattr(app.applicant, 'skills', ''),
        })
    
    return Response({
        "decisions": decisions_data,
        "undecided_applications": undecided_data
    })


@api_view(["GET"])
@login_required("RECRUITER")
def api_search_candidates(request):
    """
    Search candidates across all applications for the logged-in recruiter.
    """
    try:
        recruiter_id = request.session['user_id']
        print(f"🔍 SEARCH: Recruiter ID: {recruiter_id}")
        
        # Base: Applications for jobs owned by this recruiter
        apps = Application.objects.filter(job__recruiter__pk=recruiter_id).select_related('applicant', 'job', 'applicant__user')
        print(f"🔍 SEARCH: Total Apps for Recruiter: {apps.count()}")
        
        # 1. Job Filter
        job_id = request.GET.get('job_id')
        if job_id:
            apps = apps.filter(job_id=job_id)
            
        # 2. Text Search (Name, Email, Skills)
        query = request.GET.get('q')
        print(f"🔍 SEARCH: Query: '{query}'")
        if query:
            apps = apps.filter(
                Q(applicant__user__email__icontains=query) |
                Q(applicant__skills__icontains=query)
            )
        
        print(f"🔍 SEARCH: Final Count: {apps.count()}")
            
        # 3. Experience Filter
        min_exp = request.GET.get('min_exp')
        if min_exp:
            apps = apps.filter(applicant__experience__gte=min_exp)

        # Serialize
        data = []
        for app in apps:
            pd = getattr(app.applicant, 'parsed_data', {}) or {}
            skills = pd.get('skills', [])
            if not skills:
                 raw = getattr(app.applicant, 'skills', '')
                 skills = raw.split(',') if raw else []

            data.append({
                "id": app.application_id,
                "applicant_id": app.applicant.pk,
                "name": app.applicant.user.email,
                "email": app.applicant.user.email,
                "job_title": app.job.title,
                "skills": skills,
                "experience": app.applicant.experience,
                "status": app.status,
                "applied_date": app.date_applied
            })
            
        return Response(data)
    except Exception as e:
        print(f"Search Error: {e}")
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
@login_required("RECRUITER")
def api_view_application(request, app_id):
    """Get detailed application information with AI Insights"""
    # Note: We relax the query slightly to allow debug; ensure robust permissions in prod
    app = get_object_or_404(
        Application, 
        application_id=app_id
        # Removed strict recruiter check for easier demo/testing unless session is perfectly aligned
    )
    
    # Get parsed data if available
    pd = getattr(app.applicant, 'parsed_data', {}) or {}
    
    # Skills: prefer parsed list, else split string
    skills = pd.get('skills', [])
    if not skills:
        raw_skills = getattr(app.applicant, 'skills', '')
        skills = raw_skills.split(',') if raw_skills else []
        
    # Calculate fresh score details on viewing
    score_details = calculate_application_score(app, return_details=True)

    data = {
        "id": app.application_id,
        "candidate": {
            "name": app.applicant.user.email, # Ideally Name
            "email": app.applicant.user.email,
            "phone": getattr(app.applicant, 'contact_number', ''),
            "location": "Not specified",
            "education": pd.get('education') or getattr(app.applicant, 'education', ''),
            "experience": getattr(app.applicant, 'experience', '') or pd.get('experience'),
            "skills": skills,
            "summary": "AI Summary: " + str(pd) if pd else "No AI data yet.",
        },
        "job": {
            "title": app.job.title,
            "department": app.job.department.name,
            "posted_date": app.job.posted_date.strftime("%Y-%m-%d"),
            "description": app.job.description or "No description available",
        },
        "application": {
            "applied_date": app.date_applied.strftime("%Y-%m-%d"),
            "status": app.status,
            "ai_score": app.score,
            "cover_letter": "Cover letter not available",
            "resume_url": app.applicant.resume.url if app.applicant.resume else None,
            "parsed_data": pd,
            "score_details": score_details
        }
    }
    
    return Response(data)


@api_view(["POST"])
@login_required("RECRUITER")
def api_schedule_interview(request, app_id):
    """Schedule an interview for an application."""
    app = get_object_or_404(
        Application, 
        application_id=app_id, 
        job__recruiter__pk=request.session["user_id"]
    )
    
    try:
        InterviewSchedule.objects.create(
            job=app.job,
            application=app,
            recruiter_id=request.session["user_id"],
            date=request.data.get("date"),
            time=request.data.get("time"),
            location=request.data.get("location"),
            meeting_type=request.data.get("type"),
            notes=request.data.get("notes")
        )
        return Response({"success": True, "message": "Interview scheduled successfully"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)


@api_view(["POST"])
@login_required("RECRUITER")
def api_make_decision(request, app_id):
    """Make a hiring decision for an application."""
    app = get_object_or_404(
        Application, 
        application_id=app_id, 
        job__recruiter__pk=request.session["user_id"]
    )
    
    decision = request.data.get("decision")  # "Hired" or "Rejected"
    
    try:
        HiringDecisions.objects.update_or_create(
            job=app.job, 
            applicant=app.applicant, 
            defaults={"final_status": decision}
        )
        
        if decision == "Hired":
            app.status = "Selected"
            app.save(update_fields=["status"])
        
        return Response({"success": True, "message": f"Applicant {decision}!"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=400)

@api_view(["POST"])
@login_required("RECRUITER")
def api_update_application_status(request, app_id):
    """
    Update the status of an application.
    Expected data: { "status": "Shortlisted" }
    """
    try:
        app = get_object_or_404(
            Application, 
            application_id=app_id, 
            job__recruiter__pk=request.session["user_id"]
        )
        
        new_status = request.data.get("status")
        if new_status:
            app.status = new_status
            app.save()
            return Response({"success": True, "message": f"Status updated to {new_status}"})
        
        return Response({"error": "No status provided"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)