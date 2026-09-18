from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Interview
from schemas import InterviewCreate, InterviewUpdate, InterviewResponse


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


@router.get("/", response_model=list[InterviewResponse])
def get_interviews(db: Session = Depends(get_db)):
    return db.query(Interview).order_by(
        Interview.interview_date
    ).all()


@router.post("/", response_model=InterviewResponse)
def create_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db)
):
    interview = Interview(
    candidate_id=data.candidate_id,
    position=data.position,
    interview_date=data.interview_date,
    interviewer=data.interviewer,
    mode=data.mode,
    status=data.status,
    notes=data.notes
)

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


@router.put("/{interview_id}", response_model=InterviewResponse)
def update_interview(
    interview_id: int,
    data: InterviewUpdate,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    update_data = data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(interview, key, value)

    db.commit()
    db.refresh(interview)

    return interview


@router.delete("/{interview_id}")
def delete_interview(
    interview_id: int,
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(
        Interview.id == interview_id
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    db.delete(interview)
    db.commit()

    return {
        "message": "Interview deleted successfully"
    }