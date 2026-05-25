import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  FileText, 
  Home, 
  MessageSquare, 
  Check, 
  LogOut, 
  Eye, 
  X, 
  Video, 
  Calendar,
  Grid,
  Sparkles,
  Upload
} from 'lucide-react';
import { adminSignIn } from '../lib/googleAuth';
import { supabase } from '../lib/supabaseClient';
import { Property, Booking, Inquiry } from '../types';

interface AdminPanelProps {
  siteContent: any;
  properties: Property[];
  bookings: Booking[];
}

export default function AdminPanel({ siteContent, properties, bookings }: AdminPanelProps) {
  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Active dashboard tab
  const [adminTab, setAdminTab] = useState<'content' | 'listings' | 'bookings'>('content');

  // CMS copy states
  const [heroTitle, setHeroTitle] = useState(siteContent?.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(siteContent?.heroSubtitle || '');
  const [aboutTitle, setAboutTitle] = useState(siteContent?.aboutTitle || '');
  const [aboutText, setAboutText] = useState(siteContent?.aboutText || '');
  const [contactEmail, setContactEmail] = useState(siteContent?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(siteContent?.contactPhone || '');
  const [contactLoungeBE, setContactLoungeBE] = useState(siteContent?.contactLoungeBE || '');
  const [contactLoungeZH, setContactLoungeZH] = useState(siteContent?.contactLoungeZH || '');
  const [contactLoungeDK, setContactLoungeDK] = useState(siteContent?.contactLoungeDK || '');
  const [cmsSaved, setCmsSaved] = useState(false);

  // Listings CRUD states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Property Form states
  const [propTitle, setPropTitle] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propNumericPrice, setPropNumericPrice] = useState(0);
  const [propType, setPropType] = useState<'sale' | 'rent'>('sale');
  const [propBeds, setPropBeds] = useState(1);
  const [propBaths, setPropBaths] = useState(1);
  const [propSqft, setPropSqft] = useState(1000);
  const [propFeatured, setPropFeatured] = useState(false);
  const [propDescription, setPropDescription] = useState('');
  const [propImages, setPropImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [propHighlights, setPropHighlights] = useState<string[]>([]);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [propAmenities, setPropAmenities] = useState<string[]>([]);

  const defaultAmenitiesList = [
    { id: 'pool', label: 'Swimming Pool' },
    { id: 'fitness_center', label: 'Fitness Center' },
    { id: 'local_parking', label: 'Parking Garage' },
    { id: 'wifi', label: 'High-speed Wi-Fi' },
    { id: 'security', label: 'Smart Security Grid' },
    { id: 'spa', label: 'Cedar Spa/Sauna' },
    { id: 'concierge', label: 'Butler / Concierge' },
    { id: 'solar_power', label: 'Solar/Sustainable Power' }
  ];

  // Sync state with parent CMS changes
  useEffect(() => {
    if (siteContent) {
      setHeroTitle(siteContent.heroTitle || '');
      setHeroSubtitle(siteContent.heroSubtitle || '');
      setAboutTitle(siteContent.aboutTitle || '');
      setAboutText(siteContent.aboutText || '');
      setContactEmail(siteContent.contactEmail || '');
      setContactPhone(siteContent.contactPhone || '');
      setContactLoungeBE(siteContent.contactLoungeBE || '');
      setContactLoungeZH(siteContent.contactLoungeZH || '');
      setContactLoungeDK(siteContent.contactLoungeDK || '');
    }
  }, [siteContent]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setAuthLoading(true);

    try {
      const user = await adminSignIn(email, password);
      if (user) {
        if (user.email === 'dipanjanbaidya2007@gmail.com') {
          setIsAdmin(true);
        } else {
          throw new Error('Access denied: Unauthorized email address.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Invalid admin credentials. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAdmin(false);
    setEmail('');
    setPassword('');
  };

  // Update Global site copy
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaved(false);

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: 'global',
          heroTitle,
          heroSubtitle,
          aboutTitle,
          aboutText,
          contactEmail,
          contactPhone,
          contactLoungeBE,
          contactLoungeZH,
          contactLoungeDK
        });
      if (error) throw error;
      setCmsSaved(true);
      setTimeout(() => setCmsSaved(false), 3000);
    } catch (err: any) {
      alert(`Failed to save CMS settings: ${err.message}`);
    }
  };

  // Open property form for creating
  const handleCreatePropertyClick = () => {
    setSelectedProperty(null);
    setPropTitle('');
    setPropLocation('');
    setPropPrice('');
    setPropNumericPrice(0);
    setPropType('sale');
    setPropBeds(2);
    setPropBaths(2);
    setPropSqft(1500);
    setPropFeatured(false);
    setPropDescription('');
    setPropImages([]);
    setPropHighlights([]);
    setPropAmenities([]);
    setIsFormOpen(true);
  };

  // Open property form for editing
  const handleEditPropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setPropTitle(property.title);
    setPropLocation(property.location);
    setPropPrice(property.price);
    setPropNumericPrice(property.numericPrice);
    setPropType(property.type);
    setPropBeds(property.beds);
    setPropBaths(property.baths);
    setPropSqft(property.sqft);
    setPropFeatured(property.featured);
    setPropDescription(property.description);
    setPropImages((property as any).images || [property.image]);
    setPropHighlights(property.highlights || []);
    setPropAmenities(property.amenities || []);
    setIsFormOpen(true);
  };

  // Delete property
  const handleDeletePropertyClick = async (propertyId: string) => {
    if (!window.confirm('Are you absolutely sure you want to delete this listing?')) return;
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      if (error) throw error;
      alert('Listing deleted successfully.');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Add dynamic image url
  const handleAddImageUrl = () => {
    if (!newImageInput.trim()) return;
    setPropImages(prev => [...prev, newImageInput.trim()]);
    setNewImageInput('');
  };

  // Remove image from array
  const handleRemoveImage = (index: number) => {
    setPropImages(prev => prev.filter((_, idx) => idx !== index));
  };

  // File Upload to Base64 (Allows direct upload without complex Storage buckets configuration)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPropImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add highlight bullet
  const handleAddHighlight = () => {
    if (!newHighlightInput.trim()) return;
    setPropHighlights(prev => [...prev, newHighlightInput.trim()]);
    setNewHighlightInput('');
  };

  // Remove highlight bullet
  const handleRemoveHighlight = (index: number) => {
    setPropHighlights(prev => prev.filter((_, idx) => idx !== index));
  };

  // Toggle amenity
  const handleAmenityChange = (amenityId: string) => {
    setPropAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(a => a !== amenityId) 
        : [...prev, amenityId]
    );
  };

  // Save/Update Property listing
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propLocation || !propPrice || !propNumericPrice) {
      alert('Title, Location, Price and Numeric Price are required.');
      return;
    }
    if (propImages.length === 0) {
      alert('Please upload or specify at least one image.');
      return;
    }

    // Determine Rupee Bracket range automatically for listings
    let range: "15-30" | "30-60" | "60-150" = "15-30";
    const lakhsValue = propNumericPrice / 100000;
    if (lakhsValue >= 15 && lakhsValue <= 30) {
      range = "15-30";
    } else if (lakhsValue > 30 && lakhsValue <= 60) {
      range = "30-60";
    } else {
      range = "60-150";
    }

    const payload = {
      title: propTitle,
      location: propLocation,
      price: propPrice,
      numericPrice: propNumericPrice,
      type: propType,
      beds: Number(propBeds),
      baths: Number(propBaths),
      sqft: Number(propSqft),
      featured: propFeatured,
      image: propImages[0], // Main fallback image
      images: propImages,    // Array for dynamic carousels
      highlights: propHighlights,
      amenities: propAmenities,
      description: propDescription,
      range
    };

    try {
      if (selectedProperty) {
        // Edit Mode
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', selectedProperty.id);
        if (error) throw error;
        alert('Listing updated successfully.');
      } else {
        // Add Mode
        const customId = propTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const finalId = customId || `prop-${Date.now()}`;
        const { error } = await supabase
          .from('properties')
          .insert({
            ...payload,
            id: finalId,
            createdAt: new Date().getTime()
          });
        if (error) throw error;
        alert('Listing created successfully.');
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert(`Saving failed: ${err.message}`);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12 px-4" id="admin-login-view">
        <div className="bg-white border border-gray-150 rounded-2xl shadow-xl p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black">Admin Gateway</h2>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Exclusive Escrow & Content Management
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Admin Email
              </label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ndproperties.com"
                className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-semibold leading-relaxed">
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-3.5 rounded-lg font-bold tracking-wide shadow-md flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
            >
              {authLoading ? 'Signing In...' : 'Verify Signature'}
            </button>
          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8" id="admin-dashboard-view">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/40 border border-white/60 p-6 rounded-2xl shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black tracking-tight leading-none">Console Management</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Authorized Session Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 border border-gray-150 p-1 rounded-lg">
            <button 
              onClick={() => setAdminTab('content')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${adminTab === 'content' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
            >
              Edit Copy
            </button>
            <button 
              onClick={() => setAdminTab('listings')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${adminTab === 'listings' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
            >
              Listings CRUD
            </button>
            <button 
              onClick={() => setAdminTab('bookings')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${adminTab === 'bookings' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
            >
              Bookings ({bookings.length})
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Sign Out Console"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={adminTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* TAB 1: SITE COPY / CMS */}
          {adminTab === 'content' && (
            <div className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-2xl shadow-sm backdrop-blur-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight">Edit Site Copy</h2>
                <p className="text-[12px] text-gray-500">Edit core titles and text paragraphs across the entire website instantly.</p>
              </div>

              <form onSubmit={handleSaveCMS} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Hero Copy */}
                  <div className="space-y-4 bg-gray-50/40 p-5 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b border-gray-150 pb-2">Hero Section Copy</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hero Heading Title</label>
                        <textarea 
                          rows={2}
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Hero Subtitle Text</label>
                        <textarea 
                          rows={3}
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* About Copy */}
                  <div className="space-y-4 bg-gray-50/40 p-5 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b border-gray-150 pb-2">About Section Copy</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">About Header Title</label>
                        <textarea 
                          rows={2}
                          value={aboutTitle}
                          onChange={(e) => setAboutTitle(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Brand Mission Statement</label>
                        <textarea 
                          rows={3}
                          value={aboutText}
                          onChange={(e) => setAboutText(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-4 bg-gray-50/40 p-5 rounded-xl border border-gray-100 md:col-span-2">
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b border-gray-150 pb-2">Global Contact Gateways & Lounges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">General Inbox Email</label>
                        <input 
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Global Hotline Phone</label>
                        <input 
                          type="text"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Escrow Lounge 1 (West)</label>
                        <input 
                          type="text"
                          value={contactLoungeBE}
                          onChange={(e) => setContactLoungeBE(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Escrow Lounge 2 (Central)</label>
                        <input 
                          type="text"
                          value={contactLoungeZH}
                          onChange={(e) => setContactLoungeZH(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Escrow Lounge 3 (East)</label>
                        <input 
                          type="text"
                          value={contactLoungeDK}
                          onChange={(e) => setContactLoungeDK(e.target.value)}
                          className="w-full bg-white border border-gray-200 focus:border-black rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-150">
                  <button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800 transition-all font-bold px-8 py-3 rounded-lg text-xs flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Site Copy Changes</span>
                  </button>

                  <AnimatePresence>
                    {cmsSaved && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-emerald-600 font-bold flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Changes Saved to Database!</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: PROPERTIES LISTINGS CRUD */}
          {adminTab === 'listings' && (
            <div className="space-y-6">
              
              {/* Properties Grid Manager */}
              <div className="bg-white/40 border border-white/60 p-6 rounded-2xl shadow-sm backdrop-blur-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-black tracking-tight">Active Real Estate Catalog ({properties.length})</h2>
                    <p className="text-[12px] text-gray-500">Manage property cards, pricing metrics, descriptions, and dynamic image carousels.</p>
                  </div>
                  <button
                    onClick={handleCreatePropertyClick}
                    className="bg-black hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all self-start sm:self-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Property</span>
                  </button>
                </div>

                {/* Table of properties */}
                <div className="overflow-x-auto border border-gray-150 rounded-xl bg-white/80">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-150">
                        <th className="p-4">Property</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Rupee Cost</th>
                        <th className="p-4">Specifications</th>
                        <th className="p-4 text-center">Featured</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-[13px] text-gray-700">
                      {properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-bold flex items-center gap-3 min-w-[280px]">
                            <img src={prop.image} alt={prop.title} className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="text-black block truncate">{prop.title}</span>
                              <span className="text-[11px] text-gray-400 font-medium block truncate mt-0.5">{prop.location}</span>
                            </div>
                          </td>
                          <td className="p-4 uppercase text-[11px] font-extrabold text-gray-500">{prop.type}</td>
                          <td className="p-4 font-extrabold text-black">{prop.price}</td>
                          <td className="p-4 font-medium text-slate-500">
                            {prop.beds}B / {prop.baths}Ba · {prop.sqft} sqft
                          </td>
                          <td className="p-4 text-center">
                            {prop.featured ? (
                              <span className="inline-block w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm" title="Featured on home page curation" />
                            ) : (
                              <span className="text-gray-300 font-bold">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-1 min-w-[120px]">
                            <button
                              onClick={() => handleEditPropertyClick(prop)}
                              className="p-2 hover:bg-gray-100 hover:text-black text-gray-400 rounded-lg transition-colors inline-block"
                              title="Edit listing details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePropertyClick(prop.id)}
                              className="p-2 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-lg transition-colors inline-block"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Property Create/Edit Sliding Overlay Form */}
              {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
                  >
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 bg-gray-50/50">
                      <div className="flex items-center space-x-2">
                        <Home className="w-5 h-5 text-black" />
                        <h3 className="font-display font-extrabold text-base text-black">
                          {selectedProperty ? `Edit Details: ${selectedProperty.title}` : 'List New Premium Property'}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setIsFormOpen(false)}
                        className="text-gray-400 hover:text-black p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Scrollable Form Body */}
                    <form onSubmit={handlePropertySubmit} className="p-6 overflow-y-auto space-y-5 flex-grow">
                      
                      {/* Title & Location */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Property Listing Title *</label>
                          <input 
                            type="text" required value={propTitle} onChange={(e) => setPropTitle(e.target.value)}
                            placeholder="The Obsidian Villa"
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Locality & Location *</label>
                          <input 
                            type="text" required value={propLocation} onChange={(e) => setPropLocation(e.target.value)}
                            placeholder="Whitefield, Bangalore"
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* Prices & Range Type */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Price Display (Rupees) *</label>
                          <input 
                            type="text" required value={propPrice} onChange={(e) => setPropPrice(e.target.value)}
                            placeholder="₹45 Lakhs"
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Numeric Value (Rupees) *</label>
                          <input 
                            type="number" required value={propNumericPrice || ''} onChange={(e) => setPropNumericPrice(Number(e.target.value))}
                            placeholder="4500000"
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Acquisition Model *</label>
                          <select 
                            value={propType} onChange={(e) => setPropType(e.target.value as 'sale' | 'rent')}
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black outline-none cursor-pointer"
                          >
                            <option value="sale">Outright Sale</option>
                            <option value="rent">Luxury Rental Lease</option>
                          </select>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bedrooms</label>
                          <input 
                            type="number" value={propBeds} onChange={(e) => setPropBeds(Number(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Bathrooms</label>
                          <input 
                            type="number" step="0.5" value={propBaths} onChange={(e) => setPropBaths(Number(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Area Size (sqft)</label>
                          <input 
                            type="number" value={propSqft} onChange={(e) => setPropSqft(Number(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2.5 text-xs font-semibold text-black outline-none"
                          />
                        </div>
                        <div className="flex items-center pt-6 px-2">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" checked={propFeatured} onChange={(e) => setPropFeatured(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-black"></div>
                            <span className="ml-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Curation</span>
                          </label>
                        </div>
                      </div>

                      {/* Image Upload Manager (Carousels support) */}
                      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-black uppercase tracking-widest">Image Carousel Manager ({propImages.length})</h4>
                          
                          {/* File Uploader */}
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 cursor-pointer shadow-sm hover:bg-gray-50">
                            <Upload className="w-3.5 h-3.5 text-gray-400" />
                            <span>Upload Files</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        </div>

                        {/* List of uploaded/specified images */}
                        {propImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[140px] overflow-y-auto pr-1">
                            {propImages.map((img, idx) => (
                              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group bg-slate-100">
                                <img src={img} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button" onClick={() => handleRemoveImage(idx)}
                                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors opacity-90"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Text URL Input fallback */}
                        <div className="flex gap-2">
                          <input 
                            type="text" value={newImageInput} onChange={(e) => setNewImageInput(e.target.value)}
                            placeholder="Add direct photo URL string (e.g. Unsplash link)..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                          <button 
                            type="button" onClick={handleAddImageUrl}
                            className="bg-black text-white hover:bg-gray-800 px-4 rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
                        <h4 className="text-xs font-bold text-black uppercase tracking-widest">Bullet Highlights</h4>
                        
                        {propHighlights.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {propHighlights.map((hl, idx) => (
                              <span key={idx} className="bg-white border border-gray-200 text-black text-[10px] font-semibold pl-3 pr-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <span>{hl}</span>
                                <button type="button" onClick={() => handleRemoveHighlight(idx)} className="text-gray-400 hover:text-red-500 font-bold">×</button>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input 
                            type="text" value={newHighlightInput} onChange={(e) => setNewHighlightInput(e.target.value)}
                            placeholder="e.g. 100% Zero-Edge Infinity Pool"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 outline-none"
                          />
                          <button 
                            type="button" onClick={handleAddHighlight}
                            className="bg-black text-white hover:bg-gray-800 px-4 rounded-lg text-xs font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Amenities checkboxes */}
                      <div className="space-y-2.5">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Amenities Grid Selection</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-150">
                          {defaultAmenitiesList.map((amenity) => (
                            <label key={amenity.id} className="flex items-center space-x-2 text-xs text-gray-700 font-semibold cursor-pointer select-none">
                              <input 
                                type="checkbox" checked={propAmenities.includes(amenity.id)}
                                onChange={() => handleAmenityChange(amenity.id)}
                                className="rounded text-black focus:ring-0 w-3.5 h-3.5"
                              />
                              <span>{amenity.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Property Narrative Description</label>
                        <textarea
                          rows={4} required value={propDescription} onChange={(e) => setPropDescription(e.target.value)}
                          placeholder="Provide a comprehensive narrative about this premium property listing..."
                          className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-3 py-2 text-xs font-semibold text-black placeholder-gray-300 outline-none resize-none"
                        />
                      </div>

                      {/* Footer Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-150">
                        <button
                          type="submit"
                          className="flex-1 bg-black text-white hover:bg-gray-800 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Save className="w-4 h-4" />
                          <span>{selectedProperty ? 'Apply Curation Updates' : 'Publish Listing'}</span>
                        </button>
                        <button
                          type="button" onClick={() => setIsFormOpen(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-xl text-xs border border-gray-200"
                        >
                          Cancel
                        </button>
                      </div>

                    </form>

                  </motion.div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: BOOKINGS & SHOWINGS LIST */}
          {adminTab === 'bookings' && (
            <div className="bg-white/40 border border-white/60 p-6 md:p-8 rounded-2xl shadow-sm backdrop-blur-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-500" />
                  <span>Scheduled Private Showings & Consultations ({bookings.length})</span>
                </h2>
                <p className="text-[12px] text-gray-500">Review scheduled virtual showings containing live Google Meet spaces generated by users.</p>
              </div>

              {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Client details</span>
                            <span className="font-bold text-[14px] text-black block mt-1">{booking.fullName}</span>
                            <span className="text-[11px] font-medium text-gray-500 block">{booking.email} · {booking.phone}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Tour Slot</span>
                            <span className="text-[13px] font-bold text-black block mt-1">{booking.preferredDate}</span>
                            <span className="text-[11px] font-bold text-gray-500 block">{booking.preferredTime}</span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Details & Special Requests</span>
                            <p className="text-[12px] text-gray-600 font-medium italic leading-relaxed">
                              "{booking.notes}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Google Meet details */}
                      {booking.isMeetRequested && booking.meetLink ? (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Video className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="text-[11px] font-mono text-gray-600 truncate">{booking.meetLink}</span>
                          </div>
                          <a 
                            href={booking.meetLink} target="_blank" rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors whitespace-nowrap"
                          >
                            Launch Meet
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-[11px] font-semibold text-gray-500">In-Person Site Visit requested (concierge to call client)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                  <Calendar className="w-10 h-10 mx-auto text-gray-300 opacity-60 mb-2" />
                  <p className="text-sm font-semibold">No bookings scheduled yet</p>
                  <p className="text-[11px] text-gray-400 max-w-xs mx-auto mt-1">Walkthrough calendar appointments scheduled by users will persist here in real-time.</p>
                </div>
              )}

            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
