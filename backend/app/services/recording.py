"""
Recording Service Layer
Handles file storage, transcription, and processing
"""

import boto3
import os
from typing import Optional, Dict
import asyncio
from datetime import datetime

# AWS Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET_NAME", "nkom-recordings")


class RecordingService:
    """
    Handles recording file operations:
    - Upload to S3
    - Delete from S3
    - Generate presigned URLs
    """

    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
        )
        self.bucket_name = S3_BUCKET

    async def save_to_s3(self, file_obj, file_key: str) -> str:
        """
        Save recording to S3

        Args:
            file_obj: File object from upload
            file_key: S3 key (path)

        Returns:
            S3 URL of saved file

        Example:
            file_key = "recordings/user-123/uuid.m4a"
            url = await recording_service.save_to_s3(file_obj, file_key)
            # Returns: https://nkom-recordings.s3.amazonaws.com/recordings/user-123/uuid.m4a
        """
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.s3_client.upload_fileobj(
                    file_obj,
                    self.bucket_name,
                    file_key,
                    ExtraArgs={
                        "ContentType": "audio/mpeg",
                        "ServerSideEncryption": "AES256",  # Encrypt at rest
                        "Metadata": {
                            "uploaded_at": datetime.utcnow().isoformat(),
                        }
                    }
                )
            )

            # Generate public URL
            url = f"https://{self.bucket_name}.s3.{AWS_REGION}.amazonaws.com/{file_key}"
            return url

        except Exception as e:
            raise Exception(f"S3 upload failed: {str(e)}")

    async def delete_from_s3(self, file_key: str) -> bool:
        """
        Delete recording from S3

        Args:
            file_key: S3 key to delete

        Returns:
            True if successful
        """
        try:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: self.s3_client.delete_object(
                    Bucket=self.bucket_name,
                    Key=file_key
                )
            )
            return True
        except Exception as e:
            print(f"S3 delete failed: {str(e)}")
            return False

    def get_presigned_url(self, file_key: str, expiration: int = 3600) -> str:
        """
        Generate presigned URL for downloading recording

        Args:
            file_key: S3 key
            expiration: URL expiration time in seconds (default 1 hour)

        Returns:
            Presigned URL
        """
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_key},
                ExpiresIn=expiration,
            )
            return url
        except Exception as e:
            raise Exception(f"Failed to generate presigned URL: {str(e)}")


class RecordingStorageManager:
    """
    Manages local storage for recordings (before upload)
    Used for temporary storage while transcription is processing
    """

    def __init__(self, storage_dir: str = "/tmp/nkom_recordings"):
        self.storage_dir = storage_dir
        os.makedirs(storage_dir, exist_ok=True)

    def save_locally(self, recording_id: str, file_obj) -> str:
        """
        Save recording file locally

        Args:
            recording_id: Recording ID
            file_obj: File object

        Returns:
            Local file path
        """
        file_path = os.path.join(self.storage_dir, f"{recording_id}.m4a")
        with open(file_path, "wb") as f:
            f.write(file_obj.read())
        return file_path

    def get_local_file(self, recording_id: str) -> Optional[str]:
        """
        Get local file path if it exists

        Args:
            recording_id: Recording ID

        Returns:
            File path or None
        """
        file_path = os.path.join(self.storage_dir, f"{recording_id}.m4a")
        if os.path.exists(file_path):
            return file_path
        return None

    def delete_local(self, recording_id: str) -> bool:
        """
        Delete local recording file

        Args:
            recording_id: Recording ID

        Returns:
            True if successful
        """
        file_path = os.path.join(self.storage_dir, f"{recording_id}.m4a")
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
            return True
        except Exception as e:
            print(f"Failed to delete local file: {str(e)}")
            return False


# ========== TRANSCRIPTION SERVICE (Whisper API) ==========

