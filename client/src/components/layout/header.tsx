import { UserData } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  user: UserData;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="system-panel border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="font-orbitron text-xl font-bold text-primary glow-text">
            SystemOS
          </h1>
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Hunter:</span>
            <span className="font-medium" data-testid="text-username">
              {user.username}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-logout"
        >
          <i className="fas fa-sign-out-alt"></i>
        </Button>
      </div>
    </header>
  );
}
