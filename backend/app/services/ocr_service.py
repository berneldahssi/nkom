"""OCR service — extract text from images using Tesseract and/or AWS Textract."""

import structlog

logger = structlog.get_logger()


async def extract_text_from_image(image_path: str) -> str:
    """Extract text from an image file using Tesseract OCR.

    For production, this should fall back to AWS Textract for
    better accuracy on handwritten notes.
    """
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        logger.info("ocr_extraction_complete", chars=len(text))
        return text
    except Exception as e:
        logger.error("ocr_extraction_failed", error=str(e))
        raise


async def extract_text_from_image_aws(image_bytes: bytes) -> str:
    """Extract text using AWS Textract (better for handwriting).

    TODO: Implement when AWS credentials are configured.
    """
    raise NotImplementedError("AWS Textract integration not yet implemented")
