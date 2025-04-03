import { db } from './index';
import { diagrams } from './schema';
import { eq } from 'drizzle-orm';

export async function saveDiagram(prompt: string, diagramCode: string, apiKey?: string, title?: string) {
  return await db.insert(diagrams).values({
    prompt,
    diagram: diagramCode,
    apiKey,
    title: title || 'Diagrama sem título'
  }).returning();
}

export async function getDiagramById(id: number) {
  const results = await db.select().from(diagrams).where(eq(diagrams.id, id));
  return results[0];
}

export async function getDiagramByPrompt(prompt: string) {
  const results = await db.select().from(diagrams).where(eq(diagrams.prompt, prompt));
  return results[0];
}

export async function getAllDiagrams() {
  return await db.select().from(diagrams).orderBy(diagrams.createdAt);
}

export async function getAllApiKeys() {
  return await db.select({
    id: diagrams.id,
    apiKey: diagrams.apiKey
  }).from(diagrams);
}

export async function updateDiagram(id: number, updates: { prompt?: string; diagram?: string; title?: string; apiKey?: string }) {
  return await db.update(diagrams)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(diagrams.id, id))
    .returning();
}

export async function deleteDiagram(id: number) {
  return await db.delete(diagrams).where(eq(diagrams.id, id)).returning();
} 