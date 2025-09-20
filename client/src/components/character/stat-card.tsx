import { Button } from "@/components/ui/button";

interface StatCardProps {
  statName: string;
  statValue: number;
  displayName: string;
  description: string;
  progress: number;
  color: string;
  backgroundColor: string;
  icon: string;
  onAdd: () => void;
  canAdd: boolean;
  'data-testid'?: string;
}

export default function StatCard({
  statName,
  statValue,
  displayName,
  description,
  progress,
  color,
  backgroundColor,
  icon,
  onAdd,
  canAdd,
  'data-testid': testId
}: StatCardProps) {
  return (
    <div className="stat-card rounded-lg p-4" data-testid={testId}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${backgroundColor} rounded-full flex items-center justify-center`}>
            <i className={`${icon} ${color}`}></i>
          </div>
          <span className="font-medium">{displayName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`font-mono text-lg font-bold ${color}`}>
            {statValue}
          </span>
          <Button
            size="sm"
            onClick={onAdd}
            disabled={!canAdd}
            className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid={`button-add-${statName}`}
          >
            +
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-2">{description}</div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300`}
          style={{ 
            width: `${progress}%`,
            backgroundColor: `var(--${color.replace('text-', '')})`
          }}
        ></div>
      </div>
    </div>
  );
}
