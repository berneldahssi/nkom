"""Speech services — transcription (Whisper) and text-to-speech (ElevenLabs)."""

import structlog
from openai import AsyncOpenAI

from app.core.config import settings

logger = structlog.get_logger()

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def transcribe_audio(audio_path: str) -> str:
    """Transcribe an audio file using OpenAI Whisper."""
    with open(audio_path, "rb") as audio_file:
        transcript = await openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="en",  # TODO: Auto-detect or allow user to specify
        )
    logger.info("transcription_complete", chars=len(transcript.text))
    return transcript.text


async def text_to_speech(text: str, output_path: str) -> str:
    """Convert text to speech using ElevenLabs API.

    TODO: Implement ElevenLabs integration. Falling back to
    OpenAI TTS for now.
    """
    response = await openai_client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=text,
    )
    response.stream_to_file(output_path)
    logger.info("tts_complete", output=output_path)
    return output_path
