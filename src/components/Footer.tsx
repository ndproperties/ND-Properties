import React from 'react';
import { Globe, Share2, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: 'home' | 'listings' | 'about' | 'contact') => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 md:px-20 relative overflow-hidden bg-transparent border-t border-gray-200/50 mt-12 bg-white/20 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl mx-auto gap-12 relative z-10">
        
        {/* Left Column: Brand & Copy */}
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div 
            onClick={() => onTabChange('home')}
            className="font-bold text-[22px] md:text-[24px] text-black tracking-tighter cursor-pointer hover:opacity-85 transition-opacity inline-block mx-auto md:mx-0"
            id="footer-brand"
          >
            ND Properties
          </div>
          <p className="text-[12px] uppercase tracking-[0.1em] font-semibold text-gray-500">
            © {currentYear} ND Properties. Architectural Excellence.
          </p>
        </div>

        {/* Center: Quick Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10">
          <a href="#" className="text-gray-500 hover:text-black font-semibold text-[13px] uppercase tracking-wider hover:underline transition-all">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-black font-semibold text-[13px] uppercase tracking-wider hover:underline transition-all">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 hover:text-black font-semibold text-[13px] uppercase tracking-wider hover:underline transition-all">
            Sustainability
          </a>
          <a href="#" className="text-gray-500 hover:text-black font-semibold text-[13px] uppercase tracking-wider hover:underline transition-all">
            Press
          </a>
        </nav>

        {/* Right: Social Icons */}
        <div className="flex gap-4">
          <button 
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-full transition-all duration-300 group"
            title="Our website"
            id="footer-icon-globe"
          >
            <Globe className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-full transition-all duration-300 group"
            title="Share"
            id="footer-icon-share"
          >
            <Share2 className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-full transition-all duration-300 group"
            title="Facebook"
            id="footer-icon-facebook"
          >
            <Facebook className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center border border-gray-200 hover:bg-black hover:text-white hover:border-black rounded-full transition-all duration-300 group"
            title="Instagram"
            id="footer-icon-instagram"
          >
            <Instagram className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
}
