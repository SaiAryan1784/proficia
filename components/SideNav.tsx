"use client";
import Link from 'next/link';
import React, { useState, useEffect, FC } from 'react';
import { FiHome, FiUser, FiMail, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: <FiHome size={20} /> },
  // { href: '/practice', label: 'Practice', icon: <FiEdit size={20} /> },
  // { href: '/statistics', label: 'Statistics', icon: <FiBarChart2 size={20} /> },
  { href: '/profile', label: 'Profile', icon: <FiUser size={20} /> },
  { href: '/contact', label: 'Contact', icon: <FiMail size={20} /> },
];

const SideNav: FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Set initial state based on screen size
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsCollapsed(window.innerWidth < 1024);
      }
    };
    
    handleResize();
    
    // Add event listener for window resizing
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 transition-all duration-300
        bg-gradient-to-b from-blue-300 to-purple-300
        text-blue-900 shadow-lg flex flex-col border-r-0
        ${isCollapsed ? 'w-20 items-center' : 'w-60 items-stretch'}
        ${isMounted && !isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 ? '-translate-x-full' : 'translate-x-0'}
      `}
    >
      {/* Mobile Navigation Toggle - Shown only when sidebar is collapsed on mobile */}
      {isMounted && !isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div className="fixed top-4 left-4 z-50">
          <button 
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-blue-400 text-white shadow-lg hover:bg-blue-500 transition-all"
          >
            <FiMenu size={24} />
          </button>
        </div>
      )}

      {/* Logo Area */}
      <div className={`
        p-4 border-b border-blue-400/30 flex items-center
        ${isCollapsed ? 'justify-center' : 'justify-between'}
      `}>
        {!isCollapsed && <h1 className="text-2xl font-bold">Proficia</h1>}
        {isCollapsed && <div className="h-10 w-10 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold text-xl">P</div>}
        
        {/* Desktop Collapse Toggle */}
        <button 
          onClick={toggleCollapse}
          className="hidden lg:block text-blue-700 hover:text-blue-900 transition-colors"
        >
          {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            
            return (
              <li key={href}>
                <Link 
                  href={href} 
                  className={`
                    relative flex items-center p-3 rounded-lg transition-all
                    ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} 
                    ${isActive 
                      ? 'bg-white text-blue-600 shadow-md font-medium' 
                      : 'text-blue-800 hover:bg-white/40'}
                  `}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-blue-800'}>
                    {icon}
                  </span>
                  {!isCollapsed && <span className="ml-3">{label}</span>}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 h-6 w-1 bg-blue-500 rounded-l-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer Area */}
      <div className={`
        p-4 border-t border-blue-400/30 text-center text-sm text-blue-700
        ${isCollapsed ? 'hidden' : 'block'}
      `}>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full py-2 mt-2 flex items-center justify-center gap-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="mt-3">© 2025 Proficia</div>
      </div>

      {/* Logout button for collapsed mode */}
      {isCollapsed && (
        <div className="p-4 border-t border-blue-400/30 flex justify-center">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-3 rounded-lg bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      )}

      {/* Close button for mobile menu */}
      {isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <button 
          onClick={toggleMobileMenu}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-blue-900 hover:bg-white/40 transition-all"
        >
          <FiX size={20} />
        </button>
      )}
    </aside>
  );
};

export default SideNav;