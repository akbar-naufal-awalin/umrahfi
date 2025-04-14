import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-secondary/20",
        active ? "bg-secondary text-white" : "text-gray-700"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-primary">UmrahFi CMS</h1>
          </div>

          <nav className="flex-grow p-4 space-y-2">
            <NavItem 
              href="/company/dashboard" 
              icon={<Home size={20} />} 
              label="Dashboard" 
              active={pathname === '/company/dashboard'} 
            />
            <NavItem 
              href="/company/packages" 
              icon={<Package size={20} />} 
              label="Packages" 
              active={pathname?.startsWith('/company/packages')} 
            />
            <NavItem 
              href="/company/orders" 
              icon={<Users size={20} />} 
              label="Orders" 
              active={pathname?.startsWith('/company/orders')} 
            />
            <NavItem 
              href="/company/analytics" 
              icon={<BarChart2 size={20} />} 
              label="Analytics" 
              active={pathname?.startsWith('/company/analytics')} 
            />
            <NavItem 
              href="/company/settings" 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={pathname?.startsWith('/company/settings')} 
            />
          </nav>

          <div className="p-4 border-t">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
} 