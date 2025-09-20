import { useState, useEffect } from "react";
import { UserData, MissionData, XP_PER_LEVEL } from "@/lib/types";
import MissionCard from "@/components/missions/mission-card";
import { LocalStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface MissionsPageProps {
  user: UserData;
  updateUser: (user: UserData) => void;
}

export default function MissionsPage({ user, updateUser }: MissionsPageProps) {
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const response = await fetch('/api/missions', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMissions(data.missions);
        LocalStorage.setMissions(data.missions);
      } else {
        // Fallback to localStorage
        const storedMissions = LocalStorage.getMissions();
        setMissions(storedMissions);
      }
    } catch (error) {
      console.error('Failed to load missions:', error);
      // Use localStorage as fallback
      const storedMissions = LocalStorage.getMissions();
      setMissions(storedMissions);
    } finally {
      setLoading(false);
    }
  };

  const completeMission = async (missionId: string, xpReward: number) => {
    try {
      const response = await fetch(`/api/missions/${missionId}/complete`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        // Update mission state
        const updatedMissions = missions.map(mission => 
          mission.id === missionId 
            ? { ...mission, completed: true, completedAt: new Date().toISOString() }
            : mission
        );
        setMissions(updatedMissions);
        LocalStorage.setMissions(updatedMissions);

        // Calculate new user stats
        const newTotalXP = user.totalXP + xpReward;
        const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
        const newCurrentXP = newTotalXP % XP_PER_LEVEL;
        const leveledUp = newLevel > user.level;
        
        const updatedUser: UserData = {
          ...user,
          xp: newCurrentXP,
          totalXP: newTotalXP,
          level: newLevel,
          availablePoints: leveledUp ? user.availablePoints + ((newLevel - user.level) * 2) : user.availablePoints
        };

        updateUser(updatedUser);

        // Show success message
        toast({
          title: "Missão Completada!",
          description: `+${xpReward} XP${leveledUp ? ` • Level Up! Nível ${newLevel}` : ''}`,
        });

        if (leveledUp) {
          setTimeout(() => {
            toast({
              title: "LEVEL UP!",
              description: `Parabéns! Você alcançou o nível ${newLevel}! +${(newLevel - user.level) * 2} pontos de atributo disponíveis.`,
            });
          }, 1000);
        }

      } else {
        toast({
          title: "Erro",
          description: "Não foi possível completar a missão",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to complete mission:', error);
      
      // Offline mode - update locally
      const updatedMissions = missions.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true, completedAt: new Date().toISOString() }
          : mission
      );
      setMissions(updatedMissions);
      LocalStorage.setMissions(updatedMissions);

      const newTotalXP = user.totalXP + xpReward;
      const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
      const newCurrentXP = newTotalXP % XP_PER_LEVEL;
      const leveledUp = newLevel > user.level;
      
      const updatedUser: UserData = {
        ...user,
        xp: newCurrentXP,
        totalXP: newTotalXP,
        level: newLevel,
        availablePoints: leveledUp ? user.availablePoints + ((newLevel - user.level) * 2) : user.availablePoints
      };

      updateUser(updatedUser);

      toast({
        title: "Missão Completada (Offline)!",
        description: `+${xpReward} XP${leveledUp ? ` • Level Up! Nível ${newLevel}` : ''}`,
      });
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const dailyMissions = missions.filter(m => m.type === 'daily');
  const sideMissions = missions.filter(m => m.type === 'side');
  const mainMissions = missions.filter(m => m.type === 'main');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-pulse">
            <i className="fas fa-tasks text-4xl text-primary mb-4"></i>
          </div>
          <p className="text-muted-foreground">Carregando missões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Missions */}
      <div className="system-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-lg font-semibold">Missões Diárias</h3>
          <div className="text-sm text-muted-foreground">
            Reset em: <span className="text-primary font-mono" data-testid="text-reset-timer">
              {getTimeUntilReset()}
            </span>
          </div>
        </div>

        <div className="space-y-3" data-testid="missions-daily">
          {dailyMissions.length > 0 ? (
            dailyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={() => completeMission(mission.id, mission.xpReward)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-calendar-day text-4xl mb-4"></i>
              <p>Nenhuma missão diária disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Side Quests */}
      <div className="system-panel rounded-xl p-6">
        <h3 className="font-orbitron text-lg font-semibold mb-4">Side Quests</h3>
        <div className="space-y-3" data-testid="missions-side">
          {sideMissions.length > 0 ? (
            sideMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={() => completeMission(mission.id, mission.xpReward)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-compass text-4xl mb-4"></i>
              <p>Nenhuma side quest disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Quest */}
      <div className="system-panel rounded-xl p-6">
        <h3 className="font-orbitron text-lg font-semibold mb-4">Missão Principal</h3>
        <div data-testid="missions-main">
          {mainMissions.length > 0 ? (
            mainMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={() => completeMission(mission.id, mission.xpReward)}
                isMain={true}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-crown text-4xl mb-4"></i>
              <p>Nenhuma missão principal disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
