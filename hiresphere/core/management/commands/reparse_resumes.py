from django.core.management.base import BaseCommand
from core.models import Applicant
from core.tasks import parse_resume_task

class Command(BaseCommand):
    help = 'Force re-parsing of all uploaded resumes'

    def handle(self, *args, **options):
        applicants = Applicant.objects.all()
        for app in applicants:
            if app.resume:
                self.stdout.write(f"Reparsing {app.user.email}...")
                parse_resume_task(app.pk) # Run synchronously
            else:
                self.stdout.write(f"Skipping {app.user.email} (No resume)")
