
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Database, 
  Users, 
  Map,
  ChartBar,
  Settings, 
  Shield
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("fixed left-0 top-0 bottom-0 w-16 md:w-64 bg-sidebar p-4 flex flex-col border-r border-border/30", className)}>
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-solana-purple mr-2" />
        <span className="text-xl font-bold hidden md:block">ChainEye</span>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem icon={<Search />} label="Dashboard" to="/" />
          <NavItem icon={<Map />} label="Transaction Flow" to="/flow" />
          <NavItem icon={<Database />} label="Wallet Analysis" to="/wallet" />
          <NavItem icon={<ChartBar />} label="Clustering" to="/clustering" />
          <NavItem icon={<Users />} label="Entity Labeling" to="/entities" />
          <NavItem icon={<Settings />} label="Settings" to="/settings" />
        </ul>
      </nav>

      <div className="border-t border-border/30 pt-4 mt-auto">
        <div className="flex items-center text-sm text-muted-foreground">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse-soft"></div>
          <span className="hidden md:block">Connected to Solana Mainnet</span>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

function NavItem({ icon, label, to }: NavItemProps) {
  const isActive = window.location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors",
          isActive 
            ? "bg-sidebar-accent text-solana-purple"
            : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="mr-3">{icon}</span>
        <span className="hidden md:block">{label}</span>
      </Link>
    </li>
  );
}
