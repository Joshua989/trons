import React, { useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import logo from './logo.svg';
import bg from './bg.png';
import Header from './header';

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#feature' },
    { name: 'OTC Service', href: '#otc' },
    { name: 'Off-Ramp', href: '#off' },
    { name: 'About Us', href: '/abt' },
  ];

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat lg:bg-cover lg:bg-center lg:bg-no-repeat"
      style={{ backgroundImage: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `url(${bg})` : 'none' }}
    >
      <nav className="relative z-50">
        <div className="max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/">
              <img 
                src={logo} 
                alt="Logo" 
                className="h-6 w-auto sm:h-7 md:h-8 lg:h-9" 
              />
              </a>
            </div>

            {/* Desktop Navigation - Hidden on tablets and mobile */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 px-2 xl:px-3 py-2 text-sm xl:text-base font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Download App Button (Desktop) */}
            <div className="hidden lg:block">
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-3 xl:px-4 py-3 rounded-lg text-xs xl:text-sm font-medium flex items-center space-x-2 transition-colors duration-200">
              <Download size={14} className="xl:w-4 xl:h-4" />
              <span className="whitespace-nowrap">Download App</span>
              </button>
            </div>

            {/* Tablet Navigation - Visible only on medium screens */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              {navItems.slice(0, 4).map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
              <button className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200">
                <Download size={14} />
                <span className="hidden xl:inline">App</span>
              </button>
            </div>

            {/* Mobile menu button and download button - Visible on mobile */}
            <div className="md:hidden lg:hidden flex items-center space-x-2">
                <button className="bg-gray-700 hover:bg-gray-800 text-white px-7 sm:px-8 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors duration-200">
                <Download size={14} className="sm:w-4 sm:h-4" />
                <span className="inline">Download</span>
                </button>
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1.5 sm:p-2 rounded-md"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
              </button>
            </div>

            {/* Tablet menu button - Visible only on medium screens for overflow items */}
            <div className="hidden md:block lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 rounded-md ml-2"
                aria-label="More options"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
            <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 block px-3 py-3 text-base font-medium rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {/* Mobile Download App Button */}
              <div className="pt-4 pb-2">
                <button 
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg text-base font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Download size={18} />
                  <span>Download App</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tablet overflow menu */}
        {isMenuOpen && (
          <div className="hidden md:block lg:hidden absolute top-full right-0 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-lg shadow-lg mt-1 mr-4 min-w-[200px]">
            <div className="py-2">
              {navItems.slice(4).map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-50/80 block px-4 py-2 text-sm font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div>
        <Header />
      </div>
    </div>
  );
};

export default Nav;