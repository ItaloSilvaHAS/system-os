import { UserData, MissionData } from './types';

const STORAGE_KEYS = {
  USER: 'systemos_user',
  MISSIONS: 'systemos_missions',
  AUTH_TOKEN: 'systemos_auth',
} as const;

export class LocalStorage {
  static setUser(user: UserData): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): UserData | null {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  static clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  static setMissions(missions: MissionData[]): void {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
  }

  static getMissions(): MissionData[] {
    const missions = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    return missions ? JSON.parse(missions) : [];
  }

  static clearMissions(): void {
    localStorage.removeItem(STORAGE_KEYS.MISSIONS);
  }

  static setAuth(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static getAuth(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
