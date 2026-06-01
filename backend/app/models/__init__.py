"""SQLAlchemy ORM models — import all models here for Alembic discovery."""

from app.models.user import User  # noqa: F401
from app.models.content import ContentUpload  # noqa: F401
from app.models.study_material import StudyMaterial  # noqa: F401
from app.models.material_section import MaterialSection  # noqa: F401
from app.models.flashcard import Flashcard  # noqa: F401
from app.models.quiz import QuizQuestion  # noqa: F401
from app.models.study_session import StudySession  # noqa: F401
