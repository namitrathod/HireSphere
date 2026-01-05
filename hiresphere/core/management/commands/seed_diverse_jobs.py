from django.core.management.base import BaseCommand
from core.models import JobListings, Recruiter, Department, User
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create 3 diverse jobs with strict requirements for testing AI scoring'

    def handle(self, *args, **options):
        recruiter = Recruiter.objects.first()
        if not recruiter:
            self.stdout.write(self.style.ERROR('No Recruiter found.'))
            return

        dept_eng, _ = Department.objects.get_or_create(name="Engineering")
        dept_data, _ = Department.objects.get_or_create(name="Data Science")

        jobs = [
            {
                "title": "Frontend Developer (React)",
                "dept": dept_eng,
                "desc": "Join our frontend team to build beautiful UIs.",
                "reqs": "React, JavaScript, HTML, CSS, Redux, 3+ years experience",
                "salary": 120000.00
            },
            {
                "title": "Backend Developer (Python)",
                "dept": dept_eng,
                "desc": "Scale our backend infrastructure.",
                "reqs": "Python, Django, AWS, PostgreSQL, Redis, System Design, 5+ years experience",
                "salary": 140000.00
            },
            {
                "title": "Lead Data Scientist",
                "dept": dept_data,
                "desc": "Analyze massive datasets.",
                "reqs": "Python, SQL, Machine Learning, TensorFlow, PyTorch, Statistics, 7+ years experience",
                "salary": 160000.00
            }
        ]

        for j in jobs:
            job = JobListings.objects.create(
                recruiter=recruiter,
                department=j["dept"],
                title=j["title"],
                description=j["desc"],
                requirements=j["reqs"],
                salary=j["salary"],
                posted_date=timezone.now().date(),
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS(f'Created Job: "{job.title}" with Reqs: "{job.requirements}"'))
