# core/urls.py
from django.urls import path
from django.shortcuts import redirect

from . import views   # <-- all view functions live in core/views.py


# ------------------------------------------------------------------
# helpers
# ------------------------------------------------------------------
def root_redirect(request):
    """Send bare '/' to the login page."""
    return redirect("/login/")


# ------------------------------------------------------------------
# URL patterns
# ------------------------------------------------------------------
urlpatterns: list[path] = [

    # ─── Root & Auth ───────────────────────────────────────────────
    path("",               root_redirect,      name="root"),
    path("login/",         views.login_view,   name="login"),
    path("logout/",        views.logout_view,  name="logout"),
    path("signup/",        views.signup_view,  name="signup"),

    # ─── Dashboards ────────────────────────────────────────────────
    path("dashboard/",                    views.dashboard,           name="dashboard"),
    path("internal/admin/dashboard/",    views.admin_dashboard,      name="admin_dashboard"),
    path("recruiter/dashboard/",         views.recruiter_dashboard,  name="recruiter_dashboard"),
    path("applicant/dashboard/",         views.applicant_dashboard,  name="applicant_dashboard"),

    # ─── Applicant (HTML views) ────────────────────────────────────
    path("jobs/",                    views.job_list,     name="job_list"),
    path("jobs/<int:pk>/",           views.job_detail,   name="job_detail"),
    path("jobs/apply/<int:pk>/",     views.job_apply,    name="job_apply"),
    path("applications/",            views.applications, name="applications"),
    path("interviews/",              views.interviews,   name="interview_list"),
    path("decisions/",               views.decisions,    name="decision_list"),

    # ─── Recruiter (HTML views) ────────────────────────────────────
    path("recruit/shortlisted/",             views.shortlisted,           name="shortlisted"),
    path("recruit/interviews/",              views.recruiter_interviews,  name="recruiter_interviews"),
    path("recruit/schedule/<int:app_id>/",   views.schedule_interview,    name="schedule_interview"),
    path("recruit/decisions/",               views.recruiter_decisions,   name="recruiter_decisions"),
    path("recruit/hire/<int:app_id>/",       views.hire,                  name="hire"),
    path("applications/view/<int:app_id>/",  views.view_application,      name="view_application"),

    # ─── Admin (HTML views) ────────────────────────────────────────
    path("internal/admin/jobs/",         views.admin_jobs,  name="admin_jobs"),
    path("internal/admin/jobs/new/",     views.job_create,  name="job_add"),

    # ─── JSON APIs consumed by React ───────────────────────────────
    path("api/jobs/",                     views.api_jobs,        name="api_jobs"),
    path("api/jobs/<int:pk>/",            views.api_job_detail,  name="api_job_detail"),
    path("api/jobs/<int:pk>/apply/",      views.api_job_apply,   name="api_job_apply"),
    path("api/applications/",             views.api_applications,name="api_applications"),
    path("api/interviews/",               views.api_interviews,  name="api_interviews"),
    path("api/decisions/",                views.api_decisions,   name="api_decisions"),
    path("api/test/",                     views.test_api,        name="test_api"),
]
