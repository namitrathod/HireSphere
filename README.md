# 🚀 Hiresphere - Applicant Screening System

A comprehensive web-based applicant screening and hiring management system built with React frontend and Django backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Hiresphere is a modern applicant screening system that streamlines the hiring process for organizations. It provides role-based access for job seekers, recruiters, and administrators with comprehensive features for job management, application tracking, interview scheduling, and decision making.

## ✨ Features

### 👥 Multi-Role System
- **Job Seekers**: Browse jobs, apply, track applications, view interviews and decisions
- **Recruiters**: Manage job postings, review applications, schedule interviews, make hiring decisions
- **Administrators**: Complete system oversight, user management, job management, and analytics

### 🎯 Core Functionality

#### For Job Seekers
- Browse available job postings
- Apply to jobs with profile information
- Track application status
- View scheduled interviews
- Check hiring decisions

#### For Recruiters
- Create and manage job postings
- Review and shortlist applications
- Schedule interviews with candidates
- Make hiring decisions
- View application details and candidate profiles

#### For Administrators
- **Dashboard Overview**: System statistics and quick actions
- **User Management**: Create, activate/deactivate users, manage roles
- **Job Management**: Create, edit, open/close, delete job postings
- **Applications Oversight**: Monitor all applications across the system
- **Interview Management**: Manage all scheduled interviews
- **Decision Management**: Review and approve hiring decisions

### 🔧 Technical Features
- Responsive design with Tailwind CSS
- Real-time data updates
- Role-based access control
- RESTful API architecture
- Database-driven screening criteria
- Session management and authentication

## 🛠 Tech Stack

### Frontend
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Fetch API** - HTTP requests

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database (can be configured for PostgreSQL/MySQL)
- **Django Authentication** - User management and sessions

### Development Tools
- **npm** - Package management
- **Git** - Version control
- **ESLint** - Code linting

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hiresphere
   ```

2. **Navigate to Django project**
   ```bash
   cd hiresphere
   ```

3. **Create virtual environment**
   ```bash
   python -m venv .venv
   ```

4. **Activate virtual environment**
   ```bash
   # Windows
   .venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate
   ```

5. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start Django server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start React development server**
   ```bash
   npm start
   ```

## 📖 Usage

### Accessing the Application

1. **Frontend**: Open `http://localhost:3000` in your browser
2. **Backend API**: Available at `http://localhost:8000`

### User Roles and Access

#### Job Seeker
- Register/Login with email
- Browse available jobs
- Apply to positions
- Track application status

#### Recruiter
- Login with recruiter credentials
- Access recruiter dashboard
- Manage job postings
- Review applications and schedule interviews

#### Administrator
- Login with admin credentials
- Access admin dashboard
- Manage all users and system settings
- Oversee entire hiring process

## 🔌 API Documentation

### Authentication Endpoints
- `POST /login/` - User login
- `POST /signup/` - User registration
- `GET /logout/` - User logout

### Job Endpoints
- `GET /api/jobs/` - List all jobs
- `GET /api/jobs/{id}/` - Get job details
- `POST /api/jobs/{id}/apply/` - Apply to job

### Admin Endpoints
- `GET /api/admin/dashboard-stats/` - Dashboard statistics
- `GET /api/admin/users/` - List all users
- `POST /api/admin/users/create/` - Create new user
- `GET /api/admin/jobs/` - List all jobs
- `POST /api/admin/jobs/create/` - Create new job
- `GET /api/admin/applications/` - List all applications
- `GET /api/admin/interviews/` - List all interviews
- `GET /api/admin/decisions/` - List all decisions

### Recruiter Endpoints
- `GET /api/recruiter/dashboard/` - Recruiter dashboard
- `GET /api/recruiter/shortlisted/` - Shortlisted applications
- `GET /api/recruiter/interviews/` - Recruiter interviews
- `POST /api/recruiter/schedule/{app_id}/` - Schedule interview

## 📁 Project Structure

