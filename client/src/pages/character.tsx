import { useState } from "react";
import { UserData, STAT_COLORS, STAT_BACKGROUNDS, STAT_ICONS } from "@/lib/types";
import StatCard from "@/components/character/stat-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CharacterPageProps {
  user: UserData;
  updateUser: (user: UserData) => void;
}

export default function CharacterPage({ user, updateUser }: CharacterPageProps) {
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const addStat = async (statName: keyof typeof user.stats) => {
    if (user.availablePoints <= 0) {
      toast({
        title: "Sem pontos disponíveis!",
        description: "Complete mais missões para ganhar pontos de atributo.",
        variant: "destructive"
      });
      return;
    }

    const newStats = {
      ...user.stats,
      [statName]: user.stats[statName] + 1
    };

    const updatedUser: UserData = {
      ...user,
      stats: newStats,
      availablePoints: user.availablePoints - 1
    };

    try {
      setUpdating(true);
      
      const response = await fetch('/api/character/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          stats: newStats,
          availablePoints: updatedUser.availablePoints
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        
        toast({
          title: "Atributo aumentado!",
          description: `${getStatDisplayName(statName)} aumentou para ${newStats[statName]}`,
        });
      } else {
        throw new Error('Failed to update stats');
      }
    } catch (error) {
      console.error('Failed to update stats:', error);
      
      // Offline mode - update locally
      updateUser(updatedUser);
      
      toast({
        title: "Atributo aumentado (Offline)!",
        description: `${getStatDisplayName(statName)} aumentou para ${newStats[statName]}`,
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatDisplayName = (stat: keyof typeof user.stats) => {
    const names = {
      strength: 'Força',
      agility: 'Agilidade',
      intelligence: 'Inteligência',
      vitality: 'Vitalidade'
    };
    return names[stat];
  };

  const getStatDescription = (stat: keyof typeof user.stats) => {
    const descriptions = {
      strength: 'Aumenta dano físico e resistência',
      agility: 'Aumenta velocidade e precisão',
      intelligence: 'Aumenta XP de estudo e habilidades',
      vitality: 'Aumenta energia e recuperação'
    };
    return descriptions[stat];
  };

  const getCurrentRank = () => {
    const level = user.level;
    if (level < 10) return 'E';
    if (level < 20) return 'D';
    if (level < 30) return 'C';
    if (level < 40) return 'B';
    if (level < 50) return 'A';
    return 'S';
  };

  const getStatProgress = (statValue: number) => {
    // Progress based on stat value (max 100 for visual purposes)
    return Math.min((statValue / 50) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Character Stats */}
      <div className="system-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-orbitron text-lg font-semibold">Atributos do Personagem</h3>
          <div className="text-sm">
            <span className="text-muted-foreground">Pontos Disponíveis: </span>
            <span className="text-primary font-bold font-mono" data-testid="text-available-points">
              {user.availablePoints}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(user.stats).map(([statName, statValue]) => (
            <StatCard
              key={statName}
              statName={statName as keyof typeof user.stats}
              statValue={statValue}
              displayName={getStatDisplayName(statName as keyof typeof user.stats)}
              description={getStatDescription(statName as keyof typeof user.stats)}
              progress={getStatProgress(statValue)}
              color={STAT_COLORS[statName as keyof typeof STAT_COLORS]}
              backgroundColor={STAT_BACKGROUNDS[statName as keyof typeof STAT_BACKGROUNDS]}
              icon={STAT_ICONS[statName as keyof typeof STAT_ICONS]}
              onAdd={() => addStat(statName as keyof typeof user.stats)}
              canAdd={user.availablePoints > 0 && !updating}
              data-testid={`stat-${statName}`}
            />
          ))}
        </div>
      </div>

      {/* Character Info */}
      <div className="system-panel rounded-xl p-6">
        <h3 className="font-orbitron text-lg font-semibold mb-4">Informações do Hunter</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="info-level">
            <div className="text-2xl font-bold font-mono text-primary glow-text">
              {user.level}
            </div>
            <div className="text-sm text-muted-foreground">Nível Atual</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="info-rank">
            <div className="text-2xl font-bold font-mono text-accent">
              {getCurrentRank()}
            </div>
            <div className="text-sm text-muted-foreground">Rank Hunter</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg" data-testid="info-total-xp">
            <div className="text-2xl font-bold font-mono text-secondary">
              {user.totalXP.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">XP Total</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="mt-6">
          <h4 className="font-semibold mb-3">Conquistas Recentes</h4>
          <div className="space-y-2">
            {user.level >= 7 && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-trophy text-yellow-900 text-sm"></i>
                </div>
                <div>
                  <div className="font-medium">Hunter Dedicado</div>
                  <div className="text-xs text-muted-foreground">
                    Alcançou nível {user.level}
                  </div>
                </div>
              </div>
            )}
            
            {user.totalXP >= 5000 && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-star text-blue-900 text-sm"></i>
                </div>
                <div>
                  <div className="font-medium">Colecionador de XP</div>
                  <div className="text-xs text-muted-foreground">
                    Alcançou {user.totalXP.toLocaleString()} XP total
                  </div>
                </div>
              </div>
            )}
            
            {Object.values(user.stats).some(stat => stat >= 20) && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                  <i className="fas fa-medal text-purple-900 text-sm"></i>
                </div>
                <div>
                  <div className="font-medium">Especialista</div>
                  <div className="text-xs text-muted-foreground">
                    Alcançou 20+ em um atributo
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {user.level < 7 && user.totalXP < 5000 && !Object.values(user.stats).some(stat => stat >= 20) && (
            <div className="text-center py-4 text-muted-foreground">
              <i className="fas fa-trophy text-2xl mb-2"></i>
              <p>Complete mais missões para desbloquear conquistas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
