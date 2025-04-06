export interface User {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SmartContract {
  id: string;
  title: string;
  description: string;
  solidity_code: string;
  diagram_code: string;
  userId: string;
  additional_notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
