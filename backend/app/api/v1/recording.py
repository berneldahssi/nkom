"""
Recording API Endpoints
Handles audio file uploads, transcription, and material generation
"""

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import uuid4
import os
from datetime import datetime
from typing import Optional

from app.core.security import get_current_user
from app.core.database import get_db
from app.models import User, Recording, StudyMaterial
from app.schemas import RecordingCreate, RecordingResponse, MaterialGenerateRequest
from app.services.recording import RecordingService
from app.services.transcription import TranscriptionService
from app.services.content_generation import ContentGenerationService

router = APIRouter(prefix="/api/v1/recordings", tags=["recordings"])

# ========== UPLOAD RECORDING ==========

@router.post("/upload")
async def upload_recording(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    subject: Optional[str] = None,
    auto_generate: bool = True,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload an audio recording file

    Args:
        file: Audio file (MP3, M4A, WAV)
        title: Optional title for the recording
        subject: Optional subject/course name
        auto_generate: Whether to automatically generate study materials
        current_user: Authenticated user
        db: Database session

    Returns:
        Recording object with upload status and job ID

    Workflow:
    1. Validate file (format, size)
    2. Save file to S3
    3. Create Recording record in DB
    4. Queue transcription job
    5. Return recording details
    """
    try:
        # Validate file
        if file.size > 2 * 1024 * 1024 * 1024:  # 2GB limit
            raise HTTPException(status_code=400, detail="File too large (max 2GB)")

        if not file.content_type in ["audio/mpeg", "audio/m4a", "audio/wav", "audio/mp4"]:
            raise HTTPException(status_code=400, detail="Unsupported audio format")

        # Generate file key
        file_key = f"recordings/{current_user.id}/{uuid4()}.{file.filename.split('.')[-1]}"

        # Save to S3
        recording_service = RecordingService()
        s3_url = await recording_service.save_to_s3(file.file, file_key)

        # Create recording record
        recording = Recording(
            user_id=current_user.id,
            title=title or f"Recording - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            subject=subject,
            file_url=s3_url,
            file_key=file_key,
            file_size=file.size,
            status="processing",  # Waiting for transcription
        )
        db.add(recording)
        db.commit()
        db.refresh(recording)

        # Queue transcription job
        transcription_service = TranscriptionService()
        transcription_job = await transcription_service.transcribe_async(
            file_url=s3_url,
            recording_id=recording.id,
            user_id=current_user.id
        )

        recording.transcription_job_id = transcription_job["job_id"]
        db.commit()

        # If auto_generate, queue material generation after transcription
        if auto_generate:
            background_tasks.add_task(
                generate_materials_from_recording,
                recording_id=recording.id,
                user_id=current_user.id
            )

        return {
            "id": recording.id,
            "status": "processing",
            "title": recording.title,
            "file_size": recording.file_size,
            "transcription_job_id": transcription_job["job_id"],
            "estimated_time": 120,  # 2 minutes for 1 hour audio
            "auto_generate": auto_generate
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# ========== CHECK RECORDING STATUS ==========

@router.get("/{recording_id}/status")
async def get_recording_status(
    recording_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get transcription and generation status

    Response:
    {
        "id": "uuid",
        "status": "completed|processing|failed",
        "transcription_status": "completed|processing|failed",
        "generation_status": "completed|processing|failed",
        "transcribed_text": "...",  // Only if complete
        "materials_generated": {
            "summary": true,
            "flashcards": true,
            "quiz": true,
            "podcast": true,
            "concept_map": true,
            "memory_palace": true,
            "practice_problems": true
        }
    }
    """
    recording = db.query(Recording).filter(
        Recording.id == recording_id,
        Recording.user_id == current_user.id
    ).first()

    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")

    transcription_service = TranscriptionService()
    transcription_status = await transcription_service.get_job_status(
        recording.transcription_job_id
    )

    # Check generated materials
    materials = db.query(StudyMaterial).filter(
        StudyMaterial.recording_id == recording_id
    ).all()

    materials_generated = {
        "summary": any(m.material_type == "summary" for m in materials),
        "flashcards": any(m.material_type == "flashcards" for m in materials),
        "quiz": any(m.material_type == "quiz" for m in materials),
        "podcast": any(m.material_type == "podcast" for m in materials),
        "concept_map": any(m.material_type == "concept_map" for m in materials),
        "memory_palace": any(m.material_type == "memory_palace" for m in materials),
        "practice_problems": any(m.material_type == "practice_problems" for m in materials),
    }

    # Determine overall status
    if transcription_status["status"] == "completed":
        recording.status = "transcribed"
    elif transcription_status["status"] == "failed":
        recording.status = "failed"

    db.commit()

    return {
        "id": recording_id,
        "status": recording.status,
        "title": recording.title,
        "transcription_status": transcription_status["status"],
        "transcribed_text": recording.transcribed_text if recording.status == "transcribed" else None,
        "materials_generated": materials_generated,
        "created_at": recording.created_at,
        "duration": recording.duration,
    }


# ========== LIST USER'S RECORDINGS ==========

@router.get("/")
async def list_user_recordings(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all recordings for current user

    Returns paginated list of recordings with status
    """
    recordings = db.query(Recording).filter(
        Recording.user_id == current_user.id
    ).order_by(Recording.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "recordings": [
            {
                "id": r.id,
                "title": r.title,
                "subject": r.subject,
                "status": r.status,
                "duration": r.duration,
                "file_size": r.file_size,
                "created_at": r.created_at
            }
            for r in recordings
        ],
        "total": db.query(Recording).filter(Recording.user_id == current_user.id).count()
    }


# ========== DELETE RECORDING ==========

@router.delete("/{recording_id}")
async def delete_recording(
    recording_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a recording (and associated materials)
    """
    recording = db.query(Recording).filter(
        Recording.id == recording_id,
        Recording.user_id == current_user.id
    ).first()

    if not recording:
        raise HTTPException(status_code=404, detail="Recording not found")

    # Delete from S3
    recording_service = RecordingService()
    await recording_service.delete_from_s3(recording.file_key)

    # Delete associated materials
    db.query(StudyMaterial).filter(
        StudyMaterial.recording_id == recording_id
    ).delete()

    # Delete recording
    db.delete(recording)
    db.commit()

    return {"status": "deleted"}


# ========== BACKGROUND TASKS ==========

async def generate_materials_from_recording(
    recording_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Background task: Generate study materials from recording transcription
    Called after transcription is complete
    """
    try:
        recording = db.query(Recording).filter(Recording.id == recording_id).first()
        if not recording:
            return

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return

        # Get transcribed text
        transcription_service = TranscriptionService()
        transcription = await transcription_service.get_transcription(
            recording.transcription_job_id
        )

        if not transcription:
            recording.status = "failed"
            db.commit()
            return

        recording.transcribed_text = transcription["text"]
        recording.duration = transcription.get("duration", 0)
        db.commit()

        # Generate study materials
        content_service = ContentGenerationService()
        materials_request = MaterialGenerateRequest(
            content=transcription["text"],
            context_role=user.role,
            context_level=user.education_level,
            context_exam_type=user.exam_type,
            learning_style=user.learning_style,
        )

        materials = await content_service.generate_all_formats(materials_request)

        # Save materials to database
        for material_type, content in materials.items():
            material = StudyMaterial(
                user_id=user_id,
                recording_id=recording_id,
                material_type=material_type,
                content=content,
                title=f"{recording.title} - {material_type.title()}"
            )
            db.add(material)

        recording.status = "completed"
        db.commit()

    except Exception as e:
        print(f"Error generating materials: {str(e)}")
        recording = db.query(Recording).filter(Recording.id == recording_id).first()
        if recording:
            recording.status = "failed"
            db.commit()


# ========== DATABASE MODELS NEEDED ==========

"""
Required SQLAlchemy Models (add to app/models/):

class Recording(Base):
    __tablename__ = "recordings"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id = Column(String, ForeignKey("user.id"), nullable=False)
    title = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=True)
    file_url = Column(String(500), nullable=False)  # S3 URL
    file_key = Column(String(500), nullable=False)  # S3 key
    file_size = Column(Integer, nullable=False)  # bytes
    duration = Column(Integer, nullable=True)  # seconds
    transcribed_text = Column(Text, nullable=True)
    transcription_job_id = Column(String(255), nullable=True)
    status = Column(String(50), default="processing")  # processing|transcribed|completed|failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="recordings")
    materials = relationship("StudyMaterial", back_populates="recording")
"""
