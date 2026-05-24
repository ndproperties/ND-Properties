import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { db } from './lib/googleAuth';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ListingsView from './components/ListingsView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import BookTodayModal from './components/BookTodayModal';
import PropertyDetailModal from './components/PropertyDetailModal';

import { 
  Property, 
  Inquiry, 
  Booking, 
  INITIAL_PROPERTIES 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'home' | 'listings' | 'about' | 'contact'>('home');
  const [properties, setProperties] = React.useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = React.useState(false);
  const [selectedBookPropertyId, setSelectedBookPropertyId] = React.useState<string>('');
  const [passedFilters, setPassedFilters] = React.useState<{ location?: string; type?: string; priceRange?: string } | undefined>(undefined);
  
  // Real Local state persistence / simulation
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  // Sync bookings in real-time from Firestore
  React.useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(list);
    }, (err) => {
      console.warn("Firestore bookings load failed:", err.message);
    });
    return () => unsubscribe();
  }, []);

  // Sync inquiries in real-time from Firestore
  React.useEffect(() => {
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Inquiry[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      setInquiries(list);
    }, (err) => {
      console.warn("Firestore inquiries load failed:", err.message);
    });
    return () => unsubscribe();
  }, []);

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
      await addDoc(collection(db, "bookings"), {
        ...bookingData,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().getTime()
      });
    } catch (err: any) {
      console.error("Failed to save booking to Firestore:", err);
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
      await addDoc(collection(db, "inquiries"), {
        ...inquiryData,
        timestamp: new Date().toLocaleString(),
        createdAt: new Date().getTime()
      });
    } catch (err: any) {
      console.error("Failed to save inquiry to Firestore:", err);
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
              <AboutView />
            )}

            {activeTab === 'contact' && (
              <ContactView 
                inquiries={inquiries}
                onAddInquiry={handleAddInquiry}
                bookings={bookings}
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
