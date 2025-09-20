interface XPBarProps {
  current: number;
  max: number;
}

export default function XPBar({ current, max }: XPBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full bg-muted rounded-full h-3">
      <div 
        className="xp-bar h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
        data-testid="xp-bar"
      />
    </div>
  );
}
