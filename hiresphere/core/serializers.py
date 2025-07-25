# core/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    Department, JobListings, Applicant, Application,
    InterviewSchedule, HiringDecisions
)

# ────────────────────────────────────────────────────────────────
# Auth / user-related
# ────────────────────────────────────────────────────────────────
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["id", "email", "role"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ["email", "password"]

    def create(self, validated_data):
        user = User(email=validated_data["email"], role="JOBSEEKER")
        user.set_password(validated_data["password"])
        user.save()
        Applicant.objects.create(user=user)          # auto-create profile
        return user


# ────────────────────────────────────────────────────────────────
# Department
# ────────────────────────────────────────────────────────────────
class DepartmentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="department_id", read_only=True)
    class Meta:
        model  = Department
        fields = ["id", "name"]


# ────────────────────────────────────────────────────────────────
# Job listings (list vs. detail serializers)
# ────────────────────────────────────────────────────────────────
class JobSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="job_id", read_only=True)
    department = serializers.CharField(source="department.name")

    class Meta:
        model  = JobListings
        fields = ["id", "title", "department", "posted_date"]


class JobDetailSerializer(serializers.ModelSerializer):
    department     = DepartmentSerializer()
    recruiter_name = serializers.CharField(source="recruiter.user.email")

    class Meta:
        model  = JobListings
        fields = [
            "job_id", "title", "description", "salary", "requirements",
            "posted_date", "department", "recruiter_name",
        ]


# ────────────────────────────────────────────────────────────────
# Application / interview / decision
# ────────────────────────────────────────────────────────────────
class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer()

    class Meta:
        model  = Application
        fields = ["application_id", "status", "date_applied", "job"]


class InterviewSerializer(serializers.ModelSerializer):
    job = JobSerializer()

    class Meta:
        model  = InterviewSchedule
        fields = ["id", "date", "time", "status", "job"]


class DecisionSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title")

    class Meta:
        model  = HiringDecisions
        fields = ["id", "final_status", "decision_date", "job_title"]
