# 🏗️ Engineering Design Doc: Async Candidate Screening Pipeline

**Status:** Draft  
**Author:** You (The Candidate)  
**Date:** 2026-01-03  

## 1. Context & Objective
Currently, `Hiresphere` processes applications synchronously. To scale to thousands of applicants and integrate high-latency AI operations (Resume Parsing), we must decouple the "User Action" from the "Background Processing".

**Objective:** Build a scalable, fault-tolerant pipeline where:
1.  Applicant uploads resume -> Immediate "Success" response.
2.  Backend asynchronously parses resume (extracts skills/experience).
3.  Backend asynchronously scores candidate against job description.
4.  System notifies recruiter of high-value candidates.

## 2. Architecture Overview
We will move to an **Event-Driven Architecture** using the **Producer-Consumer pattern**.

```mermaid
[Client (React)] 
      | POST /apply (File)
      v
[Gateway (Django)] ----> [Database (Postgres)]
      | (1) Save App (Status: PENDING)
      | (2) Push Event (Task)
      v
[Message Broker (Redis)] 
      | (3) Distribute Task
      v
[Worker Cluster (Celery)]
      |
      +--> [Worker 1: Parser] --(Output)--> [Database]
      |       ^ Uses OpenAI / NLP
      |
      +--> [Worker 2: Scorer] --(Output)--> [Database]
              ^ Uses Job Description
```

## 3. Technology Stack Decisions
*   **Web Framework:** Django (Existing).
*   **Task Queue:** **Celery**. Industry standard for Python. Robust, handles retries, scheduling.
*   **Message Broker:** **Redis**. Fast, simple, supports pub/sub. (We will use a Cloud Redis tier for Dev).
*   **AI/NLP:** OpenAI API (GPT-4o-mini) for structured extraction (JSON mode).

## 4. Data Model Changes

### 4.1. `Applicant` Model
Needs to store the actual file and the AI-extracted data.
```python
class Applicant(models.Model):
    # ... existing fields
    resume_file = models.FileField(upload_to="resumes/", null=True)
    
    # AI Extracted Data (JSON ensures flexibility)
    parsed_data = models.JSONField(default=dict, blank=True) 
```

### 4.2. `Application` Model
Needs to track the state of the pipeline.
```python
class Application(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending AI Scan"),
        ("PROCESSING", "Analyzing..."),
        ("COMPLETED", "Scanned"),
        ("FAILED", "Scan Failed")
    ]
    ai_status = models.CharField(default="PENDING", ...)
    match_score = models.FloatField(null=True)  # 0.0 to 100.0
```

## 5. Implementation Stages (The Guide)

### Stage 1: Infrastructure (The Plumbing)
*   **Goal:** Get Celery running and talking to Django.
*   **Action:** Install `celery`, `redis`. Configure `celery.py`. Connect to a Redis instance.
*   **Proof:** Run a dummy task `add(2, 2)` asynchronously.

### Stage 2: The Data Layer
*   **Goal:** Update Database to store resumes and status.
*   **Action:** Modify Models, Run Migrations. Update `Applicant` model.

### Stage 3: The Parsing Worker
*   **Goal:** Extract text from PDF.
*   **Action:** Create `tasks.py`. Implement `parse_resume(applicant_id)`.
*   **Tech:** `pdfminer.six` for text, `OpenAI` for extraction.

### Stage 4: The Pipeline Orchestrator
*   **Goal:** Chain the events.
*   **Action:** When `parse_resume` finishes successfully, automatically trigger `calculate_score`.
*   **Pattern:** Use Celery **Chains** (`parse.s() | score.s()`).

### Stage 5: Visibility (Frontend)
*   **Goal:** Show the recruiter the live status.
*   **Action:** Update Recruiter Dashboard to show "Analyzing..." vs "Match Score: 95%".

---

## 6. Coding Standards (FAANG Style)
*   **Type Hinting:** All functions must have Python type hints.
*   **Error Handling:** Celery tasks must try/except blocks and log errors, not just crash.
*   **Idempotency:** Tasks should be safe to run twice (e.g. if the worker crashes and retries, don't create duplicate records).
*   **Environment Variables:** No hardcoded API keys.



Q/A
in tasks.py

Why "Shared"? This decorator lets you define tasks without needing to import the specific app instance from 
applicantscreeningsystem/celery.py
. This prevents circular import errors and makes your apps reusable.

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
The error ImportError: cannot import name 'app' from 'applicantscreeningsystem.celery' is happening because of a circular import issue. The main project module is also called celery, which confuses Python.

The best practice fix is to rename your 
celery.py
 file to something else, like celery_app.py, or ensure the import path is explicit. However, in Django, the standard convention is indeed 
celery.py
, but we need to make sure 
init
.py
 imports it correctly.

It seems I might have introduced a syntax error or a circular dependency in my previous instruction.

Let's fix it by being very explicit.

1. Fix 
celery.py
I suspect the file content might have been pasted with a typo or Python is just confused by the module name. Let's make sure 
celery.py
 is perfectly correct.

2. Fix 
init
.py
We need to make sure we are importing from the .celery module.

I will attempt to fix the 
applicantscreeningsystem/celery.py
 file and 
applicantscreeningsystem/
init
.py
 file again.

But first, let's look closely at the error: ImportError: cannot import name 'app'. This means it found the file 
celery.py
 but couldn't find the variable app inside it.

Let me check the file content again.

Analyzed
celery.py#L1
My apologies! It seems the 
celery.py
 file is empty. That's why it can't import app.

I will write the content to it again.

Edited
celery.py
+15
-15
Now that the file actually has content, please try running the worker command again:

powershell
celery -A applicantscreeningsystem worker --pool=eventlet -l info
(And make sure your other runserver instance is still running!)


\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