```
Hiresphere/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/         # Shared components
│   │   ├── pages/             # Main pages
│   │   ├── recruiter/         # Recruiter-specific pages
│   │   │   ├── components/
│   │   │   └── pages/
│   │   ├── admin/             # Admin-specific pages
│   │   │   ├── components/
│   │   │   └── pages/
│   │   └── App.js
│   └── package.json
├── hiresphere/                 # Django backend
│   ├── core/                  # Main Django app
│   │   ├── models.py         # Database models
│   │   ├── views.py          # API views
│   │   ├── urls.py           # URL routing
│   │   └── serializers.py    # API serializers
│   ├── applicantscreeningsystem/  # Django settings
│   ├── manage.py
│   └── requirements.txt
├── screenshots/               # Project screenshots
└── README.md
```

## 🎨 Screenshots

The project includes screenshots of key features:
<img width="1920" height="1020" alt="loginpage" src="https://github.com/user-attachments/assets/b086de83-828b-4b5f-ac1c-dad7673c7f74" />
<img width="1920" height="1020" alt="signuppage'" src="https://github.com/user-attachments/assets/1e3c0756-071a-4fb2-a725-692f1cf5dc35" />
<img width="1920" height="1020" alt="admin_dashboardpage" src="https://github.com/user-attachments/assets/211afcd5-c7e5-4b3e-826b-fa70f3211aaf" />
<img width="1920" height="1020" alt="admin_applicationoverview" src="https://github.com/user-attachments/assets/d0ff6ba9-9919-4696-91bb-2f43766de3ee" />
<img width="1920" height="1020" alt="User_scheduledinterviewpage" src="https://github.com/user-attachments/assets/406a37b8-da94-4983-8845-17f43e8d7501" />
<img width="1920" height="1020" alt="user_joblistingpage" src="https://github.com/user-attachments/assets/2bd32fe4-19a1-498d-b561-12c7cb2359ff" />
<img width="1920" height="1020" alt="user_jobdetailspage" src="https://github.com/user-attachments/assets/eefcb828-4ffd-4ba1-ac0a-2861c5c772dd" />
<img width="1920" height="1020" alt="user_desicionpage" src="https://github.com/user-attachments/assets/be6d8001-6f62-40c1-8280-3808e1a3bc2c" />
<img width="1920" height="1020" alt="User_applicationspage" src="https://github.com/user-attachments/assets/47b72f67-a2ac-4b7e-ada6-750e02ed24f6" />
<img width="1920" height="1020" alt="recruiter_shortlisted_can" src="https://github.com/user-attachments/assets/c7a56520-8c1e-4fe8-8671-915691e17f72" />
<img width="1920" height="1020" alt="recruiter_scheduledinterview" src="https://github.com/user-attachments/assets/46a57a55-6ef7-49c3-b6a7-bb487513c00d" />
<img width="1920" height="1020" alt="recruiter_hiring_decisionpage" src="https://github.com/user-attachments/assets/4c1e549e-26db-45dd-abe9-5f65867900fa" />
<img width="1920" height="1020" alt="recruiter_dashboard" src="https://github.com/user-attachments/assets/e59945bb-aecd-4367-ae2d-10de1990ef64" />
<img width="1920" height="1020" alt="admin_usermanagement" src="https://github.com/user-attachments/assets/74ff1ec7-5d57-475d-a528-647668dfdf3e" />
<img width="1920" height="1020" alt="admin_scheduledInterview" src="https://github.com/user-attachments/assets/012fda4c-ef97-4b44-b1c7-0ebf000275b9" />
<img width="1920" height="1020" alt="admin_jobmanagment" src="https://github.com/user-attachments/assets/3d2323de-c5bc-4c40-9349-2bdd0c085465" />
<img width="1920" height="1020" alt="admin_decisionmanagment" src="https://github.com/user-attachments/assets/a1626730-42f1-4ff0-82ad-8de7f9af7784" />


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django community for the excellent web framework
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and API endpoints

---

**Made with ❤️ for better hiring processes**
