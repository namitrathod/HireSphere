from django.core.management.base import BaseCommand
from core.models import User, Department, Recruiter, JobListings, Applicant, Application, InterviewSchedule, HiringDecisions
from django.utils import timezone
import datetime
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Departments
        deps = ['Engineering', 'Human Resources', 'Sales', 'Marketing', 'Finance']
        departments = {}
        for d_name in deps:
            dep, created = Department.objects.get_or_create(name=d_name)
            departments[d_name] = dep
        self.stdout.write(f'Created {len(departments)} departments')

        # 2. Recruiters
        recruiters_data = [
            {'email': 'recruiter1@hiresphere.com', 'name': 'John Recruiter', 'dep': 'Engineering'},
            {'email': 'recruiter2@hiresphere.com', 'name': 'Sarah HR', 'dep': 'Human Resources'},
        ]
        
        recruiters = []
        for r_data in recruiters_data:
            user, created = User.objects.get_or_create(
                email=r_data['email'],
                defaults={'role': 'RECRUITER', 'is_active': True}
            )
            if created:
                user.set_password('password123')
                user.save()
            
            recruiter, r_created = Recruiter.objects.get_or_create(
                user=user,
                defaults={'department': departments[r_data['dep']]}
            )
            recruiters.append(recruiter)
        self.stdout.write(f'Created {len(recruiters)} recruiters')

        # 3. Job Listings
        jobs_data = [
            {
                'title': 'Senior Stick Fetcher',
                'description': 'We need an expert in fetching sticks from lakes and rivers.',
                'salary': 120000.00,
                'requirements': '5+ years of fetch experience.',
                'recruiter': recruiters[0],
                'department': departments['Engineering']
            },
            {
                'title': 'Chief Nap Officer',
                'description': 'Responsible for testing all office couches.',
                'salary': 85000.00,
                'requirements': 'Ability to sleep for 8 hours straight.',
                'recruiter': recruiters[1],
                'department': departments['Human Resources']
            },
             {
                'title': 'Frontend Wizard',
                'description': 'React master needed to build beautiful UIs.',
                'salary': 110000.00,
                'requirements': 'Expert in React, CSS, and magic.',
                'recruiter': recruiters[0],
                'department': departments['Engineering']
            }
        ]

        created_jobs = []
        for j_data in jobs_data:
            job, created = JobListings.objects.get_or_create(
                title=j_data['title'],
                defaults={
                    'description': j_data['description'],
                    'salary': Decimal(str(j_data['salary'])),
                    'requirements': j_data['requirements'],
                    'recruiter': j_data['recruiter'],
                    'department': j_data['department'],
                    'posted_date': timezone.now().date(),
                    'is_active': True
                }
            )
            created_jobs.append(job)
        self.stdout.write(f'Created {len(created_jobs)} jobs')

        # 4. Applicants (Job Seekers)
        applicants_data = [
            {'email': 'seeker1@test.com', 'skills': 'Python, Django'},
            {'email': 'seeker2@test.com', 'skills': 'React, CSS'},
            {'email': 'seeker3@test.com', 'skills': 'Sleeping, Eating'},
        ]

        created_applicants = []
        for app_data in applicants_data:
            user, created = User.objects.get_or_create(
                email=app_data['email'],
                defaults={'role': 'JOBSEEKER', 'is_active': True}
            )
            if created:
                user.set_password('password123')
                user.save()

            applicant, a_created = Applicant.objects.get_or_create(
                user=user,
                defaults={
                    'contact_number': '555-0100',
                    'experience': 3,
                    'skills': app_data['skills'],
                    'education': 'B.S. Computer Science'
                }
            )
            created_applicants.append(applicant)
        self.stdout.write(f'Created {len(created_applicants)} applicants')

        # 5. Applications
        # Seeker 1 applies to Job 1
        app1, c1 = Application.objects.get_or_create(
            job=created_jobs[0],
            applicant=created_applicants[0],
            defaults={'status': 'Pending'}
        )

        # Seeker 2 applies to Job 3 (React job)
        app2, c2 = Application.objects.get_or_create(
            job=created_jobs[2],
            applicant=created_applicants[1],
            defaults={'status': 'Shortlisted'}
        )
        
        self.stdout.write('Created applications')
        
        # 6. Interviews
        # Interview for Seeker 2
        InterviewSchedule.objects.get_or_create(
            job=created_jobs[2],
            application=app2,
            recruiter=recruiters[0],
            date=timezone.now().date() + datetime.timedelta(days=2),
            time=datetime.time(14, 30),
            defaults={'status': 'Scheduled'}
        )
        self.stdout.write('Created interviews')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
