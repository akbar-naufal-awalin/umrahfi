"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Building, 
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      
      if (!session) {
        // Redirect to login if not authenticated
        router.push("/login?callbackUrl=/admin");
        return;
      }
      
      // Check if user has admin permissions
      const role = session.user.role;
      setUserRole(role);
      
      if (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "COMPANY_ADMIN") {
        // Redirect to home if not an admin
        router.push("/");
        return;
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };
  
  // Define navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/admin",
      roles: ["ADMIN", "SUPER_ADMIN", "COMPANY_ADMIN"]
    },
    {
      title: "Packages",
      icon: <Package size={20} />,
      href: "/admin/packages",
      roles: ["ADMIN", "SUPER_ADMIN", "COMPANY_ADMIN"]
    },
    {
      title: "Bookings",
      icon: <Calendar size={20} />,
      href: "/admin/bookings",
      roles: ["ADMIN", "SUPER_ADMIN", "COMPANY_ADMIN"]
    },
    {
      title: "Companies",
      icon: <Building size={20} />,
      href: "/admin/companies",
      roles: ["ADMIN", "SUPER_ADMIN"]
    },
    {
      title: "Users",
      icon: <Users size={20} />,
      href: "/admin/users",
      roles: ["ADMIN", "SUPER_ADMIN"]
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/admin/settings",
      roles: ["ADMIN", "SUPER_ADMIN", "COMPANY_ADMIN"]
    }
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0 transition duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-primary">UmrahFi Admin</span>
          </Link>
          <button 
            className="p-1 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 ${
                    pathname === item.href ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
            
            <li className="mt-8 pt-4 border-t">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <button 
            className="p-1 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {userRole && userRole[0]}
                </div>
                <span className="ml-2 text-sm font-medium">Admin User</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 