/** Shared TypeScript types — mirroring the backend schemas. */

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  learning_style: "visual" | "auditory" | "reading" | "kinesthetic" | null;
  is_premium: boolean;
  subscription_tier: "free" | "student" | "pro" | "family" | null;
  created_at: string;
}

export interface ContentUpload {
  id: string;
  file_type: "image" | "audio" | "pdf" | "text";
  original_filename: string | null;
  processing_status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  source_type: string | null;
  summary: string | null;
  podcast_url: string | null;
  generated_formats: Record<string, string> | null;
  difficulty_level: number | null;
  created_at: string;
}

export interface Flashcard {
  id: string;
  front_text: string;
  back_text: string;
  mnemonic_hint: string | null;
  ease_factor: number;
  interval: number;
  next_review: string | null;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false" | "open_ended";
  options: Record<string, unknown> | null;
  difficulty: number | null;
}

export interface StudySession {
  id: string;
  material_id: string | null;
  session_type: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  cards_reviewed: number | null;
  correct_answers: number | null;
  score: number | null;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserProgress {
  total_sessions: number;
  total_materials: number;
  total_flashcards: number;
  study_streak: number;
  avg_quiz_score: number | null;
  total_study_minutes: number;
}
