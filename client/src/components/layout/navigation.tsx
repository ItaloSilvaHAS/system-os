import { TABS } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-card border-b border-border px-4">
      <div className="flex space-x-6 overflow-x-auto">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`nav-tab py-4 px-2 text-sm font-medium whitespace-nowrap ${
              currentTab === tab.id ? 'active' : ''
            }`}
            data-testid={`button-tab-${tab.id}`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}
