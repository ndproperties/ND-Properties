import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, MapPin, BedDouble, Bath, ArrowRight, CheckCircle2, Waves, Dumbbell, Car, Shield, Send, IndianRupee } from 'lucide-react';
import { Property } from '../types';

interface ListingsViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  passedFilters?: { location?: string; type?: string; priceRange?: string };
}

export default function ListingsView({ properties, onSelectProperty, passedFilters }: ListingsViewProps) {
  // Filters State
  const [selectedType, setSelectedType] = React.useState<'all' | 'sale' | 'rent'>('all');
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<'all' | '15-30' | '30-60' | '60-1.5'>('all');
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = React.useState(false);

  // If search carried over from home search bar
  React.useEffect(() => {
    if (passedFilters) {
      if (passedFilters.type === 'Glass Villa' || passedFilters.type === 'Loft') {
        setSelectedType('rent'); // Mock mapping
      } else if (passedFilters.type === 'Penthouse' || passedFilters.type === 'Estate') {
        setSelectedType('sale');
      }

      if (passedFilters.priceRange) {
        if (passedFilters.priceRange === '15-30' || passedFilters.priceRange === '30-60' || passedFilters.priceRange === '60-1.5') {
          setSelectedPriceRange(passedFilters.priceRange as any);
        } else {
          // Fallback parsing of arbitrary input if necessary
          const clean = passedFilters.priceRange.toLowerCase();
          if (clean.includes('15') || clean.includes('30') && !clean.includes('60')) {
            setSelectedPriceRange('15-30');
          } else if (clean.includes('30') || clean.includes('60') && !clean.includes('1.5')) {
            setSelectedPriceRange('30-60');
          } else if (clean.includes('60') || clean.includes('1.5') || clean.includes('cr')) {
            setSelectedPriceRange('60-1.5');
          }
        }
      }
    }
  }, [passedFilters]);

  // Handle newsletter Form
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2500);
  };

  // Filter listings based on State
  const filteredProperties = properties.filter(p => {
    // Type Filter
    if (selectedType !== 'all' && p.type !== selectedType) return false;
    
    // Price Range Filter
    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === '15-30') {
        if (p.numericPrice < 1500000 || p.numericPrice > 3000000) return false;
      } else if (selectedPriceRange === '30-60') {
        if (p.numericPrice < 3000000 || p.numericPrice > 6000000) return false;
      } else if (selectedPriceRange === '60-1.5') {
        if (p.numericPrice < 6000000 || p.numericPrice > 15000000) return false;
      }
    }

    // If there is search from home bar
    if (passedFilters?.location) {
      const locQuery = passedFilters.location.toLowerCase();
      const matchLoc = p.location.toLowerCase().includes(locQuery) || p.title.toLowerCase().includes(locQuery);
      if (!matchLoc) return false;
    }

    return true;
  });

  return (
    <div id="listings-view-container" className="space-y-20">
      
      {/* 1. Header Hero section with Property Background and Liquid Glass block */}
      <section className="relative min-h-[50vh] w-full flex flex-col justify-center pt-32 pb-16 overflow-hidden border-none bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')" }}>
        
        {/* Dark/blue overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black/45 to-black/65 z-0" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6 w-full">
          {/* Liquid Glass Wrapper */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl w-full space-y-4 text-white">
            <span className="text-[11px] font-bold tracking-[0.2em] text-gray-200 uppercase block">
              Curated for Bengalis
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white" id="listings-hero-title">
              Get to own your own home
            </h1>
            <p className="text-gray-150 font-semibold text-[15px] md:text-[17px] max-w-2xl mx-auto leading-relaxed" id="listings-hero-subtitle">
              Make your dream come true with our selection of architectural masterpieces designed for the visionary. Our portfolio features exclusive properties that redefine living.
            </p>
          </div>
        </div>
      </section>

      {/* Constraints container for filters and grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 space-y-16">
        
        {/* Dynamic Filters Row */}
        <div className="flex flex-wrap gap-4" id="listings-filters-row">
          {/* reset / all filter */}
          <button 
            onClick={() => {
              setSelectedType('all');
              setSelectedPriceRange('all');
            }}
            className={`px-6 py-3 rounded-xl font-bold text-[14px] flex items-center gap-2 border shadow-sm transition-all ${
              selectedType === 'all' && selectedPriceRange === 'all'
                ? 'bg-black text-white border-black' 
                : 'bg-white/40 border-gray-200/60 hover:bg-white text-gray-800'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>All Listings</span>
          </button>

          {/* for sale filter */}
          <button 
            onClick={() => setSelectedType('sale')}
            className={`px-6 py-3 rounded-xl font-bold text-[14px] border shadow-sm transition-all ${
              selectedType === 'sale' 
                ? 'bg-black text-white border-black' 
                : 'bg-white/40 border-gray-200/60 hover:bg-white text-gray-800'
            }`}
          >
            For Sale
          </button>

          {/* for rent filter */}
          <button 
            onClick={() => setSelectedType('rent')}
            className={`px-6 py-3 rounded-xl font-bold text-[14px] border shadow-sm transition-all ${
              selectedType === 'rent' 
                ? 'bg-black text-white border-black' 
                : 'bg-white/40 border-gray-200/60 hover:bg-white text-gray-800'
            }`}
          >
            For Lease
          </button>

          {/* price threshold shortcuts */}
          <div className="flex gap-2 border-l border-gray-200 pl-4 items-center flex-wrap">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mr-1">Price Range:</span>
            <button 
              onClick={() => setSelectedPriceRange('15-30')}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all border ${
                selectedPriceRange === '15-30' 
                  ? 'bg-black border-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-transparent'
              }`}
            >
              15 - 30 lakhs
            </button>
            <button 
              onClick={() => setSelectedPriceRange('30-60')}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all border ${
                selectedPriceRange === '30-60' 
                  ? 'bg-black border-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-transparent'
              }`}
            >
              30 - 60 lakhs
            </button>
            <button 
              onClick={() => setSelectedPriceRange('60-1.5')}
              className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all border ${
                selectedPriceRange === '60-1.5' 
                  ? 'bg-black border-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-transparent'
              }`}
            >
              60 lakhs - 1.5 cr
            </button>
            {selectedPriceRange !== 'all' && (
              <button 
                onClick={() => setSelectedPriceRange('all')}
                className="text-[12px] text-red-500 font-extrabold hover:underline pl-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      {/* 2. Structured Bento Grid of Properties */}
      <section className="space-y-6" id="bento-grid-root">
        {filteredProperties.length === 0 ? (
          <div className="py-24 text-center bg-white/40 rounded-2xl border border-gray-200/65">
            <p className="text-gray-400 font-bold text-lg">No premium assets fit the set criteria.</p>
            <button 
              onClick={() => {
                setSelectedType('all');
                setSelectedPriceRange('all');
              }}
              className="text-black font-extrabold underline text-sm mt-2 hover:opacity-80"
            >
              Reset exploration filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* LARGE FEATURED CARD (First Property) */}
            {filteredProperties.length > 0 && (() => {
              const bannerProp = filteredProperties[0];
              return (
                <div 
                  onClick={() => onSelectProperty(bannerProp)}
                  className="md:col-span-8 group relative overflow-hidden rounded-2xl h-[600px] border border-white/60 bg-white/40 shadow-sm cursor-pointer transition-all duration-500"
                  id={`listings-featured-pavilion-card-${bannerProp.id}`}
                >
                  <img 
                    alt={bannerProp.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={bannerProp.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
                  
                  {/* Information panel */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/20 backdrop-blur-md p-8 rounded-xl border border-white/30 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                      <div>
                        <span className="inline-block bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
                          {bannerProp.type === 'sale' ? 'Featured Sale' : 'Featured Lease'}
                        </span>
                        <h3 className="text-3xl font-bold tracking-tight">{bannerProp.title}</h3>
                        <p className="text-[13px] text-gray-200/80 mt-1.5 flex items-center gap-1.5 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-white/70" />
                          {bannerProp.location}
                        </p>
                      </div>
                      <div className="md:text-right">
                        <p className="text-2xl font-bold text-white">{bannerProp.price}</p>
                        <p className="text-[11px] font-bold tracking-widest text-[#cfc4c5] mt-1">{bannerProp.beds} BEDS / {bannerProp.baths} BATHS</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SIDE CARD 1: Second Property */}
            {filteredProperties.length > 1 && (() => {
              const sideProp = filteredProperties[1];
              return (
                <div 
                  onClick={() => onSelectProperty(sideProp)}
                  className="md:col-span-4 group relative overflow-hidden rounded-2xl h-[600px] border border-white/60 bg-white/40 shadow-sm cursor-pointer transition-all duration-500"
                  id={`listings-side-card-${sideProp.id}`}
                >
                  <img 
                    alt={sideProp.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={sideProp.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90" />
                  
                  {/* Floating bottom box */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 text-white">
                    <span className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
                      {sideProp.type === 'sale' ? 'For Sale' : 'For Lease'}
                    </span>
                    <h3 className="text-xl font-bold tracking-tight">{sideProp.title}</h3>
                    <p className="text-[14px] text-gray-100 font-bold mt-1">{sideProp.price}</p>
                    
                    {/* Amenity Status Icons */}
                    <div className="mt-4 pt-4 border-t border-white/25 flex justify-between text-white/75">
                      <span className="flex items-center gap-1.5 font-bold text-[12px]">
                        <Waves className="w-3.5 h-3.5" /> Pool
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-[12px]">
                        <Dumbbell className="w-3.5 h-3.5" /> Gym
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-[12px]">
                        <Car className="w-3.5 h-3.5" /> Parking
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* LOWER PORTFOLIO GRID: remaining elements */}
            {filteredProperties.length > 2 && (
              <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredProperties.slice(2).map(p => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProperty(p)}
                    className="group relative h-[400px] overflow-hidden rounded-2xl border border-white/60 bg-white/40 shadow-sm cursor-pointer transition-all duration-500 hover:-translate-y-2"
                    id={`listings-curated-card-${p.id}`}
                  >
                    <img 
                      alt={p.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      src={p.image} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-90" />
                    
                    {/* Detailed plate */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/20 backdrop-blur-md p-5 rounded-xl border border-white/30 text-white">
                      <h3 className="font-bold text-lg tracking-tight mb-1">{p.title}</h3>
                      <div className="flex justify-between items-center text-[13px] text-gray-200 font-bold">
                        <span>{p.location}</span>
                        <span className="text-[#b9c7e0] font-extrabold">{p.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </section>

      {/* 3. Newsletter Subscription Panel */}
      <section className="bg-white/50 border border-white/60 backdrop-blur-xl p-10 md:p-16 rounded-2xl text-center space-y-8 relative overflow-hidden" id="newsletter-panel">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-black" id="newsletter-title">
            Stay Ahead of the Market
          </h2>
          <p className="text-gray-500 font-semibold text-[15px] leading-relaxed">
            Receive off-market opportunities and architectural insights directly to your inbox. Exclusive access for our inner circle.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {newsletterSubscribed ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto flex flex-col items-center gap-3 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100"
              id="newsletter-success"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="font-bold text-[14px]">Welcome to the Inner Circle</p>
              <p className="text-[12px] text-gray-500 leading-tight">Your request has been filed. Off-market catalogs will be dispatched shortly.</p>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2"
              id="newsletter-form"
            >
              <input 
                type="email" 
                required
                placeholder="Your Email Address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-grow bg-transparent border-b-2 border-black/80 px-2 py-3 focus:outline-none focus:border-black font-semibold text-[15px] text-black placeholder-gray-400 outline-none"
              />
              <button 
                type="submit"
                className="bg-black hover:bg-gray-800 text-white rounded-xl font-bold px-8 py-3 w-full sm:w-auto shrink-0 transition-colors shadow-md flex items-center justify-center gap-2 text-[14px] uppercase tracking-wider"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>

      </div>
    </div>
  );
}
