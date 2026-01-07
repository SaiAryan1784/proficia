"use client";
import Link from 'next/link';
import React, { useState, useEffect, FC } from 'react';
import { FiUser, FiMenu, FiX, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { BrandLogo } from './BrandLogo';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <FiBarChart2 size={20} /> },
  { href: '/admin/users', label: 'Users', icon: <FiUser size={20} /> },
  { href: '/admin/test-attempts', label: 'Test Attempts', icon: <FiBarChart2 size={20} /> },
  { href: '/admin/settings', label: 'Settings', icon: <FiBarChart2 size={20} /> },
];

const AdminNav: FC = () => {
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
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all duration-200"
          aria-label="Open navigation menu"
        >
          <FiMenu size={24} />
        </button>
      )}

      {/* Mobile overlay - Only visible when menu is open on mobile */}
      {isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-background/80 z-30 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out
          bg-card/50 backdrop-blur-xl border-r border-border
          text-muted-foreground shadow-sm flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isSidebarVisible() ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className={`
          p-5 border-b border-border flex items-center
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!isCollapsed && (
            <BrandLogo variant="full" width={120} />
          )}
          {isCollapsed && (
            <BrandLogo variant="icon" width={40} />
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiMenu size={18} /> : <FiX size={18} />}
          </button>

          {/* Mobile Close Button */}
          {!isCollapsed && isMobileOpen && typeof window !== 'undefined' && window.innerWidth < 1024 && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              aria-label="Close navigation menu"
            >
              <FiX size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <ul className="space-y-2 px-3">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href;

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`
                      relative flex items-center p-3 rounded-lg transition-all duration-200 group
                      ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} 
                      ${isActive
                        ? 'bg-secondary/10 text-secondary font-medium'
                        : 'text-muted-foreground hover:bg-secondary/5 hover:text-secondary'}
                    `}
                  >
                    <span className={`transition-transform duration-200 ${!isCollapsed && isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {icon}
                    </span>
                    {!isCollapsed && <span className="ml-3">{label}</span>}

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-secondary rounded-l-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Area */}
        <div className={`
          p-4 mt-auto border-t border-border 
          ${isCollapsed ? 'text-center' : 'px-4'}
        `}>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`
              py-2.5 rounded-lg font-medium transition-all duration-200
              bg-destructive/10 text-destructive hover:bg-destructive/20
              ${isCollapsed ? 'w-12 h-12 flex items-center justify-center mx-auto' : 'w-full flex items-center justify-center gap-2'}
            `}
            title="Logout"
          >
            <FiLogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {!isCollapsed && (
            <div className="mt-4 text-center text-xs text-muted-foreground font-medium">
              © 2025 Proficia
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminNav;