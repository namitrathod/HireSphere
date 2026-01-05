from django.core.management.base import BaseCommand
from core.models import JobListings, Recruiter, Department, User
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create a test job with rich requirements for AI scoring'

    def handle(self, *args, **options):
        # Find a recruiter
        recruiter = Recruiter.objects.first()
        if not recruiter:
            self.stdout.write(self.style.ERROR('No Recruiter found! Please create a user with role RECRUITER first.'))
            return

        dept, _ = Department.objects.get_or_create(name="Engineering")

        job = JobListings.objects.create(
            recruiter=recruiter,
            department=dept,
            title="Senior Python Developer (AI Test)",
            description="We are looking for an expert backend developer to join our AI team. You will work on scaling our scoring algorithms.",
            requirements="Python, Django, AWS, PostgreSQL, 5+ years experience, System Design",
            salary=160000.00,
            posted_date=timezone.now().date(),
            is_active=True
        )

        self.stdout.write(self.style.SUCCESS(f'Successfully created job: "{job.title}" (ID: {job.job_id})'))
        self.stdout.write(f'Requirements: {job.requirements}')
        self.stdout.write(f'Recruiter: {recruiter.user.email}')
