import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Search, ArrowRight, Building, IndianRupee, Sparkles, FileText, Car, Eye, Check } from 'lucide-react';
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

  // Extract featured properties for the horizontal curation cards on Home page dynamically
  // If fewer than 3 are marked as featured, fallback to the first available properties
  const featuredProps = properties.filter(p => p.featured);
  const homeCatalog = featuredProps.length >= 3 
    ? featuredProps.slice(0, 3) 
    : [...featuredProps, ...properties.filter(p => !p.featured)].slice(0, 3);

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
      
      {/* 1. Hero Section with City Skyline Background */}
      <section className="relative min-h-[85vh] w-full flex flex-col justify-center pt-32 pb-16 overflow-hidden border-none bg-cover bg-top" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80')" }}>
        
        {/* Dark/blue overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black/40 to-black/60 z-0" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 w-full">
          
          {/* Liquid Glass Wrapper for Hero content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl w-full space-y-6 text-white"
            id="hero-liquid-glass"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[34px] md:text-[54px] font-extrabold tracking-tighter leading-tight font-display-lg drop-shadow-md text-white"
              id="hero-header"
              dangerouslySetInnerHTML={{ __html: siteContent?.heroTitle ? siteContent.heroTitle.replace(/\n/g, '<br />') : 'Get to own your own home and <br /><span class="italic text-gray-200 font-normal">Make your dream come true</span>' }}
            />

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-100 font-semibold text-[15px] md:text-[17px] max-w-2xl mx-auto leading-relaxed drop-shadow-md"
              id="hero-paragraph"
            >
              {siteContent?.heroSubtitle || "Exclusive architectural masterpieces, thoughtfully curated for Bengalis who appreciate minimalist elegance and visionary living."}
            </motion.p>

            {/* Floating Badges inside Liquid Glass */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-2"
              id="hero-badges"
            >
              <a 
                href={`tel:${siteContent?.contactPhone || "9748158051"}`}
                className="flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm hover:bg-white/40 transition-colors cursor-pointer text-white"
              >
                <Phone className="w-4 h-4 text-white" />
                <span className="font-bold text-[14px]">{siteContent?.contactPhone || "9748158051"}</span>
              </a>
              <a 
                href={`mailto:${siteContent?.contactEmail || "ndproperties.buisness@gmail.com"}`}
                className="flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur-md px-5 py-2.5 rounded-full shadow-sm hover:bg-white/40 transition-colors cursor-pointer text-white"
              >
                <Mail className="w-4 h-4 text-white" />
                <span className="font-bold text-[14px]">{siteContent?.contactEmail || "ndproperties.buisness@gmail.com"}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Search Bar Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-4xl mx-auto mt-12 px-4 relative z-10"
          id="hero-search-wrapper"
        >
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex flex-col md:flex-row gap-3 shadow-2xl text-white"
            id="search-form"
          >
            {/* Location Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-white/10">
              <MapPin className="w-5 h-5 text-white/50 shrink-0" />
              <input 
                type="text" 
                placeholder="Desired Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full placeholder:text-white/40 font-semibold text-white outline-none text-[14px]"
              />
            </div>

            {/* Property Type Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-white/10">
              <Building className="w-5 h-5 text-white/50 shrink-0" />
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-white font-semibold outline-none text-[14px] appearance-none cursor-pointer"
              >
                <option value="" className="text-black">Property Type</option>
                <option value="Glass Villa" className="text-black">Glass Villa</option>
                <option value="Penthouse" className="text-black">Minimalist Penthouse</option>
                <option value="Loft" className="text-black">Atmospheric Loft</option>
                <option value="Estate" className="text-black">Luxury Estate</option>
              </select>
            </div>

            {/* Price Range Field */}
            <div className="flex-1 flex items-center px-4 py-3 gap-3">
              <IndianRupee className="w-5 h-5 text-white/50 shrink-0" />
              <select 
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="bg-transparent border-none focus:ring-0 w-full text-white font-semibold outline-none text-[14px] appearance-none cursor-pointer"
              >
                <option value="" className="text-black">Price Range</option>
                <option value="15-30" className="text-black">15 - 30 lakhs</option>
                <option value="30-60" className="text-black">30 - 60 lakhs</option>
                <option value="60-1.5" className="text-black">60 lakhs - 1.5 cr</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <button 
              type="submit"
              className="bg-white text-black hover:bg-gray-100 transition-colors px-8 py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 outline-none group active:scale-[0.98]"
              id="search-submit-btn"
            >
              <Search className="w-4 h-4 text-black" />
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
            <span>View Listings</span>
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
                Owning a home is a <br />
                dream for everyone.
              </h2>
            </div>

            <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed" id="philosophy-description">
              We believe that a good home is for everyone and everyone should own it. While representing the gold standard of real estate advisory for our premium investors, we are equally committed to helping everyday families realize the joy of stepping into their own front door.
            </p>

            {/* Metrics column group */}
            <div className="flex gap-12 border-t border-gray-200/55 pt-8">
              <div>
                <span className="block font-bold text-4xl text-black leading-none tracking-tighter">320+</span>
                <span className="font-bold text-[11px] text-gray-400 uppercase tracking-widest block mt-2">Properties Sold</span>
              </div>
              <div>
                <span className="block font-bold text-4xl text-black leading-none tracking-tighter">98%</span>
                <span className="font-bold text-[11px] text-gray-400 uppercase tracking-widest block mt-2">Client Satisfaction</span>
              </div>
            </div>
          </div>

          {/* New Apartment Image representation */}
          <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-gray-150 bg-white" id="philosophy-image-container">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img 
              alt="Premium modern apartment building structure" 
              className="w-full h-[400px] object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
            />
          </div>

        </div>
      </section>

      {/* 4. Flowchart / Owning Process Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 py-24 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase block">OUR PROCESS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">How We list & Verify Properties</h2>
          <p className="text-gray-500 font-medium text-[14px]">A rigorous, transparent process to ensure every property we list is secure, high-quality, and structurally sound.</p>
        </div>

        {/* 5-Step Flowchart Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {/* Connector Line on Desktop */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-0" />

          {[
            {
              step: "01",
              title: "Paper Verification",
              desc: "Thorough verification of all ownership papers, deed title clearances, and building plan approvals.",
              icon: FileText
            },
            {
              step: "02",
              title: "Locality & Distance",
              desc: "Assessing proximity to essential amenities like hospitals, schools, colleges, and grocery stores.",
              icon: MapPin
            },
            {
              step: "03",
              title: "Utility & Parking Check",
              desc: "Ensuring proper parking spacing, electricity backup, water supply, and building structure stability.",
              icon: Car
            },
            {
              step: "04",
              title: "On-Site Verification",
              desc: "In-person physical inspection of construction quality, layout, ventilation, and surroundings.",
              icon: Eye
            },
            {
              step: "05",
              title: "Official Listing",
              desc: "Approved properties are photographed, cataloged, and uploaded to our official website.",
              icon: Check
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative z-10 space-y-4 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">STEP {item.step}</span>
                  <h4 className="font-bold text-black text-sm tracking-tight">{item.title}</h4>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed flex-grow">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
