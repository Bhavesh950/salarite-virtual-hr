from fastapi import APIRouter

router = APIRouter(prefix="/positions", tags=["Positions"])

POSITIONS = [
    "Python Developer",
    "Data Analyst",
    "Senior Backend Engineer",
    "Frontend Developer",
    "HR Operations Specialist",
    "DevOps Engineer",
]

@router.get("/")
def get_positions():
    return POSITIONS