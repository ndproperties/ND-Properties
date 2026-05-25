import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from './lib/supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ListingsView from './components/ListingsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import BookTodayModal from './components/BookTodayModal';
import PropertyDetailModal from './components/PropertyDetailModal';
import AdminPanel from './components/AdminPanel';
import { seedDatabase } from './lib/dbSeeder';

import { 
  Property, 
  Inquiry, 
  Booking, 
  INITIAL_PROPERTIES 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'home' | 'listings' | 'about' | 'contact' | 'admin'>('home');
  const [properties, setProperties] = React.useState<Property[]>(INITIAL_PROPERTIES);
  const [siteContent, setSiteContent] = React.useState<any>(null);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = React.useState(false);
  const [selectedBookPropertyId, setSelectedBookPropertyId] = React.useState<string>('');
  const [passedFilters, setPassedFilters] = React.useState<{ location?: string; type?: string; priceRange?: string } | undefined>(undefined);
  
  // Real Local state persistence / simulation
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  // Reusable data fetching functions
  const fetchBookings = React.useCallback(async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('createdAt', { ascending: false });
    if (data) {
      setBookings(data as Booking[]);
    }
  }, []);

  const fetchInquiries = React.useCallback(async () => {
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false });
    if (data) {
      setInquiries(data as Inquiry[]);
    }
  }, []);

  const fetchContent = React.useCallback(async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'global')
      .maybeSingle();
    if (data) {
      setSiteContent(data);
    }
  }, []);

  const fetchProperties = React.useCallback(async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('createdAt', { ascending: false });
    if (data && data.length > 0) {
      setProperties(data as Property[]);
    }
  }, []);

  // Sync bookings in real-time from Supabase
  React.useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  // Sync inquiries in real-time from Supabase
  React.useEffect(() => {
    fetchInquiries();

    const channel = supabase
      .channel('inquiries-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => {
          fetchInquiries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchInquiries]);

  // 1. Seed database on mount
  React.useEffect(() => {
    seedDatabase();
  }, []);

  // 2. Sync site content copy in real-time from Supabase
  React.useEffect(() => {
    fetchContent();

    const channel = supabase
      .channel('site-content-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content', filter: 'id=eq.global' },
        (payload) => {
          if (payload.new) {
            setSiteContent(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContent]);

  // 3. Sync properties catalog in real-time from Supabase
  React.useEffect(() => {
    fetchProperties();

    const channel = supabase
      .channel('properties-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProperties]);

  // Refetch data when switching tabs (ensures updates show immediately even if Realtime replication is disabled)
  // Also establishes an 8-second polling timer to automatically catch changes made directly in the backend (Supabase dashboard or other clients)
  React.useEffect(() => {
    fetchContent();
    fetchProperties();
    fetchBookings();
    fetchInquiries();

    const interval = setInterval(() => {
      fetchContent();
      fetchProperties();
      fetchBookings();
      fetchInquiries();
    }, 8000);

    return () => clearInterval(interval);
  }, [activeTab, fetchContent, fetchProperties, fetchBookings, fetchInquiries]);

  // 4. Listen to hash changes for admin gateway
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveTab('admin');
      } else if (activeTab === 'admin') {
        setActiveTab('home');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleNavigateToListings = (filters?: { location?: string; type?: string; priceRange?: string }) => {
    if (filters) {
      setPassedFilters(filters);
    } else {
      setPassedFilters(undefined);
    }
    setActiveTab('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleBookViewing = (propertyId: string) => {
    setSelectedProperty(null);
    setSelectedBookPropertyId(propertyId);
    setIsBookModalOpen(true);
  };

  const handleSaveBooking = async (bookingData: Omit<Booking, 'id' | 'timestamp'>) => {
    try {
      const newId = `booking-${Date.now()}`;
      const { error } = await supabase
        .from('bookings')
        .insert({
          id: newId,
          ...bookingData,
          timestamp: new Date().toLocaleString(),
          createdAt: new Date().getTime()
        });
      if (error) throw error;
    } catch (err: any) {
      console.error("Failed to save booking to Supabase:", err);
      const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        timestamp: new Date().toLocaleString()
      };
      setBookings(prev => [newBooking, ...prev]);
    }
  };

  const handleAddInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'timestamp'>) => {
    try {
      const newId = `inquiry-${Date.now()}`;
      const { error } = await supabase
        .from('inquiries')
        .insert({
          id: newId,
          ...inquiryData,
          timestamp: new Date().toLocaleString(),
          createdAt: new Date().getTime()
        });
      if (error) throw error;
    } catch (err: any) {
      console.error("Failed to save inquiry to Supabase:", err);
      const newInquiry: Inquiry = {
        ...inquiryData,
        id: `inquiry-${Date.now()}`,
        timestamp: new Date().toLocaleString()
      };
      setInquiries(prev => [newInquiry, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-black font-sans relative overflow-x-hidden selection:bg-black selection:text-white pb-10">
      
      {/* Soft Background Art Circles (Architectural Aura) */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-[#ebd8d0]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-10%] w-[45vw] h-[45vw] bg-[#dce3ef]/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Sticky Header Nav */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setPassedFilters(undefined); // Clear filters on explicit navbar tab change
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (window.location.hash) {
            window.history.pushState("", document.title, window.location.pathname + window.location.search);
          }
        }}
        onBookClick={() => {
          setSelectedBookPropertyId('');
          setIsBookModalOpen(true);
        }}
      />

      {/* Main View Wrapper */}
      <main className="pt-32 pb-20 w-full max-w-7xl mx-auto px-6 md:px-20 relative z-10 min-h-[70vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'home' && (
              <HomeView 
                onNavigateToListings={handleNavigateToListings}
                onSelectProperty={handleSelectProperty}
                properties={properties}
                siteContent={siteContent}
              />
            )}

            {activeTab === 'listings' && (
              <ListingsView 
                properties={properties}
                onSelectProperty={handleSelectProperty}
                passedFilters={passedFilters}
              />
            )}

            {activeTab === 'about' && (
              <AboutView siteContent={siteContent} />
            )}

            {activeTab === 'contact' && (
              <ContactView 
                inquiries={inquiries}
                onAddInquiry={handleAddInquiry}
                bookings={bookings}
                siteContent={siteContent}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel 
                siteContent={siteContent}
                properties={properties}
                bookings={bookings}
                onRefreshProperties={fetchProperties}
                onRefreshContent={fetchContent}
                onRefreshBookings={fetchBookings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Interactive Footer */}
      <Footer onTabChange={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Book showing booking form popup modal */}
      <BookTodayModal 
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        properties={properties}
        selectedPropertyId={selectedBookPropertyId}
        onSaveBooking={handleSaveBooking}
      />

      {/* Property Details inspection popup modal */}
      <PropertyDetailModal 
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBookViewing={handleBookViewing}
        onSendMessage={handleAddInquiry}
      />

    </div>
  );
}
