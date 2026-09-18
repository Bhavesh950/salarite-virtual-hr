Salarite Virtual HR
Salarite Virtual HR is a full-stack HR / Applicant Tracking System (ATS) built with Next.js, React, TypeScript, FastAPI, SQLAlchemy and SQLite.
Features
Candidate management: add, view, edit, update status and delete candidates.
Duplicate candidate emails are prevented by the backend.
Task management: create, update status and delete tasks.
Interview management: schedule, view, edit and manage interview status, mode, date, time and notes.
Positions API for HR position data.
Virtual HR interface with application-side demo interaction logic.
Backend database persistence, so Tasks, Candidates and Interviews remain after page refresh.
REST API architecture between frontend and backend.
Tech Stack
Frontend: Next.js, React, TypeScript, Tailwind CSS  
Backend: Python, FastAPI, SQLAlchemy, Pydantic, Uvicorn  
Database: SQLite  
Tools: Git, GitHub, VS Code
Project Structure
```text
salarite-virtual-hr/
├── app/
├── components/
├── context/
├── hooks/
├── lib/
├── types/
├── backend/
│   ├── routers/
│   │   ├── candidates.py
│   │   ├── interviews.py
│   │   ├── positions.py
│   │   └── tasks.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── main.py
├── .env.example
├── package.json
└── README.md
```
Run Locally
1. Clone
```bash
git clone https://github.com/Bhavesh950/salarite-virtual-hr.git
cd salarite-virtual-hr
```
2. Frontend
```bash
npm install
npm run dev
```
Frontend:
`http://localhost:3000`
3. Backend
Open a second terminal:
```bash
cd backend
python -m venv venv
```
Windows:
```powershell
.\venv\Scripts\activate
```
Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic email-validator
```
Start:
```bash
python -m uvicorn main:app --reload
```
Backend:
`http://127.0.0.1:8000`
Swagger API documentation:
`http://127.0.0.1:8000/docs`
If Windows PowerShell blocks npm/activation scripts, the backend can also be started directly with:
```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```
and the frontend with:
```powershell
cmd /c npm run dev
```
Local Architecture
```text
Browser
   |
   v
Next.js Frontend
localhost:3000
   |
   | REST API requests
   v
FastAPI Backend
127.0.0.1:8000
   |
   v
SQLite Database
```
API Endpoints
Tasks
```text
GET    /tasks/
POST   /tasks/
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}
```
Candidates
```text
GET    /candidates/
POST   /candidates/
PUT    /candidates/{candidate_id}
DELETE /candidates/{candidate_id}
```
Interviews
```text
GET    /interviews/
POST   /interviews/
PUT    /interviews/{interview_id}
DELETE /interviews/{interview_id}
```
Positions
```text
GET    /positions/
```
Data Persistence
The frontend sends CRUD requests to FastAPI. FastAPI uses SQLAlchemy to store the data in the database.
Therefore, Tasks, Candidates and Interviews are not dependent only on temporary frontend state and can persist after a browser refresh.
For production deployment, a managed database such as PostgreSQL is preferable. SQLite hosted on a platform may have storage limitations depending on the hosting configuration.
Virtual HR / AI
The current Virtual HR feature uses application-side/demo interaction logic and does not require an external AI API key.
A real LLM provider can be integrated later. If that is done, the secret API key should be stored as a backend environment variable and should never be exposed in frontend code.
Environment Variables
Private secrets must not be committed to GitHub.
Use `.env` for local secrets and keep it excluded from Git. `.env.example` can be used as the template for required environment variables.
The current project does not require an AI API key for the existing Virtual HR demo.
Deployment
The application can be deployed by hosting the FastAPI backend and Next.js frontend separately.
After the backend is deployed, the frontend API base URL must be changed from:
```text
http://127.0.0.1:8000
```
to the deployed backend URL, for example:
```text
https://your-backend.onrender.com
```
The frontend will then send API requests to the deployed FastAPI service instead of the local machine.
Future Improvements
Real LLM integration for Virtual HR
Resume upload and parsing
AI resume matching and candidate scoring
Authentication and role-based access
PostgreSQL production database
Email notifications
Calendar integration
Advanced HR analytics
Author
Bhavesh Mulchandani
GitHub: https://github.com/Bhavesh950
Repository: https://github.com/Bhavesh950/salarite-virtual-hr