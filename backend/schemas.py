from pydantic import BaseModel, EmailStr
from typing import Optional ,List
from datetime import datetime

# =========================
# Candidate Schemas
# =========================

class CandidateCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    position: str
    experience: Optional[str] = None
    skills: Optional[str] = None
    resume: Optional[str] = None
    notes: Optional[str] = None
    match_score: int = 0
    status: str = "Applied"


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[str] = None
    resume: Optional[str] = None
    notes: Optional[str] = None
    match_score: Optional[int] = None
    status: Optional[str] = None


class CandidateResponse(CandidateCreate):
    id: int

    class Config:
        from_attributes = True


# =========================
# Task Schemas
# =========================

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str
    status: str = "Pending"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    status: Optional[str] = None


class TaskResponse(TaskCreate):
    id: int

    class Config:
        from_attributes = True
        
        
# =========================
# Interview Schemas
# =========================

class InterviewCreate(BaseModel):
    candidate_id: int
    position: str
    interview_date: datetime
    interviewer: Optional[str] = "Virtual HR"
    mode: str = "Video"
    status: str = "Scheduled"
    notes: Optional[str] = None


class InterviewUpdate(BaseModel):
    candidate_id: Optional[int] = None
    position: Optional[str] = None
    interview_date: Optional[datetime] = None
    interviewer: Optional[str] = None
    mode: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    position: str
    interview_date: datetime
    interviewer: Optional[str]
    mode: str
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True