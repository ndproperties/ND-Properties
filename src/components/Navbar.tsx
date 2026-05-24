import React from 'react';
import { motion } from 'motion/react';
import { Menu, X, Calendar } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'listings' | 'about' | 'contact' | 'admin';
  setActiveTab: (tab: 'home' | 'listings' | 'about' | 'contact' | 'admin') => void;
  onBookClick: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onBookClick }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const tabs: { id: 'home' | 'listings' | 'about' | 'contact'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'listings', label: 'Listings' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/60 bg-white/40 dark:bg-black/40 backdrop-blur-[32px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
      <div className="flex justify-between items-center w-full px-6 md:px-20 py-4 max-w-7xl mx-auto">
        
        {/* Logo and Branding */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-logo-container"
        >
          <img 
            alt="ND Properties Logo" 
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover transition-transform duration-300 md:group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD7Lih9kk7-uMwdVWFApkNsAfy9RDkCdcLEEfMQ_n8kxUbgC0DCZWwoeF-XefEPgGKzt-qDAO0hiau7HykL-RUFmBgqdDJ9_R77A-XeTQh4GQyNW8UbVJj4vo7ECiVqW8jP5ES71Y-7NoBeDUTpVuK94L_QVnEJVqttto156SKMU8zY-APcbuNYiVVpM39ZA13MQsgSnlO5JBnmaPVusY_XoZOuxYVXs0w1QRN2fuh0EVsrIC2WlayesgV0qeeLu9TPf8eqBPhiqA"
          />
          <span className="text-[20px] md:text-[24px] font-bold text-black tracking-tighter">
            ND Properties
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 items-center">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative font-semibold text-[18px] transition-all duration-300 py-1 ${
                  isActive 
                    ? 'text-black' 
                    : 'text-gray-500 hover:text-black'
                }`}
                id={`tab-button-${tab.id}`}
              >
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={onBookClick}
            className="bg-black text-white hover:bg-gray-800 transition-colors px-6 py-2.5 font-semibold text-[15px] rounded-lg relative overflow-hidden group active:scale-95"
            id="desktop-book-btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Today
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={onBookClick}
            className="p-2 border border-gray-200 rounded-lg text-black hover:bg-gray-100"
            id="mobile-calendar-btn"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 border border-gray-200 rounded-lg text-black hover:bg-gray-100"
            id="mobile-menu-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl py-6 px-6 space-y-4 shadow-lg"
          id="mobile-drawer-container"
        >
          <div className="flex flex-col space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`py-2 text-left font-semibold text-[18px] border-b border-gray-50 pb-2 ${
                  activeTab === tab.id ? 'text-black font-bold pl-2 border-l-2 border-black' : 'text-gray-500'
                }`}
                id={`mobile-tab-button-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onBookClick();
            }}
            className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-[16px]"
            id="mobile-drawer-book-btn"
          >
            <Calendar className="w-4 h-4" />
            Book Today
          </button>
        </motion.div>
      )}
    </header>
  );
}
