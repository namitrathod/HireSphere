# 🚀 Hiresphere — AI-Native Applicant Tracking & Intelligence Platform

[![React](https://img.shields.io/badge/Frontend-React_18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django_5-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Kubernetes](https://img.shields.io/badge/Infrastructure-Kubernetes-326ce5?style=for-the-badge&logo=kubernetes)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Containerization-Docker-2496ed?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Celery](https://img.shields.io/badge/Async-Celery-orange?style=for-the-badge&logo=celery)](https://docs.celeryproject.org/)
[![OpenAI](https://img.shields.io/badge/AI-GPT--4o-74aa9c?style=for-the-badge&logo=openai)](https://openai.com/)

> **A production-grade, event-driven Applicant Tracking System that applies Large Language Models to rank candidates with human-level contextual understanding at scale.**

---

## 🧠 Problem Statement

Traditional Applicant Tracking Systems (ATS) are broken:
*   ❌ **Naive Keyword Matching**: Great candidates are rejected because they didn't use the exact specific buzzwords.
*   ❌ **Manual Bottlenecks**: Recruiters spend 70% of their time screening resumes instead of interviewing.
*   ❌ **Lack of Explainability**: Hiring decisions efficient but opaque.

**HireSphere solves this.** It replaces shallow regex matching with **Semantic Intelligence**. The system processes resumes asynchronously, scores candidates using properly weighted LLM-based reasoning, and delivers real-time recruiter insights via websockets.

---

## 🏗️ System Architecture (High-Level)

HireSphere follows a **Microservices-ready** architecture, containerized with Docker and orchestrated via Kubernetes. It is designed for **Scalability**, **Fault Tolerance**, and **Clean Separation of Concerns**.

```mermaid
graph TD
    User[Clients (Web/Mobile)] -->|HTTP/WebSocket| LB[Load Balancer / Ingress]
    LB --> Frontend[React Frontend Container]
    LB --> Backend[Django REST API Container]
    
    subgraph "Async Processing Layer"
        Backend -->|Writes| DB[(PostgreSQL)]
        Backend -->|Tasks| Redis[Redis Message Broker]
        Redis -->|Consumes| Celery[Celery Workers]
        Celery -->|Inference| OpenAI[GPT-4o Scoring Engine]
        Celery -->|Alerts| Slack[Slack Integration]
    end
    
    Celery -.->|Real-time Events| Backend
```

---

## 🎯 Key Capabilities

### � 1. AI-Driven Resume Intelligence
We move beyond simple keyword counting. The **Context-Aware Scoring Model** evaluates:
*   **40% Skills Match**: Technical hard skills relevance.
*   **30% Experience Depth**: Impact, tenure, and role progression.
*   **15% Education**: Domain alignment and academic background.
*   **15% "Vibe Check"**: Qualitative assessment of soft skills and career trajectory.

### ⚡ 2. Real-Time, Event-Driven Architecture
*   **Non-blocking Inference**: Resume parsing (OCR + NLP) is offloaded to **Celery + Redis** to prevent request timeout.
*   **Live Feedback**: **WebSockets** push updates to the dashboard instantly when a candidate is scored.
*   **Idempotency**: Background tasks are designed to be safe on retries.

### 👥 3. Role-Based Ecosystem
*   **Applicants**: Job discovery and real-time status tracking.
*   **Recruiters**: AI Insights, Visual Dashboards, One-click shortlisting.
*   **Admins**: System analytics and RBAC management.

---

## 📊 Engineering Highlights (FAANG-Style)
*   **Asynchronous Design**: Decoupled expensive AI inference from the user-facing API path.
*   **Horizontal Scalability**: Worker nodes (Celery) can be scaled independently of the API nodes based on queue depth.
*   **Explainable AI**: Every score comes with a "Why?" section, building trust with the human recruiter.
*   **Infrastructure as Code**: Fully containerized (Docker) and verifiable deployment manifests (Kubernetes).

---

## 📸 Product Walkthrough

| Recruiter Dashboard | Candidate Deep Dive |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/e59945bb-aecd-4367-ae2d-10de1990ef64" width="400"> | <img src="https://github.com/user-attachments/assets/c7a56520-8c1e-4fe8-8671-915691e17f72" width="400"> |

**More Views:**
*   [Hiring Decisions Flow](https://github.com/user-attachments/assets/4c1e549e-26db-45dd-abe9-5f65867900fa)
*   [Admin Overview](https://github.com/user-attachments/assets/211afcd5-c7e5-4b3e-826b-fa70f3211aaf)

---

## 🚀 Development Setup

### fast_track (Docker Compose)
The fastest way to spin up the entire stack locally.

1.  **Clone & Configure**
    ```bash
    git clone https://github.com/namitrathod/HireSphere.git
    cd Hiresphere
    # Create .env in ./hiresphere/ with your API keys (OPENAI_API_KEY, etc.)
    ```

2.  **Launch**
    ```bash
    docker-compose up --build
    ```
    *Access the app at `http://localhost:3000`*

### production_track (Kubernetes)
Deploy to a scalable cluster (EKS, GKE, or Docker Desktop).

```bash
# 1. Deploy Data Layer
kubectl apply -f k8s/redis.yml

# 2. Configure Secrets (Ensure k8s/secrets.yml is populated)
kubectl apply -f k8s/secrets.yml

# 3. Deploy Backend API & Workers
kubectl apply -f k8s/backend.yml

# 4. Deploy Frontend LoadBalancer
kubectl apply -f k8s/frontend.yml
```

---

## 🧪 Future Enhancements
*   **Model Benchmarking**: A/B testing GPT-4o vs Llama 3 for cost/performance.
*   **Bias Detection**: Automated fairness scoring to detect demographic skew in ranking.
*   **Vector Search**: Resume embedding search (RAG) for "Find candidates like X".

---

## 👨‍� Author

**Namit Rathod**
*Software Engineer | Backend & Distributed Systems*
*Building scalable, AI-first platforms.*
