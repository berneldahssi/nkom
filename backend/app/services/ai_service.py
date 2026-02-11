"""AI service — wraps OpenAI API calls for content processing."""

import structlog
from openai import AsyncOpenAI

from app.core.config import settings

logger = structlog.get_logger()

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def extract_concepts(text: str) -> dict:
    """Use GPT-4 to extract key concepts from raw text."""
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert educator. Extract the key concepts, definitions, "
                    "and important facts from the following text. Return them as structured JSON "
                    "with keys: 'title', 'subject', 'concepts' (list of {term, definition, importance}), "
                    "'summary' (2-3 sentence overview)."
                ),
            },
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    import json

    return json.loads(response.choices[0].message.content or "{}")


async def generate_summary(text: str) -> str:
    """Generate a structured summary of the learning material."""
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert educator. Create a clear, well-structured study summary "
                    "from the following material. Use bullet points, key terms in bold, and "
                    "organize by topic. Make it optimal for learning and retention."
                ),
            },
            {"role": "user", "content": text},
        ],
        temperature=0.4,
    )
    return response.choices[0].message.content or ""


async def generate_flashcards(text: str, count: int = 10) -> list[dict]:
    """Generate flashcard Q&A pairs from text."""
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are an expert educator. Create {count} flashcards from the following "
                    "material. Each flashcard should test a key concept. Return JSON with key "
                    "'flashcards' containing a list of {{front, back, mnemonic_hint}}. "
                    "The front should be a question, the back should be the answer, and "
                    "mnemonic_hint should be a memory aid."
                ),
            },
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        temperature=0.5,
    )
    import json

    data = json.loads(response.choices[0].message.content or "{}")
    return data.get("flashcards", [])


async def generate_quiz(text: str, count: int = 10) -> list[dict]:
    """Generate multiple-choice quiz questions from text."""
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are an expert educator. Create {count} multiple-choice quiz questions "
                    "from the following material. Return JSON with key 'questions' containing "
                    "a list of {{question, options (list of 4 strings), correct_answer, explanation, "
                    "difficulty (1-5)}}."
                ),
            },
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        temperature=0.5,
    )
    import json

    data = json.loads(response.choices[0].message.content or "{}")
    return data.get("questions", [])


async def generate_podcast_script(text: str) -> str:
    """Generate a conversational podcast-style script from text."""
    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a podcast script writer for an educational show. Convert the following "
                    "study material into an engaging, conversational podcast script between a host "
                    "and an expert. Make it informative but fun, using analogies and examples. "
                    "Target 5-10 minutes of speaking time."
                ),
            },
            {"role": "user", "content": text},
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content or ""
