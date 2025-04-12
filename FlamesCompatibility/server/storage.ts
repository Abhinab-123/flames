import { type FlamesCalculation, type User, type InsertUser } from "@shared/schema";

// Extend the interface with FLAMES calculation CRUD methods
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveFlamesCalculation(calculation: {
    name1: string;
    name2: string;
    result: string;
    compatibility: number;
    timestamp: string;
  }): Promise<FlamesCalculation>;
  getRecentCalculations(limit: number): Promise<FlamesCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private flamesCalculations: FlamesCalculation[];
  private userId: number;
  private flamesId: number;

  constructor() {
    this.users = new Map();
    this.flamesCalculations = [];
    this.userId = 1;
    this.flamesId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveFlamesCalculation(calculation: {
    name1: string;
    name2: string;
    result: string;
    compatibility: number;
    timestamp: string;
  }): Promise<FlamesCalculation> {
    const id = this.flamesId++;
    const flamesCalc: FlamesCalculation = { ...calculation, id };
    this.flamesCalculations.push(flamesCalc);
    return flamesCalc;
  }

  async getRecentCalculations(limit: number): Promise<FlamesCalculation[]> {
    // Sort by timestamp descending and limit the number of results
    return [...this.flamesCalculations]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
