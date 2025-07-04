
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If we're not on home page, navigate home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
    setIsToolsOpen(false);
  };

  const handleHomeClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      scrollToSection('hero');
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', action: handleHomeClick },
    { label: 'About Us', action: () => scrollToSection('about') },
    { label: 'Our Services', action: () => scrollToSection('services') },
    { label: 'Founders', action: () => navigate('/founders') },
    { label: 'Certificate Validator', action: () => navigate('/validator') },
  ];

  const toolsItems = [
    { label: 'Marketing', action: () => scrollToSection('marketing') },
    { label: 'Students', action: () => scrollToSection('students') },
    { label: 'Social Media Creators', action: () => scrollToSection('social-creators') },
    { label: 'Cybersecurity', action: () => scrollToSection('cybersecurity') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer flex items-center"
              onClick={handleHomeClick}
            >
              <img 
                src="/logo.png" 
                alt="CodeResite" 
                className="h-12 w-auto"
              />
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.action}
                  className="text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* Tools Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  Our Tools
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black/90 border border-white/20 ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div className="py-1 grid grid-cols-1 gap-1">
                      {toolsItems.map((tool, index) => (
                        <button
                          key={index}
                          onClick={tool.action}
                          className="text-left px-4 py-2 text-sm text-white hover:bg-green-400/20 hover:text-green-400"
                        >
                          {tool.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-green-500 hover:bg-green-600 text-black font-medium px-6 py-2 rounded-full transition-all duration-200 hover:scale-105">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">Welcome!</span>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-400 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 rounded-lg mt-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-white hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/20 pt-2">
                {toolsItems.map((tool, index) => (
                  <button
                    key={index}
                    onClick={tool.action}
                    className="text-white hover:text-green-400 block px-3 py-2 rounded-md text-sm w-full text-left"
                  >
                    {tool.label}
                  </button>
                ))}
              </div>
              
              {/* Mobile Auth */}
              <div className="border-t border-white/20 pt-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className="bg-green-500 hover:bg-green-600 text-black font-medium w-full">
                      Get Started
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Welcome!</span>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
