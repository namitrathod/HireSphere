# 🚀 Hiresphere - The AI-Native Applicant Tracking System

[![React](https://img.shields.io/badge/Front--End-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Back--End-Django_REST-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Celery](https://img.shields.io/badge/Async--Tasks-Celery-orange?style=for-the-badge&logo=celery)](https://docs.celeryproject.org/)
[![OpenAI](https://img.shields.io/badge/AI--Engine-OpenAI_GPT--4o-74aa9c?style=for-the-badge&logo=openai)](https://openai.com/)
[![Redis](https://img.shields.io/badge/Cache-Redis-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **Transforming recruitment from a guessing game into a data-driven science.**

Hiresphere is an advanced, production-ready **Applicant Screening System** designed to eliminate manual resume reviews. By leveraging **Large Language Models (LLMs)** and asynchronous processing pipelines, Hiresphere automatically parses, ranks, and shortlists candidates in real-time, allowing recruiters to focus on the top 1% of talent.

---

## ⚡ Why Hiresphere?

Traditional ATS tools are dumb keyword matchers. Hiresphere is different. It "reads" resumes like a human expert but at the speed of software.

### 🤖 Core Intelligence
*   **Context-Aware AI Scoring**: We don't just look for "Python". We analyze *how* it was used.
    *   **40% Skills Match**: Hard technical skill extraction.
    *   **30% Experience**: Depth and relevance of work history.
    *   **15% Education**: Degree relevance and prestige.
    *   **15% AI "Vibe Check"**: Qualitative assessment of soft skills, career trajectory, and summary quality using GPT-4o.
*   **Resume Parsing Pipeline**: Automated PDF extraction and normalization of diverse resume formats.

### 🚀 Real-Time Architecture
*   **Event-Driven updates**: Websockets push notifications to recruiters the second a resume is analyzed.
*   **Smart Alerts**: High-scoring candidates (>75%) trigger instant **Slack** and **Email** notifications to the hiring team.
*   **Scalable Background Tasks**: Celery & Redis handle heavy parsing jobs without blocking the user interface.

### � Comprehensive Ecosystem
*   **Recruiters**: Visual dashboard, one-click shortlisting, interview scheduling, and AI insights.
*   **Candidates**: Real-time status tracking, application history, and interview management.
*   **Admins**: Full system oversight, user management, and analytics.

---

## �️ Technology Stack

| Category | Technologies |
|:--- |:--- |
| **Frontend** | React.js, TailwindCSS, React-Router, WebSockets (Socket.io) |
| **Backend** | Python, Django, Django REST Framework (DRF) |
| **AI & NLP** | OpenAI API (GPT-4o), Regex Pattern Matching |
| **Async Tasks** | Celery, Redis (Message Broker) |
| **Database** | SQLite (Dev) / PostgreSQL (Prod Ready) |
| **DevOps** | Docker, Git, Environmental Config |

---

## 📸 System Previews

### 1. The Recruiter Command Center
*AI-ranked candidates at a glance.*
<img width="1920" alt="recruiter_dashboard" src="https://github.com/user-attachments/assets/e59945bb-aecd-4367-ae2d-10de1990ef64" />

### 2. Deep Dive Candidate Analysis
*Detailed breakdown of scores across 4 key metrics.*
<img width="1920" alt="recruiter_shortlisted_can" src="https://github.com/user-attachments/assets/c7a56520-8c1e-4fe8-8671-915691e17f72" />

### 3. Hiring & Decision Flow
<img width="1920" alt="recruiter_hiring_decisionpage" src="https://github.com/user-attachments/assets/4c1e549e-26db-45dd-abe9-5f65867900fa" />

---

## 🚀 Quick Start Guide

### Prerequisites
*   Node.js v18+
*   Python 3.10+
*   Redis Server (Running locally or via Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/namitrathod/HireSphere.git
cd Hiresphere
```

### 2. Backend Setup
```bash
cd hiresphere
python -m venv .venv
# Activate venv (Windows: .venv\Scripts\activate | Mac/Linux: source .venv/bin/activate)
pip install -r requirements.txt

# Environment Config
# Create a .env file with:
# OPENAI_API_KEY=sk-...
# CELERY_BROKER_URL=redis://localhost:6379/0
# EMAIL_HOST_USER=...
# EMAIL_HOST_PASSWORD=...
# SLACK_WEBHOOK_URL=...

python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Ignite the Worker Engine ⚡
To process resumes and send alerts, you must run the Celery worker:
```bash
# In ./hiresphere directory:
celery -A applicantscreeningsystem worker --pool=eventlet -l info
```

---

## 🔒 Security & Best Practices

*   **Role-Based Access Control (RBAC)**: Strict separation between Applicants, Recruiters, and Admins.
*   **Secure Credentials**: Environment variable management for API keys and secrets.
*   **CSRF Protection**: Full Django CSRF token integration with React.

---

## 🤝 Contributing

We welcome contributions! Please follow the standard fork-and-pull request workflow.

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/AmazingAI`)
3.  Commit your changes
4.  Push to the branch
5.  Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by Namit Rathod**
*Empowering Recruiters with Artificial Intelligence.*
