// Implementação simplificada do banco de dados sem ORM
// Esta implementação usa um array em memória como substituto para o banco de dados

export const db = {
  // Simula uma consulta select
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: (n: number) => [],
        orderBy: (field: any) => []
      }),
      orderBy: (field: any) => []
    })
  }),

  // Simula uma inserção
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => [data]
    })
  }),

  // Simula uma atualização
  update: (table: any) => ({
    set: (updates: any) => ({
      where: (condition: any) => ({
        returning: () => [{ ...updates }]
      })
    })
  }),

  // Simula uma exclusão
  delete: (table: any) => ({
    where: (condition: any) => ({
      returning: () => [{}]
    })
  })
};

// Utilitário para gerar IDs únicos
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
