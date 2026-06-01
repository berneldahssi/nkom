/**
 * Type-safe fetch helpers for the materials API.
 * All calls go through Next.js /api rewrite → backend.
 */

export type Material = {
  id: string;
  title: string;
  subject: string | null;
  description: string | null;
  material_type: string;
  exam_code: string | null;
  source_type: string | null;
  summary: string | null;
  podcast_url: string | null;
  generated_formats: Record<string, string> | null;
  difficulty_level: number | null;
  created_at: string;
};

export type Section = {
  id: string;
  section_number: number | null;
  title: string;
  summary: string | null;
  difficulty: string | null;
  question_count: number;
  created_at: string;
};

export type Question = {
  id: string;
  source_ref: string | null;
  question_text: string;
  question_type: string;
  options: string[] | null;
  correct_answer: string;
  hint: string | null;
  difficulty: number | null;
};

export type Flashcard = {
  id: string;
  source_ref: string | null;
  front_text: string;
  back_text: string;
  mnemonic_hint: string | null;
  ease_factor: number;
  interval: number;
  next_review: string | null;
};

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function fetchMaterials(token: string): Promise<Material[]> {
  const r = await fetch("/api/v1/materials/", { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Failed to fetch materials: ${r.status}`);
  return r.json();
}

export async function fetchMaterial(token: string, materialId: string): Promise<Material> {
  const r = await fetch(`/api/v1/materials/${materialId}`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Material not found: ${r.status}`);
  return r.json();
}

export async function fetchSections(token: string, materialId: string): Promise<Section[]> {
  const r = await fetch(`/api/v1/materials/${materialId}/sections`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Failed to fetch sections: ${r.status}`);
  return r.json();
}

export async function fetchSection(token: string, materialId: string, sectionId: string): Promise<Section> {
  const r = await fetch(`/api/v1/materials/${materialId}/sections/${sectionId}`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Section not found: ${r.status}`);
  return r.json();
}

export async function fetchQuestions(token: string, materialId: string, sectionId: string): Promise<Question[]> {
  const r = await fetch(`/api/v1/materials/${materialId}/sections/${sectionId}/questions`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Failed to fetch questions: ${r.status}`);
  return r.json();
}

export async function fetchFlashcards(token: string, materialId: string, sectionId: string): Promise<Flashcard[]> {
  const r = await fetch(`/api/v1/materials/${materialId}/sections/${sectionId}/flashcards`, { headers: authHeaders(token) });
  if (!r.ok) throw new Error(`Failed to fetch flashcards: ${r.status}`);
  return r.json();
}
