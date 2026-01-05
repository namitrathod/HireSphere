from django.core.management.base import BaseCommand
from core.models import User, Recruiter, Applicant, JobListings, Department, Application, InterviewSchedule
from django.utils import timezone
from core.services import calculate_application_score

class Command(BaseCommand):
    help = 'Wipe database and seed with perfect test data for demo'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Wiping Database...'))
        
        # 1. Delete all data (Order matters for Foreign Keys)
        InterviewSchedule.objects.all().delete()
        Application.objects.all().delete()
        JobListings.objects.all().delete()
        Recruiter.objects.all().delete()
        Applicant.objects.all().delete()
        User.objects.all().delete()
        Department.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Database Cleaned.'))

        # 2. Create Departments
        eng, _ = Department.objects.get_or_create(name="Engineering")
        hr, _ = Department.objects.get_or_create(name="Human Resources")

        # 3. Create Recruiter
        rec_user = User.objects.create(email="recruiter@test.com", role="RECRUITER")
        rec_user.set_password("password123")
        rec_user.save()
        recruiter = Recruiter.objects.create(user=rec_user, department=eng)
        self.stdout.write(f"Created Recruiter: recruiter@test.com / password123")

        # 4. Create Job (Python Developer) - WITH REQUIREMENTS
        job_python = JobListings.objects.create(
            recruiter=recruiter,
            department=eng,
            title="Senior Python Developer",
            description="We need a strong backend developer.",
            requirements="Python, Django, AWS, PostgreSQL, 5+ years experience",
            salary=150000.00,
            posted_date=timezone.now().date(),
            is_active=True
        )
        self.stdout.write(f"Created Job: {job_python.title} (Reqs: {job_python.requirements})")

        # 5. Create Candidates & Applications

        # Candidate A: Perfect Match
        user_a = User.objects.create(email="perfect@test.com", role="JOBSEEKER")
        user_a.set_password("password123")
        user_a.save()
        cand_a = Applicant.objects.create(
            user=user_a,
            first_name="Mr", last_name="Perfect",
            skills="Python, Django, AWS, PostgreSQL, Docker, Redis",
            experience=6,
            education="BS Computer Science",
            parsed_data={"skills": ["Python", "Django", "AWS"], "experience": 6}
        )
        app_a = Application.objects.create(job=job_python, applicant=cand_a, status="Applied")
        score_a = calculate_application_score(app_a)
        self.stdout.write(self.style.SUCCESS(f"   -> Perfect Candidate Score: {score_a}"))

        # Candidate B: Partial Match
        user_b = User.objects.create(email="partial@test.com", role="JOBSEEKER")
        user_b.set_password("password123")
        user_b.save()
        cand_b = Applicant.objects.create(
            user=user_b,
            first_name="Ms", last_name="Partial",
            skills="Python, Flask, SQL", # Missing Django, AWS
            experience=3,                # Less than 5
            education="Bootcamp",
            parsed_data={"skills": ["Python", "Flask"], "experience": 3}
        )
        app_b = Application.objects.create(job=job_python, applicant=cand_b, status="Applied")
        score_b = calculate_application_score(app_b)
        self.stdout.write(self.style.WARNING(f"   -> Partial Candidate Score: {score_b}"))

        # Candidate C: No Match
        user_c = User.objects.create(email="nomatch@test.com", role="JOBSEEKER")
        user_c.set_password("password123")
        user_c.save()
        cand_c = Applicant.objects.create(
            user=user_c,
             first_name="Jr", last_name="NoMatch",
            skills="Java, Spring, Hibernate", # Completely wrong stack
            experience=1,
            education="Self Taught",
            parsed_data={"skills": ["Java"], "experience": 1}
        )
        app_c = Application.objects.create(job=job_python, applicant=cand_c, status="Applied")
        score_c = calculate_application_score(app_c)
        self.stdout.write(self.style.ERROR(f"   -> No Match Candidate Score: {score_c}"))

        self.stdout.write(self.style.SUCCESS('Seed Complete! Log in as recruiter@test.com to see the scores.'))
