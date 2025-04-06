// Implementação simplificada sem Drizzle ORM
// Este arquivo fornece um substituto para as funções de banco de dados
// que são usadas pela aplicação, mas sem depender de um banco de dados real

// As estruturas de dados e funções estão dentro do objeto globalThis
// para que possam ser acessadas de diferentes partes da aplicação

// Define a estrutura de cache que será usada no lugar do banco de dados
interface DiagramCacheEntry {
  username: string;
  repo: string;
  diagram: string;
  explanation: string;
  usedOwnKey: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Inicializa o cache global se ainda não existir
if (typeof globalThis.diagramCache === 'undefined') {
  globalThis.diagramCache = [];
}

// Simula uma conexão de banco de dados, mas na verdade
// só opera sobre o array em memória
export const db = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => globalThis.diagramCache,
      }),
    }),
  }),
  execute: async () => [{ test: 1 }], // Simula uma execução SQL bem-sucedida
};
