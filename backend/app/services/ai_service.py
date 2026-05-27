"""AI service — wraps Claude API calls for content processing."""

import json
import structlog
from anthropic import Anthropic

from app.core.config import settings

logger = structlog.get_logger()

client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


async def extract_concepts(text: str) -> dict:
    """Use Claude to extract key concepts from raw text."""
    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert educator. Extract the key concepts, definitions, "
                    "and important facts from the following text. Return them as structured JSON "
                    "with keys: 'title', 'subject', 'concepts' (list of {term, definition, importance}), "
                    "'summary' (2-3 sentence overview).\n\n"
                    f"Text:\n{text}"
                ),
            }
        ],
    )
    try:
        content = message.content[0].text
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        return json.loads(content)
    except (json.JSONDecodeError, IndexError, AttributeError) as e:
        logger.error("Failed to parse concepts response", error=str(e))
        return {"title": "Untitled", "subject": "", "concepts": [], "summary": ""}


async def generate_summary(text: str) -> str:
    """Generate a structured summary of the learning material."""
    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": (
                    "You are an expert educator. Create a clear, well-structured study summary "
                    "from the following material. Use bullet points, key terms in bold, and "
                    "organize by topic. Make it optimal for learning and retention.\n\n"
                    f"Material:\n{text}"
                ),
            }
        ],
    )
    return message.content[0].text or ""


async def generate_flashcards(text: str, count: int = 10) -> list[dict]:
    """Generate flashcard Q&A pairs from text."""
    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": (
                    f"You are an expert educator. Create {count} flashcards from the following "
                    "material. Each flashcard should test a key concept. Return ONLY valid JSON with key "
                    "'flashcards' containing a list of {{front (question), back (answer), mnemonic_hint}}. "
                    "The front should be a question, the back should be the answer, and "
                    "mnemonic_hint should be a memory aid.\n\n"
                    f"Material:\n{text}"
                ),
            }
        ],
    )
    try:
        content = message.content[0].text
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        data = json.loads(content)
        return data.get("flashcards", [])
    except (json.JSONDecodeError, IndexError, AttributeError) as e:
        logger.error("Failed to parse flashcards response", error=str(e))
        return []


async def generate_quiz(text: str, count: int = 10) -> list[dict]:
    """Generate multiple-choice quiz questions from text."""
    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": (
                    f"You are an expert educator. Create {count} multiple-choice quiz questions "
                    "from the following material. Return ONLY valid JSON with key 'questions' containing "
                    "a list of {{question, options (list of 4 strings), correct_answer, explanation, "
                    "difficulty (1-5)}}.\n\n"
                    f"Material:\n{text}"
                ),
            }
        ],
    )
    try:
        content = message.content[0].text
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        data = json.loads(content)
        return data.get("questions", [])
    except (json.JSONDecodeError, IndexError, AttributeError) as e:
        logger.error("Failed to parse quiz response", error=str(e))
        return []


async def generate_podcast_script(text: str) -> str:
    """Generate a conversational podcast-style script from text."""
    message = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=3000,
        messages=[
            {
                "role": "user",
                "content": (
                    "You are a podcast script writer for an educational show. Convert the following "
                    "study material into an engaging, conversational podcast script between a host "
                    "and an expert. Make it informative but fun, using analogies and examples. "
                    "Target 5-10 minutes of speaking time.\n\n"
                    f"Material:\n{text}"
                ),
            }
        ],
    )
    return message.content[0].text or ""
