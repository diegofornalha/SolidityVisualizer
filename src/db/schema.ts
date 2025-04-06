// Versão simplificada do esquema sem Drizzle ORM

// Apenas define a estrutura para compatibilidade com o código existente
export const diagrams = {
  id: { name: 'id' },
  prompt: { name: 'prompt' },
  diagram: { name: 'diagram' },
  title: { name: 'title' },
  apiKey: { name: 'api_key' },
  createdAt: { name: 'created_at' },
  updatedAt: { name: 'updated_at' }
};

// Função auxiliar que simula o operador de igualdade do Drizzle
export const eq = (field: any, value: any) => ({ field, value, operator: 'eq' });
