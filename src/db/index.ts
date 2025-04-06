import { PrismaClient } from '@prisma/client';
import { User, SmartContract } from './types';

// Evitar múltiplas instâncias do Prisma Client em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Funções para interagir com usuários
export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(userData: {
  email: string;
  name: string;
  hashedPassword: string;
}): Promise<User> {
  return prisma.user.create({
    data: userData,
  });
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
  return prisma.smartContract.create({
    data: contractData,
  });
}

export async function getSmartContractsByUser(userId: string): Promise<SmartContract[]> {
  return prisma.smartContract.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSmartContractById(id: string): Promise<SmartContract | null> {
  return prisma.smartContract.findUnique({
    where: { id },
  });
}

export async function deleteSmartContract(id: string): Promise<SmartContract> {
  return prisma.smartContract.delete({
    where: { id },
  });
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
  return prisma.smartContract.update({
    where: { id },
    data,
  });
}
