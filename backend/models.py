from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    position = Column(String(100), nullable=False)

    experience = Column(String(50), nullable=True)
    skills = Column(Text, nullable=True)
    resume = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    match_score = Column(Integer, default=0)

    status = Column(String(50), default="Applied")
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    priority = Column(String(50), default="Medium")
    assigned_to = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, nullable=False)
    position = Column(String(100), nullable=False)
    interview_date = Column(DateTime, nullable=False)
    interviewer = Column(String(100), nullable=True)
    mode = Column(String(20), default="Video")
    status = Column(String(50), default="Scheduled")
    notes = Column(Text, nullable=True)