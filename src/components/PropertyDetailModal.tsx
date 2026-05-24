import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, BedDouble, Bath, Square, Sparkles, Send, Phone, MessageSquare, ShieldCheck, Mail } from 'lucide-react';
import { Property, Inquiry } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (propertyId: string) => void;
  onSendMessage: (inquiry: Omit<Inquiry, 'id' | 'timestamp'>) => void;
}

export default function PropertyDetailModal({ 
  property, 
  onClose, 
  onBookViewing,
  onSendMessage
}: PropertyDetailModalProps) {
  const [inquiryName, setInquiryName] = React.useState('');
  const [inquiryEmail, setInquiryEmail] = React.useState('');
  const [inquiryMessage, setInquiryMessage] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);

  React.useEffect(() => {
    if (property) {
      setIsSent(false);
      setInquiryMessage(`I am highly interested in viewing ${property.title} in ${property.location}. Please provide a virtual walk-through package and escrow setup details.`);
    }
  }, [property]);

  if (!property) return null;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMessage) {
      alert('Please fill out all fields to submit an inquiry');
      return;
    }

    onSendMessage({
      fullName: inquiryName,
      email: inquiryEmail,
      message: inquiryMessage,
      propertyId: property.id,
      propertyName: property.title
    });

    setIsSent(true);
    setInquiryName('');
    setInquiryEmail('');
    
    setTimeout(() => {
      setIsSent(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
          id="detail-modal-backdrop"
        />

        {/* Modal Scroll Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-5xl bg-white/95 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
          id="detail-modal-card"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-white bg-black/40 hover:bg-black/80 hover:text-white backdrop-blur-md rounded-full transition-colors"
            id="detail-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left panel: Image Carousel & Key specs */}
          <div className="w-full md:w-1/2 relative bg-gray-900 overflow-hidden flex flex-col justify-between">
            <img 
              src={property.image} 
              alt={property.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80" 
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 p-6 flex justify-between items-start">
              <span className="bg-black text-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full">
                {property.type === 'sale' ? 'Featured Sale' : 'Private Lease'}
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 text-[14px] font-semibold rounded-lg">
                Verified Asset
              </span>
            </div>

            {/* Bottom Panel Specs */}
            <div className="relative z-10 p-6 md:p-8 text-white space-y-4">
              <div>
                <p className="text-[12px] uppercase tracking-widest text-[#cfc4c5] font-bold">{property.location}</p>
                <h3 className="text-3xl font-bold tracking-tight mt-1">{property.title}</h3>
                <p className="text-2xl font-bold mt-2 text-[#b9c7e0]">{property.price}</p>
              </div>

              {/* Grid properties */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <BedDouble className="w-4 h-4 text-[#b9c7e0]" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 uppercase font-semibold">Beds</span>
                    <span className="font-bold text-[14px]">{property.beds} Rooms</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Bath className="w-4 h-4 text-[#b9c7e0]" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 uppercase font-semibold">Baths</span>
                    <span className="font-bold text-[14px]">{property.baths} Baths</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Square className="w-4 h-4 text-[#b9c7e0]" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 uppercase font-semibold">Sq Ft</span>
                    <span className="font-bold text-[14px]">{property.sqft.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Information & Contact Inquiry form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Comprehensive Overview</span>
                <h4 className="text-xl font-bold text-black tracking-tight mt-1">Property Description</h4>
              </div>
              <p className="text-gray-600 text-[14px] leading-relaxed font-medium">
                {property.description}
              </p>

              {/* Highlights */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold block">Exclusive Architectural Features</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[13px] font-semibold text-gray-800">
                      <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol status */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-black text-[13px]">Passed Rigorous Verification Protocol</h5>
                  <p className="text-[12px] text-gray-500 mt-0.5">Tested for title integrity, structural engineering soundness, advanced energy metrics, and aesthetic prestige.</p>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Inline Form */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Request Private Escrow Information</span>
                <button
                  onClick={() => onBookViewing(property.id)}
                  className="text-black font-bold text-[12px] uppercase tracking-wider hover:underline"
                >
                  Book Showing
                </button>
              </div>

              {isSent ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center"
                >
                  <p className="text-emerald-700 font-bold text-[14px]">Application Dispatched</p>
                  <p className="text-gray-500 text-[12px] mt-1">Our concierge team will call you within 15 minutes regarding {property.title}.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="border border-gray-200 focus:border-black focus:ring-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-black"
                    />
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="border border-gray-200 focus:border-black focus:ring-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-black"
                    />
                  </div>
                  <textarea 
                    rows={2}
                    required
                    placeholder="Enter message..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full border border-gray-200 focus:border-black focus:ring-0 rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-700 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Encrypted Application
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
