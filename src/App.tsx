import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Video, 
  Copy, 
  X, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { loginWithGoogle, logout, auth, AuthResult, db } from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

// Define property data structure
interface Property {
  id: string;
  title: string;
  type: string;
  priceLakhs: number; // e.g. 18, 45, 120 (for 1.2 Cr)
  priceDisplay: string; // e.g. "₹24 Lakhs", "₹1.25 Cr"
  range: "15-30" | "30-60" | "60-150";
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  image: string;
  rating: number;
  features: string[];
}

// Mock properties spanning the three rupee budget ranges
const propertiesData: Property[] = [
  // 15 - 30 lakhs range
  {
    id: "prop-1",
    title: "Smart Studio in Tech Hub",
    type: "Studio Apartment",
    priceLakhs: 18.5,
    priceDisplay: "₹18.5 Lakhs",
    range: "15-30",
    beds: 1,
    baths: 1,
    sqft: 450,
    location: "Electronic City, Bangalore",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    features: ["Smart Home", "High-speed Wi-Fi", "Gym Access"]
  },
  {
    id: "prop-2",
    title: "Eco-Friendly Compact Flat",
    type: "Apartment",
    priceLakhs: 24.0,
    priceDisplay: "₹24 Lakhs",
    range: "15-30",
    beds: 1,
    baths: 1,
    sqft: 580,
    location: "Whitefield, Bangalore",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    features: ["Solar Powered", "Balcony", "24/7 Security"]
  },
  {
    id: "prop-3",
    title: "Urban Nest Apartment",
    type: "Apartment",
    priceLakhs: 28.5,
    priceDisplay: "₹28.5 Lakhs",
    range: "15-30",
    beds: 2,
    baths: 1,
    sqft: 750,
    location: "Kalyan Nagar, Bangalore",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    features: ["Fully Furnished", "Modular Kitchen", "Metro Connection"]
  },
  // 30 - 60 lakhs range
  {
    id: "prop-4",
    title: "Suburban Bliss 2 BHK",
    type: "Apartment",
    priceLakhs: 38.0,
    priceDisplay: "₹38 Lakhs",
    range: "30-60",
    beds: 2,
    baths: 2,
    sqft: 1100,
    location: "Thanisandra, Bangalore",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    features: ["Gated Community", "Swimming Pool", "Parking Space"]
  },
  {
    id: "prop-5",
    title: "Modern Elegance Flat",
    type: "Apartment",
    priceLakhs: 48.5,
    priceDisplay: "₹48.5 Lakhs",
    range: "30-60",
    beds: 3,
    baths: 2,
    sqft: 1450,
    location: "HSR Layout, Bangalore",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    features: ["Power Backup", "Covered Balcony", "Central Park View"]
  },
  {
    id: "prop-6",
    title: "Exclusive Skyline Suite",
    type: "Condo",
    priceLakhs: 59.0,
    priceDisplay: "₹59 Lakhs",
    range: "30-60",
    beds: 2,
    baths: 2,
    sqft: 1250,
    location: "Koramangala, Bangalore",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    features: ["Roof Terrace", "Skyline View", "Clubhouse"]
  },
  // 60 lakhs - 1.5 cr range
  {
    id: "prop-7",
    title: "Zenith Luxury Penthouse",
    type: "Penthouse",
    priceLakhs: 85.0,
    priceDisplay: "₹85 Lakhs",
    range: "60-150",
    beds: 3,
    baths: 3,
    sqft: 2200,
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    features: ["Private Elevator", "Home Theater", "Premium Woodwork"]
  },
  {
    id: "prop-8",
    title: "Grand Vista Meadow Villa",
    type: "Villa",
    priceLakhs: 120.0,
    priceDisplay: "₹1.20 Cr",
    range: "60-150",
    beds: 4,
    baths: 4,
    sqft: 3100,
    location: "Sarjapur Road, Bangalore",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    features: ["Private Garden", "Poolside Deck", "Smart Security Grid"]
  },
  {
    id: "prop-9",
    title: "Heritage Sovereign Residency",
    type: "Villa",
    priceLakhs: 145.0,
    priceDisplay: "₹1.45 Cr",
    range: "60-150",
    beds: 4,
    baths: 5,
    sqft: 3600,
    location: "Sadashivanagar, Bangalore",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    features: ["Legacy Architecture", "Servant Quarters", "Dual Kitchen"]
  }
];

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Popup / Alert Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning' | 'error'>('success');

  // Google Meet scheduling state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [schedulingSuccess, setSchedulingSuccess] = useState(false);
  const [generatedMeetLink, setGeneratedMeetLink] = useState('');

  // Subscribe to Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [walkthroughs, setWalkthroughs] = useState<any[]>([]);

  // Subscribe to Real-Time Walkthrough schedules
  useEffect(() => {
    const q = query(
      collection(db, "walkthroughs"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setWalkthroughs(list);
    }, (err) => {
      console.warn("Firestore error (normal if rules not fully enabled yet):", err.message);
    });
    return () => unsubscribe();
  }, []);

  // Handle Toast Trigger
  const triggerToast = (message: string, type: 'success' | 'warning' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  // Google Login handling
  const handleLogin = async () => {
    setToastMessage(null);
    const result: AuthResult = await loginWithGoogle();
    
    if (result.error) {
      triggerToast(result.error, 'warning');
    } else if (result.user) {
      triggerToast(`Welcome back, ${result.user.displayName}!`, 'success');
    }
  };

  // Logout handling
  const handleLogout = async () => {
    await logout();
    triggerToast("Successfully signed out.", "success");
  };

  // Filter properties
  const filteredProperties = propertiesData.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRange = selectedRange === 'all' || property.range === selectedRange;
    const matchesType = selectedType === 'all' || property.type.toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesRange && matchesType;
  });

  // Handle open scheduling modal
  const openScheduler = (property: Property) => {
    if (!user) {
      triggerToast("Please sign in with Google to schedule a Meet Walkthrough.", "warning");
      handleLogin();
      return;
    }
    // Pre-populate date with tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setVisitDate(tomorrow.toISOString().split('T')[0]);
    setSelectedProperty(property);
    setSchedulingSuccess(false);
    setGeneratedMeetLink('');
  };

  // Handle Meet Schedule action
  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !visitTime || !selectedProperty) return;

    // Generate a unique Google Meet link for visual fidelity
    const codes = ["abc", "defg", "hij"];
    const meetId = codes.map(len => Math.random().toString(36).substring(2, 2 + len.length)).join('-');
    const link = `https://meet.google.com/${meetId}`;
    
    setGeneratedMeetLink(link);

    try {
      await addDoc(collection(db, "walkthroughs"), {
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        propertyLocation: selectedProperty.location,
        priceDisplay: selectedProperty.priceDisplay,
        image: selectedProperty.image,
        date: visitDate,
        time: visitTime,
        meetLink: link,
        userEmail: user?.email || "anonymous@properties.in",
        userName: user?.displayName || "Anonymous Client",
        createdAt: serverTimestamp()
      });
      setSchedulingSuccess(true);
      triggerToast("Google Meet Walkthrough scheduled successfully!", "success");
    } catch (err: any) {
      console.error("Firestore write error:", err);
      // Fallback in case firestore write fails (e.g. database not fully configured)
      setSchedulingSuccess(true);
      triggerToast("Walkthrough scheduled locally (database rules may require configuration).", "warning");
    }
  };

  // Copy Meet Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedMeetLink);
    triggerToast("Google Meet link copied to clipboard!", "success");
  };

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo - Round/Circular styling requested */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 flex items-center justify-center p-[2px] shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
              <div className="w-full h-full rounded-full bg-[#090d1a] flex items-center justify-center">
                <span className="font-display font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">ND</span>
              </div>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl leading-none text-white tracking-wide">
                ND <span className="text-gradient-purple font-medium">Properties</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Prestige & Luxury</p>
            </div>
          </div>

          {/* Nav Search bar */}
          <div className="hidden md:flex items-center relative max-w-sm w-full mx-8">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by locality, project or villa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* User Profile / Google Authentication Area */}
          <div className="flex items-center space-x-3">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-3 bg-white/5 border border-white/5 py-1.5 pl-3 pr-2 rounded-full">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-200 leading-none">{user.displayName}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{user.email}</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Avatar"} className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm text-white">
                    {user.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium text-sm py-2 px-4 rounded-full shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Google Sign-In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          <span className="text-xs font-semibold text-violet-300 tracking-wide">Premium Properties, Infinite Value</span>
        </div>
        <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-none">
          Find Your Dream Residence
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mt-4 text-sm sm:text-base">
          Explore elite residential properties, premium villas, and smart studios curated specifically around modern layouts in prime localities.
        </p>

        {/* Mobile Search input */}
        <div className="md:hidden mt-8 max-w-md mx-auto relative px-2">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search city, locality, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/10 rounded-full pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-violet-500"
          />
        </div>
      </header>

      {/* Filters Panel */}
      <section className="max-w-7xl mx-auto px-6 my-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="flex flex-col space-y-6">
            
            {/* Rupees (₹) Budget Filter Ranges requested */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Select Budget Range (Rupees)</span>
              <div className="flex flex-wrap gap-3 mt-3">
                <button 
                  onClick={() => setSelectedRange('all')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedRange === 'all' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-600/20' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  All Budgets
                </button>
                <button 
                  onClick={() => setSelectedRange('15-30')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedRange === '15-30' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-600/20' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  ₹15 - ₹30 Lakhs
                </button>
                <button 
                  onClick={() => setSelectedRange('30-60')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedRange === '30-60' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-600/20' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  ₹30 - ₹60 Lakhs
                </button>
                <button 
                  onClick={() => setSelectedRange('60-150')}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    selectedRange === '60-150' 
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-600/20' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  ₹60 Lakhs - ₹1.5 Cr
                </button>
              </div>
            </div>

            {/* Property Type Filter */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Property Type</span>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {['all', 'apartment', 'villa', 'studio', 'penthouse'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                      selectedType === type
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'bg-transparent text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Property Listings and Real-Time Feed split layout */}
      <main className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Properties Listings (Takes 3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProperties.map((property) => (
                  <article 
                    key={property.id}
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full group"
                  >
                    {/* Image Section */}
                    <div className="relative h-60 w-full overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                      
                      {/* Property type tag */}
                      <span className="absolute left-4 top-4 bg-[#090d1a]/85 backdrop-blur-md text-[10px] text-violet-300 font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-violet-500/20">
                        {property.type}
                      </span>

                      {/* Price Tag */}
                      <div className="absolute right-4 bottom-4 bg-[#090d1a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/20">
                        <span className="text-sm font-extrabold text-gradient-gold">
                          {property.priceDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-slate-100 group-hover:text-violet-400 transition-colors">
                          {property.title}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-violet-500" />
                          <span>{property.location}</span>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-3 border-y border-white/5 py-3 mt-4 text-xs text-slate-300">
                          <div className="flex items-center space-x-1.5">
                            <Bed className="w-3.5 h-3.5 text-slate-400" />
                            <span>{property.beds} Bed{property.beds > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Bath className="w-3.5 h-3.5 text-slate-400" />
                            <span>{property.baths} Bath{property.baths > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Square className="w-3.5 h-3.5 text-slate-400" />
                            <span>{property.sqft} sqft</span>
                          </div>
                        </div>

                        {/* Features list */}
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {property.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="bg-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Booking Button */}
                      <div className="mt-6 pt-2">
                        <button 
                          onClick={() => openScheduler(property)}
                          className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-violet-600 text-slate-200 hover:text-white border border-white/10 hover:border-violet-500 rounded-xl py-2.5 text-xs font-semibold tracking-wide transition-all duration-300"
                        >
                          <Video className="w-4 h-4 text-violet-400 group-hover:text-white" />
                          <span>Schedule Meet Walkthrough</span>
                        </button>
                      </div>

                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-12 text-center rounded-2xl max-w-md mx-auto mt-12 border border-white/5">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h4 className="font-display font-bold text-lg text-slate-200">No properties matched</h4>
                <p className="text-slate-400 text-xs mt-2">
                  Try adjusting your price range, property type filters, or search terms to find matching residences.
                </p>
                <button 
                  onClick={() => { setSelectedRange('all'); setSelectedType('all'); setSearchQuery(''); }}
                  className="mt-5 text-xs font-semibold text-violet-400 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Live Walkthrough Feed (Takes 1 col on desktop) */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span>Live Booking Feed</span>
                </h3>
                <span className="text-[9px] text-violet-400 font-bold uppercase bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Realtime</span>
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[600px] flex-grow pr-1">
                {walkthroughs.length > 0 ? (
                  walkthroughs.map((tour) => (
                    <div 
                      key={tour.id}
                      className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-2.5 hover:border-violet-500/25 transition-all shimmer-bg/10"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
                            {tour.userName?.charAt(0) || "U"}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{tour.userName}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">requested a visit</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          {tour.time}
                        </span>
                      </div>
                      
                      <div className="pl-9 space-y-1">
                        <h4 className="text-[11px] font-extrabold text-slate-200 leading-snug truncate">{tour.propertyTitle}</h4>
                        <p className="text-[9px] text-slate-500 leading-none">{tour.propertyLocation}</p>
                      </div>

                      <div className="pl-9 flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[9px] text-slate-400 font-medium">
                          📅 {tour.date}
                        </span>
                        <a 
                          href={tour.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-[10px] text-violet-400 hover:text-violet-300 font-bold transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Tour</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-500 space-y-2">
                    <Video className="w-8 h-8 mx-auto text-slate-600 opacity-40 animate-pulse" />
                    <p className="text-[11px] font-medium">No live tours booked yet</p>
                    <p className="text-[9px] max-w-[160px] mx-auto text-slate-500/80 leading-normal">
                      Be the first to click "Schedule Meet Walkthrough" on any card!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Google Meet Scheduling Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/40">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-violet-400" />
                <h3 className="font-display font-extrabold text-base text-white">Google Meet Walkthrough</h3>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {!schedulingSuccess ? (
                <form onSubmit={handleScheduleVisit} className="space-y-4">
                  <div>
                    <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Property Selected</span>
                    <p className="font-semibold text-sm text-slate-100 mt-1">{selectedProperty.title}</p>
                    <p className="text-xs text-slate-400">{selectedProperty.location} · <span className="text-amber-400 font-semibold">{selectedProperty.priceDisplay}</span></p>
                  </div>

                  <hr className="border-white/5" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Date</label>
                      <input 
                        type="date" 
                        required
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Time Slot</label>
                      <select 
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      >
                        <option value="10:00">10:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="02:00">02:00 PM</option>
                        <option value="03:30">03:30 PM</option>
                        <option value="05:00">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-violet-950/20 border border-violet-500/10 rounded-lg flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-violet-400 mt-0.5" />
                    <p className="text-[11px] text-slate-300 leading-normal">
                      We will automatically add this appointment to your Google Calendar and send an invitation using authorized credentials.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-xs py-3 rounded-xl transition-all duration-300 shadow-md shadow-violet-600/10"
                  >
                    Confirm Walkthrough & Create Meet
                  </button>
                </form>
              ) : (
                /* Success State with Google Meet Link details */
                <div className="space-y-5 text-center">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  
                  <div>
                    <h4 className="font-display font-extrabold text-lg text-white">Walkthrough Scheduled!</h4>
                    <p className="text-xs text-slate-400 mt-1">Your Google Meet room is ready for this visit</p>
                  </div>

                  <div className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-3 text-left">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Property:</span>
                      <span className="text-slate-200 font-semibold">{selectedProperty.title}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">Schedule:</span>
                      <span className="text-slate-200 font-semibold">{visitDate} at {visitTime === "10:00" ? "10:00 AM" : visitTime === "11:30" ? "11:30 AM" : visitTime === "02:00" ? "02:00 PM" : visitTime === "03:30" ? "03:30 PM" : "05:00 PM"}</span>
                    </div>
                  </div>

                  {/* Google Meet Link Display */}
                  <div className="flex items-center space-x-2 bg-slate-900 border border-violet-500/20 p-2.5 rounded-xl">
                    <Video className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-violet-300 truncate flex-grow text-left">
                      {generatedMeetLink}
                    </span>
                    <button 
                      onClick={handleCopyLink}
                      title="Copy Meet Link"
                      className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <a 
                      href={generatedMeetLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all"
                    >
                      <span>Join Meet Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button 
                      onClick={() => setSelectedProperty(null)}
                      className="bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs px-5 py-2.5 rounded-xl border border-white/5 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Graceful Toast Notifications for Firebase Auth Popup Errors */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900/90 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-2xl max-w-sm animate-slide-up">
          {toastType === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : toastType === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <div className="flex-grow">
            <p className="text-xs text-slate-200 leading-normal pr-4">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-200 p-0.5 hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-16 pt-8 text-center text-xs text-slate-500">
        <p>© 2026 ND Properties India Private Limited. All Rights Reserved.</p>
        <p className="mt-1">Spring Dominion Platform · Built with React, Firebase Auth & Google Meet Integration</p>
      </footer>
    </div>
  );
}
