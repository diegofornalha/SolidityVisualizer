import { db } from './index';
import { diagrams } from './schema';

// Simulação simplificada de consultas ao banco de dados
// Esta implementação usa um array em memória como substituto para o banco de dados

// Estado em memória para armazenar os diagramas
if (typeof globalThis.diagramsData === 'undefined') {
  globalThis.diagramsData = [];
  globalThis.diagramsIdCounter = 1;
}

export async function saveDiagram(prompt: string, diagramCode: string, apiKey?: string, title?: string) {
  const id = globalThis.diagramsIdCounter++;
  const now = new Date();
  const newDiagram = {
    id,
    prompt,
    diagram: diagramCode,
    apiKey,
    title: title || 'Diagrama sem título',
    createdAt: now,
    updatedAt: now
  };
  
  globalThis.diagramsData.push(newDiagram);
  return [newDiagram];
}

export async function getDiagramById(id: number) {
  return globalThis.diagramsData.find(d => d.id === id) || null;
}

export async function getDiagramByPrompt(prompt: string) {
  return globalThis.diagramsData.find(d => d.prompt === prompt) || null;
}

export async function getAllDiagrams() {
  return [...globalThis.diagramsData].sort((a, b) => 
    a.createdAt.getTime() - b.createdAt.getTime()
  );
}

export async function getAllApiKeys() {
  return globalThis.diagramsData.map(d => ({
    id: d.id,
    apiKey: d.apiKey
  }));
}

export async function updateDiagram(id: number, updates: { prompt?: string; diagram?: string; title?: string; apiKey?: string }) {
  const index = globalThis.diagramsData.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  globalThis.diagramsData[index] = {
    ...globalThis.diagramsData[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return [globalThis.diagramsData[index]];
}

export async function deleteDiagram(id: number) {
  const index = globalThis.diagramsData.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  const deleted = globalThis.diagramsData[index];
  globalThis.diagramsData = globalThis.diagramsData.filter(d => d.id !== id);
  
  return [deleted];
}
