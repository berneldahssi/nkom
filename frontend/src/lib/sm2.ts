/**
 * SM-2 spaced repetition — localStorage persistence.
 *
 * Cards are stored as a single JSON blob under STORAGE_KEY.
 * When auth is live, the caller can POST the dirty set to
 * /study/flashcards/{id}/review to sync with the backend.
 */

const STORAGE_KEY = "nkom_sm2";

export type Rating = "again" | "hard" | "good" | "easy";

export type CardState = {
  interval: number;      // days until next review
  easeFactor: number;    // SM-2 E-Factor (starts at 2.5)
  repetitions: number;   // successful review streak
  nextReview: string;    // ISO date string "YYYY-MM-DD"
  lastReviewed: string;  // ISO date string
};

const RATING_TO_Q: Record<Rating, number> = {
  again: 0,
  hard: 2,
  good: 4,
  easy: 5,
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function loadAll(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(states: Record<string, CardState>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

export function getCardState(cardId: string): CardState | null {
  return loadAll()[cardId] ?? null;
}

/** Apply SM-2 algorithm and persist the updated state. */
export function updateCardState(cardId: string, rating: Rating): CardState {
  const states = loadAll();
  const prev = states[cardId] ?? {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: todayISO(),
    lastReviewed: todayISO(),
  };

  const q = RATING_TO_Q[rating];

  let { interval, easeFactor, repetitions } = prev;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  const next: CardState = {
    interval,
    easeFactor,
    repetitions,
    nextReview: addDays(interval),
    lastReviewed: todayISO(),
  };

  states[cardId] = next;
  saveAll(states);
  return next;
}

/** Cards with nextReview <= today, ordered by most overdue first, capped at limit. */
export function getDueCards<T extends { id: string }>(cards: T[], limit = 20): T[] {
  const states = loadAll();
  const today = todayISO();

  return cards
    .filter((c) => {
      const s = states[c.id];
      return !s || s.nextReview <= today;
    })
    .sort((a, b) => {
      const sa = states[a.id]?.nextReview ?? "0000-00-00";
      const sb = states[b.id]?.nextReview ?? "0000-00-00";
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    })
    .slice(0, limit);
}

/** Total number of cards due today across the full deck. */
export function getDueCount<T extends { id: string }>(cards: T[]): number {
  const states = loadAll();
  const today = todayISO();
  return cards.filter((c) => {
    const s = states[c.id];
    return !s || s.nextReview <= today;
  }).length;
}

/** Next review date label for a card (relative to today). */
export function nextReviewLabel(cardId: string): string {
  const s = loadAll()[cardId];
  if (!s) return "New";
  const diff = Math.round(
    (new Date(s.nextReview).getTime() - new Date(todayISO()).getTime()) /
      86_400_000
  );
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${diff} days`;
}

/**
 * Preview what interval each rating would produce for a card
 * without committing the change. Returns days.
 */
export function previewIntervals(cardId: string): Record<Rating, number> {
  const states = loadAll();
  const prev = states[cardId] ?? {
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
  };

  function simulate(rating: Rating): number {
    const q = RATING_TO_Q[rating];
    if (q < 3) return 1;
    if (prev.repetitions === 0) return 1;
    if (prev.repetitions === 1) return 6;
    return Math.round(prev.interval * prev.easeFactor);
  }

  return {
    again: 1,
    hard: simulate("hard"),
    good: simulate("good"),
    easy: Math.round(simulate("easy") * 1.3),
  };
}

function formatDays(days: number): string {
  if (days <= 0) return "<1 day";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  return `${Math.round(days / 30)} mo`;
}

export function previewIntervalLabels(cardId: string): Record<Rating, string> {
  const p = previewIntervals(cardId);
  return {
    again: formatDays(p.again),
    hard: formatDays(p.hard),
    good: formatDays(p.good),
    easy: formatDays(p.easy),
  };
}
