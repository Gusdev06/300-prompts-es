export type PromptType =
  | 'text_to_image'
  | 'image_to_image'
  | 'text_to_video'
  | 'image_to_video'
  | 'motion_control';

export interface PromptTemplate {
  id: string;
  title: string;
  type: PromptType | string;
  prompt: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  aiModel?: string;
}

export interface PromptCategory {
  id: string;
  title: string;
  prompts: PromptTemplate[];
}

export interface PromptSection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  categories: PromptCategory[];
}

export interface PromptSectionsResponse {
  sections: PromptSection[];
}

const BASE = 'https://clip-generator-geraew-api.ernvcw.easypanel.host/api/v1/prompts';
const REVALIDATE = 600;

export async function fetchAllPromptSections(): Promise<PromptSection[]> {
  const res = await fetch(BASE, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`prompts api ${res.status}`);
  const json = (await res.json()) as PromptSectionsResponse;
  return [...(json.sections ?? [])].reverse();
}

export async function fetchPromptSection(slug: string): Promise<PromptSection | null> {
  const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`, {
    next: { revalidate: REVALIDATE },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`prompts api ${res.status}`);
  return (await res.json()) as PromptSection;
}

export async function searchPrompts(q: string): Promise<PromptTemplate[]> {
  const term = q.trim();
  if (!term) return [];
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(term)}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`prompts api ${res.status}`);
  return (await res.json()) as PromptTemplate[];
}
