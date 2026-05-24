import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Search, ArrowRight, Building, IndianRupee, Sparkles } from 'lucide-react';
import { Property } from '../types';

interface HomeViewProps {
  onNavigateToListings: (filters?: { location?: string; type?: string; priceRange?: string }) => void;
  onSelectProperty: (property: Property) => void;
  properties: Property[];
  siteContent?: any;
}

export default function HomeView({ onNavigateToListings, onSelectProperty, properties, siteContent }: HomeViewProps) {
  const [searchLocation, setSearchLocation] = React.useState('');
  const [searchType, setSearchType] = React.useState('');
  const [searchPrice, setSearchPrice] = React.useState('');

  // Extract featured properties for the horizontal curation cards on Home page
  // We specific show: Refraction House (id: refraction-house), Aether Penthouse (id: aether-penthouse), Liquid Horizon (id: liquid-horizon)
  const homeCatalog = properties.filter(p => 
    p.id === 'refraction-house' || p.id === 'aether-penthouse' || p.id === 'liquid-horizon'
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToListings({
      location: searchLocation,
      type: searchType !== 'Property Type' ? searchType : undefined,
      priceRange: searchPrice
    });
  };

  return (
    <div id="home-view-container" className="space-y-32">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center pt-24 pb-12">
        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[40px] md:text-[64px] font-bold tracking-tighter leading-tight font-display-lg"
            id="hero-header"
            dangerouslySetInnerHTML={{ __html: siteContent?.heroTitle ? siteContent.heroTitle.replace(/\n/g, '<br />') : 'Get to own your own home and <br /><span class="italic text-gray-400 font-normal">Make your dream come true</span>' }}
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-500 font-medium text-[16px] md:text-[18px] max-w-2xl leading-relaxed"
            id="hero-paragraph"
          >
            {siteContent?.heroSubtitle || "Exclusive architectural masterpieces, thoughtfully curated for Bengalis who appreciate minimalist elegance and visionary living."}
          </motion.p>

          {/* Floating Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 pt-2"
            id="hero-badges"
          >
            <div className="flex items-center gap-2 bg-white/40 border border-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm hover:bg-white/60 transition-colors cursor-default">
              <Phone className="w-4 h-4 text-black" />
              <span className="font-bold text-black text-[14px]">{siteContent?.contactPhone || "+880 1234 567890"}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/40 border border-white/60 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm hover:bg-white/60 transition-colors cursor-default">
              <Mail className="w-4 h-4 text-black" />
              <span className="font-bold text-black text-[14px]">{siteContent?.contactEmail || "hello@ndproperties.com"}</span>
            </div>
          </motion.div>
        </div>

        {/* Search Bar Block */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-4xl mx-auto mt-16 px-4"
          id="hero-search-wrapper"
        >
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white/50 backdrop-blur-2xl border border-white/60 p-3 rounded-2xl flex flex-col md:flex-row gap-3 shadow-xl"
            id="search-form"
          >
            {/* Location Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Desired Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full placeholder:text-gray-400 font-semibold text-black outline-none text-[14px]"
              />
            </div>

            {/* Property Type Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <Building className="w-5 h-5 text-gray-400 shrink-0" />
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-gray-700 font-semibold outline-none text-[14px] appearance-none cursor-pointer"
              >
                <option value="">Property Type</option>
                <option value="Glass Villa">Glass Villa</option>
                <option value="Penthouse">Minimalist Penthouse</option>
                <option value="Loft">Atmospheric Loft</option>
                <option value="Estate">Luxury Estate</option>
              </select>
            </div>

            {/* Price Range Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <IndianRupee className="w-5 h-5 text-gray-400 shrink-0" />
              <select 
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-gray-700 font-semibold outline-none text-[14px] appearance-none cursor-pointer"
              >
                <option value="">Price Range</option>
                <option value="15-30">15 - 30 lakhs</option>
                <option value="30-60">30 - 60 lakhs</option>
                <option value="60-1.5">60 lakhs - 1.5 cr</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button 
              type="submit"
              className="bg-black text-white hover:bg-gray-800 transition-colors px-8 py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 outline-none group active:scale-[0.98]"
              id="search-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </motion.div>
      </section>

      {/* 2. Featured Properties Section ("THE CURATION") */}
      <section className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[12px] font-bold tracking-[0.2em] text-black uppercase block mb-2">THE CURATION</span>
            <h2 className="text-3xl font-bold tracking-tight text-black" id="curation-title">Curated for Bengalis</h2>
          </div>
          <button 
            onClick={() => onNavigateToListings()}
            className="text-black font-semibold border-b-2 border-black hover:opacity-75 transition-all py-0.5 text-[15px] flex items-center gap-1.5"
            id="view-portfolio-btn"
          >
            <span>View Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3-Column Bento/Grid Portfolio of Home catalogs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {homeCatalog.map((property, idx) => {
            // Apply slight offset up on the middle card for vertical visual interest, matching layout mockup
            const offsetStyle = idx === 1 ? 'md:mt-12' : '';
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => onSelectProperty(property)}
                className={`group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md cursor-pointer border border-white/60 bg-white/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 ${offsetStyle}`}
                id={`catalog-grid-card-${property.id}`}
              >
                {/* Image */}
                <img 
                  alt={property.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src={property.image}
                />
                
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                {/* Glass detail block slide up on hover */}
                <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl border border-white/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-white/50 mb-1">
                      {property.location.split(',')[1]?.trim() || property.location}
                    </span>
                    <h4 className="font-bold text-white text-[18px] tracking-tight truncate">{property.title}</h4>
                    
                    <div className="flex justify-between items-center border-t border-white/15 pt-3 mt-3">
                      <span className="text-white font-bold text-[14px]">{property.price}</span>
                      <div className="text-white p-1 bg-white/10 group-hover:bg-white text-[12px] group-hover:text-black rounded-lg transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. Aesthetic Philosophy Section */}
      <section className="bg-white/30 border-y border-gray-100 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Philosophy Text & Metrics */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Philosophical Standard
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight leading-tight" id="philosophy-header">
                Property as Art, <br />
                Space for Your Future.
              </h2>
            </div>

            <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed" id="philosophy-description">
              We believe everyone deserves to own their own home. Our philosophy transcends traditional real estate, creating environments where light and material converge. Every listing is selected with rigorous curation to ensure we make your dream come true.
            </p>

            {/* Metrics column group */}
            <div className="flex gap-12 border-t border-gray-200/55 pt-8">
              <div>
                <span className="block font-bold text-4xl text-black leading-none tracking-tighter">140+</span>
                <span className="font-bold text-[11px] text-gray-400 uppercase tracking-widest block mt-2">Global Assets</span>
              </div>
              <div>
                <span className="block font-bold text-4xl text-black leading-none tracking-tighter">$2B+</span>
                <span className="font-bold text-[11px] text-gray-400 uppercase tracking-widest block mt-2">Portfolio Value</span>
              </div>
            </div>
          </div>

          {/* Luxury Art Image representation */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl" id="philosophy-image-container">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              alt="Modern architectural glass projection" 
              className="w-full h-auto object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpdUw7Oo3Tmog3P828TO-cQEYOMfCB5reB4idPJEO1EUkErt6bVu4xLMzQ63C-sjtWfHWzbL6asDH8kBDT-4qtzaVz9-EpCZE6Y6yukJA_DGHTYpS-oIYabHIXZwxnH5XSDY9HeaCRG14kzleMX6h_MH_IuX76bbPsQDl5QuTh43g4pc8p3d9b3AxTvHU-5XX4-TxIoRIN9NhRHS4jbZnsVT5TDxS0oKneDp__skr4zmtG6H5C0un7qzClUCmGFstwOJc3GPWEnmI"
            />
          </div>

        </div>
      </section>

    </div>
  );
}