import openai
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class TranscriptionService:
    """
    Handles audio transcription using OpenAI Whisper API
    """

    def __init__(self):
        openai.api_key = OPENAI_API_KEY

    async def transcribe_async(self, file_url: str, recording_id: str, user_id: str) -> Dict:
        """
        Queue transcription job (async)

        Args:
            file_url: S3 URL of audio file
            recording_id: Recording ID
            user_id: User ID

        Returns:
            Job details with job_id
        """
        # In production, this would use a job queue (Celery, Bull, etc.)
        # For now, return a job tracking ID

        return {
            "job_id": f"whisper_job_{recording_id}_{datetime.utcnow().timestamp()}",
            "status": "queued",
            "recording_id": recording_id,
            "created_at": datetime.utcnow().isoformat()
        }

    async def transcribe_direct(self, file_path: str) -> Dict:
        """
        Transcribe audio file directly (for sync operations)

        Args:
            file_path: Path to audio file

        Returns:
            Transcription result with text and metadata
        """
        try:
            loop = asyncio.get_event_loop()

            def transcribe_sync():
                with open(file_path, "rb") as audio_file:
                    transcript = openai.Audio.transcribe(
                        model="whisper-1",
                        file=audio_file,
                        language="en",  # Could be dynamic based on user preference
                        response_format="verbose_json"  # Returns text + timing info
                    )
                return transcript

            result = await loop.run_in_executor(None, transcribe_sync)

            return {
                "text": result.get("text", ""),
                "duration": result.get("duration", 0),
                "language": result.get("language", "en"),
                "status": "completed",
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            return {
                "text": None,
                "error": str(e),
                "status": "failed"
            }

    async def get_job_status(self, job_id: str) -> Dict:
        """
        Get transcription job status

        Args:
            job_id: Job ID

        Returns:
            Job status (queued|processing|completed|failed)
        """
        # In production, query job queue system
        # For now, return mock status

        return {
            "job_id": job_id,
            "status": "completed",
            "progress": 100
        }

    async def get_transcription(self, job_id: str) -> Optional[Dict]:
        """
        Get transcription result if job is complete

        Args:
            job_id: Job ID

        Returns:
            Transcription result or None if not ready
        """
        # In production, retrieve from job queue or cache
        # For now, return mock result

        return {
            "text": "Sample transcription text from lecture recording...",
            "duration": 3600,
            "job_id": job_id,
            "status": "completed"
        }


# ========== AUDIO PROCESSING ==========

import subprocess
from pathlib import Path


class AudioProcessor:
    """
    Handles audio format conversion and optimization
    """

    @staticmethod
    def get_audio_duration(file_path: str) -> int:
        """
        Get duration of audio file in seconds using ffprobe

        Args:
            file_path: Path to audio file

        Returns:
            Duration in seconds
        """
        try:
            result = subprocess.run(
                [
                    "ffprobe",
                    "-v", "error",
                    "-show_entries", "format=duration",
                    "-of", "default=noprint_wrappers=1:nokey=1:noprint_wrappers=1",
                    file_path
                ],
                capture_output=True,
                text=True
            )
            return int(float(result.stdout.strip()))
        except Exception as e:
            print(f"Error getting audio duration: {str(e)}")
            return 0

    @staticmethod
    def estimate_file_size(duration_seconds: int, bitrate_kbps: int = 128) -> int:
        """
        Estimate file size in bytes

        Args:
            duration_seconds: Duration in seconds
            bitrate_kbps: Bitrate in kbps (default 128)

        Returns:
            Estimated file size in bytes
        """
        # Bitrate * time / 8 (convert bits to bytes)
        return (bitrate_kbps * 1000 * duration_seconds) // 8

    @staticmethod
    async def convert_to_mp3(input_path: str, output_path: str, bitrate: str = "128k") -> bool:
        """
        Convert audio file to MP3 format

        Args:
            input_path: Path to input audio file
            output_path: Path to output MP3 file
            bitrate: Output bitrate (default 128k)

        Returns:
            True if successful
        """
        try:
            loop = asyncio.get_event_loop()

            def convert_sync():
                subprocess.run(
                    [
                        "ffmpeg",
                        "-i", input_path,
                        "-b:a", bitrate,
                        "-q:a", "9",  # Quality level
                        output_path,
                        "-y"  # Overwrite if exists
                    ],
                    capture_output=True
                )

            await loop.run_in_executor(None, convert_sync)
            return os.path.exists(output_path)

        except Exception as e:
            print(f"Audio conversion failed: {str(e)}")
            return False


# ========== COST TRACKING ==========

class RecordingCostTracker:
    """
    Track costs of transcription and processing
    """

    @staticmethod
    def calculate_transcription_cost(duration_seconds: int) -> float:
        """
        Calculate cost of Whisper transcription

        Whisper pricing: $0.006 per minute

        Args:
            duration_seconds: Duration in seconds

        Returns:
            Cost in USD
        """
        minutes = duration_seconds / 60
        return minutes * 0.006

    @staticmethod
    def calculate_tts_cost(text_length: int) -> float:
        """
        Calculate cost of text-to-speech (for podcast generation)

        TTS pricing: ~$0.015 per 1000 characters

        Args:
            text_length: Length of text in characters

        Returns:
            Cost in USD
        """
        return (text_length / 1000) * 0.015

    @staticmethod
    def calculate_total_cost(duration_seconds: int, generated_text_length: int) -> Dict:
        """
        Calculate total processing cost for a recording

        Args:
            duration_seconds: Duration in seconds
            generated_text_length: Length of generated content

        Returns:
            Cost breakdown
        """
        transcription = RecordingCostTracker.calculate_transcription_cost(duration_seconds)
        tts = RecordingCostTracker.calculate_tts_cost(generated_text_length)

        return {
            "transcription": round(transcription, 4),
            "text_to_speech": round(tts, 4),
            "total": round(transcription + tts, 4),
            "currency": "USD"
        }
