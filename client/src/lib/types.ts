export interface UserData {
  id: string;
  username: string;
  level: number;
  xp: number;
  totalXP: number;
  availablePoints: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
  };
  createdAt: string;
}

export interface MissionData {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'daily' | 'side' | 'main';
  xpReward: number;
  completed: boolean;
  completedAt: string | null;
  resetDate: string | null;
  icon: string;
  createdAt: string;
}

export interface TabType {
  id: string;
  name: string;
  icon: string;
}

export const TABS: TabType[] = [
  { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  { id: 'missions', name: 'Missões', icon: 'fas fa-tasks' },
  { id: 'character', name: 'Personagem', icon: 'fas fa-user' },
];

export const XP_PER_LEVEL = 1000;

export const STAT_COLORS = {
  strength: 'text-red-400',
  agility: 'text-blue-400',
  intelligence: 'text-purple-400',
  vitality: 'text-green-400',
} as const;

export const STAT_BACKGROUNDS = {
  strength: 'bg-red-500/20',
  agility: 'bg-blue-500/20',
  intelligence: 'bg-purple-500/20',
  vitality: 'bg-green-500/20',
} as const;

export const STAT_ICONS = {
  strength: 'fas fa-fist-raised',
  agility: 'fas fa-running',
  intelligence: 'fas fa-brain',
  vitality: 'fas fa-heart',
} as const;
