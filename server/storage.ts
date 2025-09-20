import { type User, type InsertUser, type Mission, type InsertMission, type UpdateUserStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: string, stats: UpdateUserStats): Promise<User | undefined>;
  updateUserXP(userId: string, xp: number, totalXP: number, level: number): Promise<User | undefined>;
  
  // Mission methods
  getUserMissions(userId: string): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  completeMission(missionId: string, userId: string): Promise<Mission | undefined>;
  resetDailyMissions(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private missions: Map<string, Mission>;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.initializeDefaultMissions();
  }

  private initializeDefaultMissions() {
    // Default daily missions will be created for new users
  }

  private createDefaultMissions(userId: string): Mission[] {
    const defaultDailyMissions = [
      {
        title: "Escovar os Dentes",
        description: "Higiene bucal matinal e noturna",
        type: "daily" as const,
        xpReward: 25,
        icon: "fas fa-tooth"
      },
      {
        title: "Tomar Banho",
        description: "Higiene pessoal diária",
        type: "daily" as const,
        xpReward: 50,
        icon: "fas fa-shower"
      },
      {
        title: "Exercitar-se (30min)",
        description: "Atividade física diária",
        type: "daily" as const,
        xpReward: 75,
        icon: "fas fa-dumbbell"
      },
      {
        title: "Beber 2L de Água",
        description: "Hidratação adequada",
        type: "daily" as const,
        xpReward: 30,
        icon: "fas fa-glass-water"
      },
      {
        title: "Meditar (15min)",
        description: "Bem-estar mental",
        type: "daily" as const,
        xpReward: 40,
        icon: "fas fa-om"
      }
    ];

    const defaultSideMissions = [
      {
        title: "Ler por 1 hora",
        description: "Desenvolvimento intelectual",
        type: "side" as const,
        xpReward: 100,
        icon: "fas fa-book"
      },
      {
        title: "Organizar Quarto",
        description: "Manter ambiente limpo",
        type: "side" as const,
        xpReward: 150,
        icon: "fas fa-broom"
      }
    ];

    const defaultMainMission = {
      title: "Completar Projeto Principal",
      description: "Terminar o projeto mais importante da semana",
      type: "main" as const,
      xpReward: 500,
      icon: "fas fa-crown"
    };

    const missions: Mission[] = [];
    
    [...defaultDailyMissions, ...defaultSideMissions, defaultMainMission].forEach(missionData => {
      const mission: Mission = {
        id: randomUUID(),
        userId,
        title: missionData.title,
        description: missionData.description,
        type: missionData.type,
        xpReward: missionData.xpReward,
        icon: missionData.icon,
        completed: false,
        completedAt: null,
        resetDate: missionData.type === 'daily' ? new Date() : null,
        createdAt: new Date(),
      };
      missions.push(mission);
      this.missions.set(mission.id, mission);
    });

    return missions;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      level: 1,
      xp: 0,
      totalXP: 0,
      availablePoints: 5,
      stats: {
        strength: 10,
        agility: 10,
        intelligence: 10,
        vitality: 10
      },
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    
    // Create default missions for new user
    this.createDefaultMissions(id);
    
    return user;
  }

  async updateUserStats(userId: string, updateData: UpdateUserStats): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      stats: updateData.stats,
      availablePoints: updateData.availablePoints
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserXP(userId: string, xp: number, totalXP: number, level: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    // Calculate available points from level ups
    const levelDiff = level - user.level;
    const newAvailablePoints = user.availablePoints + (levelDiff * 2);

    const updatedUser: User = {
      ...user,
      xp,
      totalXP,
      level,
      availablePoints: newAvailablePoints
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserMissions(userId: string): Promise<Mission[]> {
    return Array.from(this.missions.values()).filter(
      mission => mission.userId === userId
    );
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const id = randomUUID();
    const newMission: Mission = {
      id,
      userId: mission.userId,
      title: mission.title,
      description: mission.description,
      type: mission.type,
      xpReward: mission.xpReward,
      icon: mission.icon,
      completed: false,
      completedAt: null,
      resetDate: mission.resetDate || null,
      createdAt: new Date(),
    };
    
    this.missions.set(id, newMission);
    return newMission;
  }

  async completeMission(missionId: string, userId: string): Promise<Mission | undefined> {
    const mission = this.missions.get(missionId);
    if (!mission || mission.userId !== userId || mission.completed) return undefined;

    const completedMission: Mission = {
      ...mission,
      completed: true,
      completedAt: new Date()
    };

    this.missions.set(missionId, completedMission);
    return completedMission;
  }

  async resetDailyMissions(userId: string): Promise<void> {
    const userMissions = await this.getUserMissions(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    userMissions.forEach(mission => {
      if (mission.type === 'daily') {
        const resetDate = mission.resetDate ? new Date(mission.resetDate) : new Date();
        resetDate.setHours(0, 0, 0, 0);

        if (resetDate < today) {
          const resetMission: Mission = {
            ...mission,
            completed: false,
            completedAt: null,
            resetDate: new Date()
          };
          this.missions.set(mission.id, resetMission);
        }
      }
    });
  }
}

export const storage = new MemStorage();
