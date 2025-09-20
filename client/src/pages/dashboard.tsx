import { UserData } from "@/lib/types";
import XPBar from "@/components/ui/xp-bar";

interface DashboardPageProps {
  user: UserData;
  updateUser: (user: UserData) => void;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const getCurrentRank = (level: number) => {
    if (level < 10) return 'E';
    if (level < 20) return 'D';
    if (level < 30) return 'C';
    if (level < 40) return 'B';
    if (level < 50) return 'A';
    return 'S';
  };

  const getXPForCurrentLevel = () => {
    return user.totalXP % 1000;
  };

  const getMaxXPForLevel = () => {
    return 1000;
  };

  return (
    <div className="space-y-6">
      {/* Character Overview */}
      <div className="system-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-orbitron text-xl font-semibold">Status do Hunter</h2>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-primary glow-text">
              Nível {user.level}
            </div>
            <div className="text-sm text-muted-foreground">
              Hunter Rank: {getCurrentRank(user.level)}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Experiência</span>
            <span className="font-mono">
              {getXPForCurrentLevel().toLocaleString()} / {getMaxXPForLevel().toLocaleString()} XP
            </span>
          </div>
          <XPBar 
            current={getXPForCurrentLevel()} 
            max={getMaxXPForLevel()} 
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center" data-testid="stat-strength">
            <div className="text-lg font-bold text-red-400 font-mono">
              {user.stats.strength}
            </div>
            <div className="text-xs text-muted-foreground">Força</div>
          </div>
          <div className="text-center" data-testid="stat-agility">
            <div className="text-lg font-bold text-blue-400 font-mono">
              {user.stats.agility}
            </div>
            <div className="text-xs text-muted-foreground">Agilidade</div>
          </div>
          <div className="text-center" data-testid="stat-intelligence">
            <div className="text-lg font-bold text-purple-400 font-mono">
              {user.stats.intelligence}
            </div>
            <div className="text-xs text-muted-foreground">Inteligência</div>
          </div>
          <div className="text-center" data-testid="stat-vitality">
            <div className="text-lg font-bold text-green-400 font-mono">
              {user.stats.vitality}
            </div>
            <div className="text-xs text-muted-foreground">Vitalidade</div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="system-panel rounded-xl p-6">
        <h3 className="font-orbitron text-lg font-semibold mb-4">Progresso de Hoje</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Daily Mission Progress */}
          <div className="stat-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Missões Diárias</span>
              <i className="fas fa-calendar-day text-primary"></i>
            </div>
            <div className="text-xl font-bold font-mono">0/5</div>
            <div className="text-xs text-accent">+0 XP hoje</div>
          </div>

          {/* Side Quests */}
          <div className="stat-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Side Quests</span>
              <i className="fas fa-compass text-secondary"></i>
            </div>
            <div className="text-xl font-bold font-mono">0/2</div>
            <div className="text-xs text-accent">+0 XP hoje</div>
          </div>

          {/* Main Quest */}
          <div className="stat-card rounded-lg p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Missão Principal</span>
              <i className="fas fa-crown text-yellow-400"></i>
            </div>
            <div className="text-xl font-bold font-mono">0/1</div>
            <div className="text-xs text-accent">+500 XP disponível</div>
          </div>
        </div>
      </div>
    </div>
  );
}
