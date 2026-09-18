from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import candidates  , tasks
import models
from routers import interviews
from routers.positions import router as positions_router
from routers.tasks import router as tasks_router
from routers.candidates import router as candidates_router
from routers.interviews import router as interviews_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salarite Virtual HR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(positions_router)
app.include_router(tasks.router)
app.include_router(interviews.router)



@app.get("/")
def root():
    return {
        "message": "Salarite Virtual HR API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }