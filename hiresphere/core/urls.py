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
    path('api/recruiter/search/', views.api_search_candidates, name='api_search_candidates'),

    # ─── Admin (HTML views) ────────────────────────────────────────
    path("internal/admin/jobs/",         views.admin_jobs,  name="admin_jobs"),
    path("internal/admin/jobs/new/",     views.job_create,  name="job_add"),

    # ─── JSON APIs consumed by React SPA ───────────────────────────────
    path("api/jobs/",                     views.api_jobs,        name="api_jobs"),
    path("api/jobs/<int:pk>/",            views.api_job_detail,  name="api_job_detail"),
    path("api/jobs/<int:pk>/apply/",      views.api_job_apply,   name="api_job_apply"),
    path("api/applications/",             views.api_applications,name="api_applications"),
    path("api/interviews/",               views.api_interviews,  name="api_interviews"),
    path("api/decisions/",                views.api_decisions,   name="api_decisions"),
    path("api/departments/",              views.api_departments, name="api_departments"),
    
    # ─── Recruiter API endpoints ───────────────────────────────────
    path("api/recruiter/dashboard/",      views.api_recruiter_dashboard,      name="api_recruiter_dashboard"),
    path("api/recruiter/post-job/",      views.api_recruiter_post_job,       name="api_recruiter_post_job"),
    path("api/recruiter/shortlisted/",   views.api_shortlisted_applications, name="api_shortlisted_applications"),
    path("api/recruiter/interviews/",    views.api_recruiter_interviews,     name="api_recruiter_interviews"),
    path("api/recruiter/decisions/",     views.api_recruiter_decisions,      name="api_recruiter_decisions"),
    path("api/recruiter/applications/<int:app_id>/", views.api_view_application, name="api_view_application"),
    path("api/recruiter/schedule/<int:app_id>/", views.api_schedule_interview, name="api_schedule_interview"),
    path("api/recruiter/decision/<int:app_id>/", views.api_make_decision, name="api_make_decision"),
    path("api/recruiter/status/<int:app_id>/", views.api_update_application_status, name="api_update_application_status"),
    
    # ─── Admin API endpoints ───────────────────────────────────────
    path("api/admin/dashboard-stats/",   views.api_admin_dashboard_stats,    name="api_admin_dashboard_stats"),
    path("api/admin/users/",             views.api_admin_users,             name="api_admin_users"),
    path("api/admin/users/create/",      views.api_admin_create_user,       name="api_admin_create_user"),
    path("api/admin/users/<int:user_id>/update/", views.api_admin_update_user, name="api_admin_update_user"),
    path("api/admin/jobs/",              views.api_admin_jobs,              name="api_admin_jobs"),
    path("api/admin/jobs/create/",       views.api_admin_create_job,        name="api_admin_create_job"),
    path("api/admin/jobs/<int:job_id>/update/", views.api_admin_update_job, name="api_admin_update_job"),
    path("api/admin/jobs/<int:job_id>/delete/", views.api_admin_delete_job, name="api_admin_delete_job"),
    path("api/admin/applications/",      views.api_admin_applications,      name="api_admin_applications"),
    path("api/admin/interviews/",        views.api_admin_interviews,        name="api_admin_interviews"),
    path("api/admin/interviews/<int:interview_id>/update/", views.api_admin_update_interview, name="api_admin_update_interview"),
    path("api/admin/interviews/<int:interview_id>/delete/", views.api_admin_delete_interview, name="api_admin_delete_interview"),
    path("api/admin/decisions/",         views.api_admin_decisions,         name="api_admin_decisions"),
    path("api/admin/decisions/<int:app_id>/make/", views.api_admin_make_decision, name="api_admin_make_decision"),
    
    path("api/test/",                     views.test_api,        name="test_api"),
    path("api/test-data/",                views.api_test_data,   name="api_test_data"),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
