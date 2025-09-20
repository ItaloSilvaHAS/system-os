import { MissionData } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface MissionCardProps {
  mission: MissionData;
  onComplete: () => void;
  isMain?: boolean;
}

export default function MissionCard({ mission, onComplete, isMain = false }: MissionCardProps) {
  const getXPColor = () => {
    if (mission.type === 'main') return 'text-yellow-400';
    if (mission.type === 'side') return 'text-secondary';
    return 'text-primary';
  };

  const getStatusColor = () => {
    if (mission.completed) return 'text-accent';
    return 'text-muted-foreground';
  };

  const handleClick = () => {
    if (!mission.completed) {
      onComplete();
    }
  };

  if (isMain) {
    return (
      <div 
        className={`mission-card rounded-lg p-6 ${
          mission.completed ? 'mission-completed' : 'cursor-pointer'
        }`}
        onClick={handleClick}
        data-testid={`mission-${mission.id}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ${
              mission.completed ? 'bg-accent' : ''
            }`}>
              <i className={`${mission.completed ? 'fas fa-check text-accent-foreground' : mission.icon + ' text-yellow-900'} text-lg`}></i>
            </div>
            <div>
              <h4 className="font-medium text-lg">{mission.title}</h4>
              <p className="text-sm text-muted-foreground">{mission.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                  Alta Prioridade
                </span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Epic Reward
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`${getXPColor()} font-bold text-xl`}>
              +{mission.xpReward} XP
            </div>
            <div className={`text-xs ${getStatusColor()}`}>
              {mission.completed ? 'Completado' : 'Pendente'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mission-card rounded-lg p-4 ${
        mission.completed ? 'mission-completed' : 'cursor-pointer'
      }`}
      onClick={handleClick}
      data-testid={`mission-${mission.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            mission.completed 
              ? 'bg-accent' 
              : 'bg-muted'
          }`}>
            <i className={`${
              mission.completed 
                ? 'fas fa-check text-accent-foreground' 
                : mission.icon + ' text-primary'
            } text-sm`}></i>
          </div>
          <div>
            <h4 className="font-medium">{mission.title}</h4>
            <p className="text-sm text-muted-foreground">{mission.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`${getXPColor()} font-semibold`}>
            +{mission.xpReward} XP
          </div>
          <div className={`text-xs ${getStatusColor()}`}>
            {mission.completed ? 'Completado' : 'Pendente'}
          </div>
        </div>
      </div>
    </div>
  );
}
