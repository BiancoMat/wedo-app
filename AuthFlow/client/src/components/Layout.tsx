import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Home, User, Heart, Users, Bell, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { currentUser, notifications } = useAppContext();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => n.status === 'unread').length;

  const navigation = [
    { name: 'Home', href: '/', icon: Home, current: location === '/' },
    { name: 'Profilo', href: '/profile', icon: User, current: location === '/profile' },
    { name: 'Favori', href: '/favors', icon: Heart, current: location === '/favors' },
    { name: 'Gruppi', href: '/groups', icon: Users, current: location === '/groups' },
    { name: 'Notifiche', href: '/notifications', icon: Bell, current: location === '/notifications' },
  ];

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  if (!user || !currentUser) {
    return <div>{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 gradient-bg">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <Heart className="text-white" size={20} />
                  </div>
                  <h1 className="text-2xl font-bold text-white">WeDo</h1>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <a className={`${
                        item.current
                          ? 'bg-white bg-opacity-10 text-white'
                          : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                      } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative`}>
                        <Icon className="mr-3" size={18} />
                        {item.name}
                        {item.name === 'Notifiche' && unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {unreadNotifications}
                          </span>
                        )}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User Profile */}
            <div className="flex-shrink-0 flex border-t border-white border-opacity-20 p-4">
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {getInitials(currentUser.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-white text-opacity-70">
                    {currentUser.credits} crediti
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="ml-2 p-2 text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full gradient-bg">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <Heart className="text-white" size={20} />
                  </div>
                  <h1 className="text-2xl font-bold text-white">WeDo</h1>
                </div>
              </div>
              
              <nav className="mt-5 px-2 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <a 
                        className={`${
                          item.current
                            ? 'bg-white bg-opacity-10 text-white'
                            : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                        } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3" size={18} />
                        {item.name}
                        {item.name === 'Notifiche' && unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {unreadNotifications}
                          </span>
                        )}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex-shrink-0 flex border-t border-white border-opacity-20 p-4">
              <div className="flex items-center w-full">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">
                    {getInitials(currentUser.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-white text-opacity-70">
                    {currentUser.credits} crediti
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="ml-2 p-2 text-white text-opacity-70 hover:text-white hover:bg-white hover:bg-opacity-10"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      {isMobile && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            onClick={() => setSidebarOpen(true)}
            className="wedo-blue text-white p-3 rounded-xl shadow-lg hover:wedo-blue-dark"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar for mobile */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 wedo-blue rounded-lg flex items-center justify-center mr-3">
                  <Heart className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold text-blue-600">WeDo</h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {currentUser.credits} crediti
                </span>
                <div className="relative">
                  <Link href="/notifications">
                    <a className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Bell size={20} />
                      {unreadNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {unreadNotifications}
                        </span>
                      )}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
