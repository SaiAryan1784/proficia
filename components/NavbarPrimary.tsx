"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import DarkModeToggle from './DarkModeToggle';

const NavbarPrimary = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative bg-white dark:bg-gray-900 shadow-md z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-400" style={{ backgroundSize: '200% 100%', backgroundPosition: '70% 0' }}>
              Proficia
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <DarkModeToggle size="sm" variant="button" />
              <Link 
                href="/login" 
                className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-lg font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-4 py-2 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle size="sm" variant="button" />
            <button 
              className="bg-white dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-200">
          <Link 
            href="/login" 
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPrimary;