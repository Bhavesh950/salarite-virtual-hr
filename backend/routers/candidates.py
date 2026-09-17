from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Candidate
from schemas import CandidateCreate, CandidateResponse, CandidateUpdate


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


# =========================
# CREATE CANDIDATE
# =========================
@router.post("/", response_model=CandidateResponse)
def create_candidate(
    candidate: CandidateCreate,
    db: Session = Depends(get_db)
):
    existing_candidate = db.query(Candidate).filter(
        Candidate.email == candidate.email
    ).first()

    if existing_candidate:
        raise HTTPException(
            status_code=400,
            detail="Candidate with this email already exists"
        )

    new_candidate = Candidate(
        name=candidate.name,
        email=candidate.email,
        phone=candidate.phone,
        position=candidate.position,
        experience=candidate.experience,
        skills=candidate.skills,
        resume=candidate.resume,
        notes=candidate.notes,
        match_score=candidate.match_score,
        status=candidate.status
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return new_candidate


# =========================
# GET ALL CANDIDATES
# =========================
@router.get("/", response_model=list[CandidateResponse])
def get_candidates(
    db: Session = Depends(get_db)
):
    return db.query(Candidate).all()


# =========================
# UPDATE CANDIDATE
# =========================
@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(
    candidate_id: int,
    candidate: CandidateUpdate,
    db: Session = Depends(get_db)
):
    existing_candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not existing_candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    if candidate.name is not None:
        existing_candidate.name = candidate.name

    if candidate.email is not None:
        existing_candidate.email = candidate.email

    if candidate.phone is not None:
        existing_candidate.phone = candidate.phone

    if candidate.position is not None:
        existing_candidate.position = candidate.position

    if candidate.experience is not None:
        existing_candidate.experience = candidate.experience

    if candidate.skills is not None:
        existing_candidate.skills = candidate.skills

    if candidate.resume is not None:
        existing_candidate.resume = candidate.resume

    if candidate.notes is not None:
        existing_candidate.notes = candidate.notes

    if candidate.match_score is not None:
        existing_candidate.match_score = candidate.match_score

    if candidate.status is not None:
        existing_candidate.status = candidate.status

    db.commit()
    db.refresh(existing_candidate)

    return existing_candidate


# =========================
# DELETE CANDIDATE
# =========================
@router.delete("/{candidate_id}")
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    existing_candidate = db.query(Candidate).filter(
        Candidate.id == candidate_id
    ).first()

    if not existing_candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    db.delete(existing_candidate)
    db.commit()

    return {
        "message": "Candidate deleted successfully"
    }