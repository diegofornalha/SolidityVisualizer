// Implementação simplificada sem Prisma
import { User, SmartContract } from './types';

// Armazenamento em memória para desenvolvimento
let users: User[] = [];
let smartContracts: SmartContract[] = [];

// Funções para interagir com usuários
export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find(user => user.email === email) || null;
}

export async function createUser(userData: {
  email: string;
  name: string;
  hashedPassword: string;
}): Promise<User> {
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.push(newUser);
  return newUser;
}

// Funções para interagir com contratos inteligentes
export async function createSmartContract(contractData: {
  title: string;
  description: string;
  solidity_code: string;
  diagram_code: string;
  userId: string;
  additional_notes?: string;
}): Promise<SmartContract> {
  const newContract = {
    id: generateId(),
    ...contractData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  smartContracts.push(newContract);
  return newContract;
}

export async function getSmartContractsByUser(userId: string): Promise<SmartContract[]> {
  return smartContracts.filter(contract => contract.userId === userId);
}

export async function getSmartContractById(id: string): Promise<SmartContract | null> {
  return smartContracts.find(contract => contract.id === id) || null;
}

export async function deleteSmartContract(id: string): Promise<SmartContract> {
  const index = smartContracts.findIndex(contract => contract.id === id);
  if (index === -1) throw new Error('Smart contract not found');
  
  const deleted = smartContracts[index];
  smartContracts = smartContracts.filter(contract => contract.id !== id);
  return deleted;
}

export async function updateSmartContract(
  id: string,
  data: {
    title?: string;
    description?: string;
    solidity_code?: string;
    diagram_code?: string;
    additional_notes?: string;
  }
): Promise<SmartContract> {
  const contract = await getSmartContractById(id);
  if (!contract) throw new Error('Smart contract not found');
  
  const updated = {
    ...contract,
    ...data,
    updatedAt: new Date()
  };
  
  smartContracts = smartContracts.map(c => c.id === id ? updated : c);
  return updated;
}

// Utilitário para gerar IDs únicos
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
