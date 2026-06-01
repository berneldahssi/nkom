"""Authentication endpoints — provision (Cognito), legacy login kept for compat."""

import uuid
import structlog

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_active_user
from app.models.flashcard import Flashcard
from app.models.material_section import MaterialSection
from app.models.quiz import QuizQuestion
from app.models.study_material import StudyMaterial
from app.models.user import User
from app.data.pstar_seed import PSTAR_SECTIONS, ROCA_SECTIONS

logger = structlog.get_logger()

router = APIRouter()


class ProvisionResponse(BaseModel):
    user_id: str
    email: str
    provisioned: bool


@router.post("/provision", response_model=ProvisionResponse)
async def provision(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
) -> ProvisionResponse:
    """Idempotent — called after Cognito login to seed preset materials for the user."""

    provisioned = False

    # ── PSTAR ────────────────────────────────────────────────────
    result = await db.execute(
        select(StudyMaterial).where(
            StudyMaterial.user_id == current_user.id,
            StudyMaterial.exam_code == "PSTAR",
        )
    )
    pstar_material = result.scalar_one_or_none()

    if pstar_material is None:
        provisioned = True
        pstar_material = StudyMaterial(
            user_id=current_user.id,
            title="PSTAR — Student Pilot Permit",
            subject="Air Regulations",
            description="Transport Canada TP 11919E — 192 questions across 14 sections. Official question bank for the Student Pilot Permit exam.",
            material_type="preset",
            exam_code="PSTAR",
            difficulty_level=2,
            generated_formats={"flashcards": "available", "quiz": "available"},
        )
        db.add(pstar_material)
        await db.flush()

        for sec_num, sec_title, sec_diff, sec_summary, questions in PSTAR_SECTIONS:
            section = MaterialSection(
                material_id=pstar_material.id,
                section_number=sec_num,
                title=sec_title,
                difficulty=sec_diff,
                summary=sec_summary,
            )
            db.add(section)
            await db.flush()

            diff_map = {"easy": 1, "medium": 2, "hard": 3}
            diff_int = diff_map.get(sec_diff, 2)

            for source_ref, q_text, options, correct_idx, hint in questions:
                correct_answer = options[correct_idx]
                qq = QuizQuestion(
                    material_id=pstar_material.id,
                    section_id=section.id,
                    source_ref=source_ref,
                    question_text=q_text,
                    question_type="multiple_choice",
                    options=options,
                    correct_answer=correct_answer,
                    hint=hint,
                    difficulty=diff_int,
                )
                db.add(qq)

                fc = Flashcard(
                    material_id=pstar_material.id,
                    section_id=section.id,
                    user_id=current_user.id,
                    front_text=q_text,
                    back_text=correct_answer,
                    mnemonic_hint=hint,
                )
                db.add(fc)

        logger.info("PSTAR material seeded", user_id=str(current_user.id))

    # ── ROC-A ────────────────────────────────────────────────────
    result = await db.execute(
        select(StudyMaterial).where(
            StudyMaterial.user_id == current_user.id,
            StudyMaterial.exam_code == "ROC-A",
        )
    )
    roca_material = result.scalar_one_or_none()

    if roca_material is None:
        provisioned = True
        roca_material = StudyMaterial(
            user_id=current_user.id,
            title="ROC-A — Restricted Operator Certificate",
            subject="Aeronautical Radiotelephony",
            description="ISED RIC-21 — Canadian aviation radio operator certification. Required to legally operate aircraft radio equipment.",
            material_type="preset",
            exam_code="ROC-A",
            difficulty_level=2,
            generated_formats={"flashcards": "coming_soon", "quiz": "coming_soon"},
        )
        db.add(roca_material)
        await db.flush()

        for sec_num, sec_title, sec_diff, sec_summary in ROCA_SECTIONS:
            section = MaterialSection(
                material_id=roca_material.id,
                section_number=sec_num,
                title=sec_title,
                difficulty=sec_diff,
                summary=sec_summary,
            )
            db.add(section)

        logger.info("ROC-A material seeded", user_id=str(current_user.id))

    await db.commit()

    return ProvisionResponse(
        user_id=str(current_user.id),
        email=current_user.email,
        provisioned=provisioned,
    )
