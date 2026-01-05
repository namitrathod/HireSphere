from django.core.management.base import BaseCommand
from core.models import Application
from core.services import calculate_application_score

class Command(BaseCommand):
    help = 'Recalculate AI Scores for all applications'

    def handle(self, *args, **options):
        apps = Application.objects.all()
        self.stdout.write(f"Found {apps.count()} applications. Rescoring...")
        
        for app in apps:
            try:
                score = calculate_application_score(app)
                self.stdout.write(f"App #{app.pk}: {score}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to score App #{app.pk}: {e}"))
                
        self.stdout.write(self.style.SUCCESS('Done rescoring.'))
