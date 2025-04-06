"use server";

// Usando o mesmo cache de diagramas definido em cache.ts
// Essa é uma abordagem simplificada para demonstração

// Estrutura para o cache em memória (réplica da interface em cache.ts)
interface DiagramCacheEntry {
  username: string;
  repo: string;
  diagram: string;
  explanation: string;
  usedOwnKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Referência ao cache em memória em cache.ts
// Na prática, isso seria importado, mas para evitar problemas de referência circular,
// estamos redeclarando como uma variável externa que será acessada em runtime
declare const diagramCache: DiagramCacheEntry[];

export async function getLastGeneratedDate(username: string, repo: string) {
  try {
    // Em uma aplicação real, isso seria uma consulta ao banco de dados
    // Para nossa versão simplificada, vamos simular usando um array em memória
    const entry = (globalThis as any).diagramCache?.find(
      (entry: DiagramCacheEntry) => entry.username === username && entry.repo === repo
    );

    return entry?.updatedAt || null;
  } catch (error) {
    console.error("Error getting last generated date:", error);
    return null;
  }
}
