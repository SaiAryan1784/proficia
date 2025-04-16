"use client";
import Link from 'next/link';
import React, { useState, useEffect, FC } from 'react';
import { FiHome, FiUser, FiMail, FiMenu, FiX, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: <FiHome size={20} /> },
  { href: '/statistics', label: 'Statistics', icon: <FiBarChart2 size={20} /> },
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
        setIsCollapsed(window.innerWidth < 1280); // Increased breakpoint for better usability
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

  // Helper to determine if sidebar should be visible
  const isSidebarVisible = () => {
    if (!isMounted) return false;
    if (typeof window === 'undefined') return false;
    
    // Always show on large screens or when mobile menu is open
    return window.innerWidth >= 1024 || isMobileOpen;
  };

  if (!isMounted) {
    return null; // Prevent layout shift on initial load
  }

  return (
    <>
      {/* Mobile Navigation Toggle - Fixed position */}
      {isMounted && !isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <button 
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200"
          aria-label="Open navigation menu"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Mobile overlay - Only visible when menu is open on mobile */}
      {isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
          bg-gradient-to-b from-blue-400 to-purple-400
          text-blue-900 shadow-xl flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isSidebarVisible() ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className={`
          p-5 border-b border-blue-400/30 flex items-center
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">Proficia</h1>
          )}
          {isCollapsed && (
            <div className="h-10 w-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl shadow-md">
              P
            </div>
          )}
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-blue-300/30 text-white hover:bg-blue-300/50 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiMenu size={18} /> : <FiX size={18} />}
          </button>

          {/* Mobile Close Button */}
          {!isCollapsed && isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center h-8 w-8 rounded-full bg-blue-300/30 text-white hover:bg-blue-300/50 transition-colors"
              aria-label="Close navigation menu"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
          <ul className="space-y-2 px-3">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              
              return (
                <li key={href}>
                  <Link 
                    href={href} 
                    className={`
                      relative flex items-center p-3 rounded-lg transition-all duration-200
                      ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} 
                      ${isActive 
                        ? 'bg-white text-blue-600 shadow-md font-medium' 
                        : 'text-white hover:bg-white/20'}
                    `}
                  >
                    <span className={`transition-transform duration-200 ${!isCollapsed && isActive ? 'scale-110' : ''}`}>
                      {icon}
                    </span>
                    {!isCollapsed && <span className="ml-3">{label}</span>}
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-blue-500 rounded-l-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer Area */}
        <div className={`
          p-4 mt-auto border-t border-blue-400/30 
          ${isCollapsed ? 'text-center' : 'px-4'}
        `}>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`
              py-2.5 rounded-lg font-medium transition-all duration-200
              bg-white/90 text-red-600 hover:bg-white shadow-sm
              ${isCollapsed ? 'w-12 h-12 flex items-center justify-center mx-auto' : 'w-full flex items-center justify-center gap-2'}
            `}
            title="Logout"
          >
            <FiLogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>
          
          {!isCollapsed && (
            <div className="mt-4 text-center text-sm text-white/70">
              © 2025 Proficia
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideNav;