/**
 * Salva um valor no localStorage
 */
export function saveToLocalStorage(key: string, value: any): void {
  if (typeof window !== 'undefined') {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }
}

/**
 * Recupera um valor do localStorage
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(item) as T;
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error(`Erro ao recuperar ${key} do localStorage:`, error);
      return defaultValue;
    }
  }
  return defaultValue;
}

/**
 * Remove um item do localStorage
 */
export function removeFromLocalStorage(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error);
    }
  }
}

/**
 * Limpa todo o localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar o localStorage:', error);
    }
  }
}
