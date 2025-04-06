// Versão simplificada sem Drizzle ORM
// Este arquivo fornece apenas estruturas de dados simuladas
// para que o resto da aplicação funcione sem alterações significativas

// Definição simulada da tabela diagramCache para compatibilidade com a aplicação
export const diagramCache = {
  username: { name: 'username' },
  repo: { name: 'repo' },
  diagram: { name: 'diagram' },
  explanation: { name: 'explanation' },
  createdAt: { name: 'created_at' },
  updatedAt: { name: 'updated_at' },
  usedOwnKey: { name: 'used_own_key' },
};

// Funções auxiliares que simulam operadores SQL do Drizzle
export const eq = (field: any, value: any) => ({ field, value, operator: 'eq' });
export const and = (...conditions: any[]) => ({ conditions, operator: 'and' });

// Função de criação de tabela simulada
export const createTable = (name: string, columns: any, config?: any) => columns;

// Simulação de SQL para compatibilidade com código existente
export const sql = {
  raw: (str: string) => str,
};
