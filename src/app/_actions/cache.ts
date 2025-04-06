"use server";

// Versão simplificada sem banco de dados real
// Para desenvolvimento/demonstração

// Estrutura para o cache em memória
interface DiagramCacheEntry {
  username: string;
  repo: string;
  diagram: string;
  explanation: string;
  usedOwnKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cache em memória para desenvolvimento
let diagramCache: DiagramCacheEntry[] = [];

export async function testDatabaseConnection() {
  'use server';
  try {
    console.log('SERVER: Testing database connection simulation...');
    // Simulação de uma conexão bem-sucedida
    return true;
  } catch (error) {
    console.error('SERVER: Database connection simulation failed:', error);
    return false;
  }
}

export async function getCachedDiagram(username: string, repo: string) {
  'use server';
  try {
    console.log('SERVER: Fetching cached diagram for:', { username, repo });
    const entry = diagramCache.find(
      (entry) => entry.username === username && entry.repo === repo
    );
    return entry?.diagram ?? null;
  } catch (error) {
    console.error('SERVER: Error fetching cached diagram:', error);
    return null;
  }
}

export async function getCachedExplanation(username: string, repo: string) {
  try {
    const entry = diagramCache.find(
      (entry) => entry.username === username && entry.repo === repo
    );
    return entry?.explanation ?? null;
  } catch (error) {
    console.error("Error fetching cached explanation:", error);
    return null;
  }
}

export async function cacheDiagramAndExplanation(
  username: string,
  repo: string,
  diagram: string,
  explanation: string,
  usedOwnKey = false,
) {
  'use server';
  console.log('SERVER: Starting cache operation');
  try {
    console.log('SERVER: Attempting to cache diagram:', { 
      username, 
      repo, 
      usedOwnKey,
      diagramLength: diagram.length,
      explanationLength: explanation.length
    });
    
    // Verificar se a entrada já existe no cache
    const existingIndex = diagramCache.findIndex(
      (entry) => entry.username === username && entry.repo === repo
    );

    const now = new Date();
    
    // Se já existe, atualiza a entrada
    if (existingIndex >= 0) {
      diagramCache[existingIndex] = {
        ...diagramCache[existingIndex],
        diagram,
        explanation,
        usedOwnKey,
        updatedAt: now
      };
    } else {
      // Se não existe, cria uma nova entrada
      diagramCache.push({
        username,
        repo,
        diagram,
        explanation,
        usedOwnKey,
        createdAt: now,
        updatedAt: now
      });
    }
    
    console.log('SERVER: Successfully cached diagram');
    return true;
  } catch (error) {
    console.error('SERVER: Error caching diagram:', error);
    throw error;
  }
}

export async function getDiagramStats() {
  try {
    const totalDiagrams = diagramCache.length;
    const ownKeyUsers = diagramCache.filter(entry => entry.usedOwnKey).length;
    const freeUsers = diagramCache.filter(entry => !entry.usedOwnKey).length;
    
    return {
      totalDiagrams,
      ownKeyUsers,
      freeUsers
    };
  } catch (error) {
    console.error("Error getting diagram stats:", error);
    return null;
  }
}

// Test database connection on module load
console.log('SERVER: Testing database connection simulation on module load');
void testDatabaseConnection();
