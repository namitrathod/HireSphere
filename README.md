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
- Applications page
- Decision page
- Job details page
- Job listing page
- Scheduled interview page
- Signup page

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