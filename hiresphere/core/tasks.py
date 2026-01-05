from celery import shared_task
import time
from core.models import Applicant
from core.services import extract_text_from_pdf, parse_resume_content
from django.core.mail import send_mail
from django.conf import settings
import requests
import json

@shared_task
def debug_task(x, y):
    """
    A simple task to prove the worker is running.
    """
    print(f"Adding {x} + {y}...")
    time.sleep(2)  # Simulate expensive operation
    return x + y

@shared_task
def parse_resume_task(applicant_id):
    try:
        # A. Get the applicant from DB
        applicant = Applicant.objects.get(pk=applicant_id)
        if not applicant.resume:
            print("No resume uploaded.")
            return
        # B. Get the full path to the file on disk
        file_path = applicant.resume.path
        print(f"📄 Parsing Resume: {file_path}")
        
        # C. Call our Service to get raw text
        raw_text = extract_text_from_pdf(file_path)
        
        # D. Call our Service to structure that text
        parsed_data = parse_resume_content(raw_text)
        
        # E. Save the result back to the DB
        applicant.parsed_data = parsed_data
        if 'skills' in parsed_data:
            applicant.skills = ", ".join(parsed_data['skills'])
        
        # Save Experience (Ensure integer)
        exp = parsed_data.get('experience', 0)
        if isinstance(exp, str):
            # sensitive extraction if AI returns "2 years"
            import re
            digits = re.findall(r'\d+', exp)
            exp = int(digits[0]) if digits else 0
        applicant.experience = exp

        # Save Education
        applicant.education = parsed_data.get('education', "")
            
        applicant.save()
        
        # F. Notify Recruiters (Real-Time)
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        
        try:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "recruiters",
                {
                    "type": "notification_message",
                    "data": {
                        "type": "RESUME_PROCESSED",
                        "title": "Resume Analysis Complete",
                        "message": f"AI finished parsing resume for {applicant.user.email}",
                        "applicant_id": applicant_id
                    }
                }
            )
        except Exception as ws_error:
             print(f"WebSocket Error: {ws_error}")

        
        # G. Calculate Scores & Notify
        from core.services import calculate_application_score
        # from django.core.mail import send_mail
        # import requests

        for app in applicant.applications.all():
             score = calculate_application_score(app)
             print(f"   [Task] App #{app.pk} Score: {score}")
             
             # H. Notification Logic (Threshold)
             THRESHOLD = 50.0  # Configure your threshold here
             if score >= THRESHOLD:
                   # 2. Prepare Message
                 # 2. Prepare Message
                 subject = f"🔥 Top Talent Alert: {applicant.first_name} scored {score}/100"
                 message = (
                     f"Candidate: {applicant.user.email}\n"
                     f"Job: {app.job.title}\n"
                     f"Score: {score}\n\n"
                     f"Login to view details: http://localhost:3000/recruiter/view-application/{app.application_id}"
                 )
                 # 3. Send Email to ALL Recruiters
                 # Get all recruiter emails
                 from core.models import Recruiter
                 recruiter_emails = list(Recruiter.objects.values_list('user__email', flat=True))
                 
                 if recruiter_emails:
                     try:
                         send_mail(
                             subject,
                             message,
                             settings.EMAIL_HOST_USER,
                             recruiter_emails,
                             fail_silently=False,
                         )
                         print(f"   [Mail] Sent alert to {len(recruiter_emails)} recruiters.")
                     except Exception as e:
                         print(f"   [Mail] Failed: {e}")
                 # 4. Send Slack Message
                 slack_url = settings.SLACK_WEBHOOK_URL # You might need to fetch this from os.environ directly if not in settings
                 if slack_url:
                     try:
                         slack_data = {
                             "text": f"🚀 *New Top Candidate!* \n> *{applicant.user.email}* just scored *{score}* for *{app.job.title}*."
                         }
                         requests.post(slack_url, json=slack_data)
                         print("   [Slack] Notification sent.")
                     except Exception as e:
                         print(f"   [Slack] Failed: {e}")

        print(f"✅ Successfully parsed Applicant #{applicant_id}")
        return parsed_data
    except Applicant.DoesNotExist:
        print("Applicant not found.")
    except Exception as e:
        print(f"❌ Error parsing resume: {e}")