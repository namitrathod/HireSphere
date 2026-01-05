from django.core.management.base import BaseCommand
from core.models import User, Applicant, Application, JobListings, Recruiter
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seeds candidates with parsed resume data for search testing'

    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding Rich Candidate Data...")

        # 1. Ensure we have a Job to apply to
        recruiter_user = User.objects.filter(role='RECRUITER').first()
        if not recruiter_user:
            self.stdout.write(self.style.ERROR("No Recruiter found. Run seed_data first."))
            return
            
        job = JobListings.objects.filter(recruiter__user=recruiter_user).first()
        if not job:
            job = JobListings.objects.create(
                recruiter=Recruiter.objects.get(user=recruiter_user),
                title="Senior Python Developer",
                department=None, 
                description="Test Job",
                requirements="Python, Django",
                location="Remote",
                salary=120000
            )

        # 2. Create Dummy Candidates with Skills
        candidates_data = [
            {
                "email": "alex.python@example.com",
                "skills": ["Python", "Django", "PostgreSQL", "Celery"],
                "exp": 5,
                "education": "BS Computer Science"
            },
            {
                "email": "sarah.react@example.com",
                "skills": ["React", "JavaScript", "Tailwind", "Redux"],
                "exp": 3,
                "education": "Bootcamp Grad"
            },
            {
                "email": "mike.java@example.com",
                "skills": ["Java", "Spring Boot", "Hibernate", "AWS"],
                "exp": 8,
                "education": "MS Engineering"
            },
             {
                "email": "emily.fullstack@example.com",
                "skills": ["Python", "React", "Docker", "Kubernetes"],
                "exp": 4,
                "education": "BS Physics"
            }
        ]

        for data in candidates_data:
            # Create User
            user, created = User.objects.get_or_create(
                email=data['email'],
                defaults={
                    'role': 'JOBSEEKER',
                    'is_active': True
                }
            )
            if created:
                user.set_password("password123")
                user.save()

            # Create Applicant Profile with Parsed Data
            applicant, _ = Applicant.objects.get_or_create(user=user)
            
            # SIMULATE AI PARSING RESULT
            parsed_json = {
                "skills": data['skills'],
                "education": data['education'],
                "experience": f"{data['exp']} years",
                "summary": f"Experienced developer with focus on {data['skills'][0]}."
            }
            
            applicant.parsed_data = parsed_json
            applicant.skills = ", ".join(data['skills'])
            applicant.experience = data['exp']
            applicant.save()

            # Create Application
            Application.objects.get_or_create(
                job=job,
                applicant=applicant,
                defaults={'status': 'Applied'}
            )
            
            self.stdout.write(f"   Created {data['email']} with skills: {data['skills']}")

        self.stdout.write(self.style.SUCCESS("✅ successfully seeded 4 candidates!"))
        self.stdout.write(self.style.SUCCESS("👉 Now go to Recruiter Dashboard and search for 'Python' or 'React'."))
