import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MapPin, Mail, Phone, Clock, MessageSquare, Check, Video, ExternalLink, Calendar, Copy } from 'lucide-react';
import { Inquiry, Booking } from '../types';

interface ContactViewProps {
  inquiries: Inquiry[];
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp'>) => void;
  bookings: Booking[];
  siteContent?: any;
}

export default function ContactView({ inquiries, onAddInquiry, bookings, siteContent }: ContactViewProps) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      alert('Must fill in all requested fields to dispatch.');
      return;
    }
    
    onAddInquiry({
      fullName,
      email,
      message
    });

    setSuccess(true);
    setFullName('');
    setEmail('');
    setMessage('');

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div id="contact-view-container" className="space-y-20 w-screen relative left-1/2 -translate-x-1/2 px-6 md:px-20 py-20 bg-cover bg-center overflow-hidden border-y border-white/40 shadow-2xl" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80')",
      animation: 'slowMove 45s linear infinite'
    }}>
      
      {/* Inline styles for the slow moving background effect */}
      <style>{`
        @keyframes slowMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Dark/blue overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-black/45 to-black/65 z-0" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-20">
        
        {/* Centered Top Form block inside Liquid Glass */}
        <section className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <span className="text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase block mb-1">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none" id="contact-form-title">
              Get in Touch
            </h1>
            <p className="text-gray-100 font-semibold text-[15px] max-w-sm mx-auto leading-relaxed">
              We are a premium property listing firm based in Kolkata. Let us help you find the home of your dreams.
            </p>
          </div>

          {/* Liquid Glass form */}
          <div className="bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-md text-white">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-12 px-2"
                  id="contact-sent-success"
                >
                  <div className="w-14 h-14 bg-white text-black flex items-center justify-center rounded-full mb-6">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Dispatched</h3>
                  <p className="text-gray-200 font-medium max-w-xs text-[14px] leading-relaxed">
                    Your request has been logged successfully. Our Kolkata team will contact you shortly to make your dream come true.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-gate">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 px-1 font-semibold text-white placeholder-white/40 outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 px-1 font-semibold text-white placeholder-white/40 outline-none transition-colors text-sm"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase tracking-widest">
                      Describe your project or dream
                    </label>
                    <textarea 
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What is your dream home like? Let us know the details..."
                      className="w-full bg-transparent border-b border-white/20 focus:border-white py-3 px-1 font-semibold text-white placeholder-white/40 outline-none transition-colors resize-none text-sm"
                    />
                  </div>

                  {/* CTA SEND button */}
                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-100 transition-all font-bold uppercase tracking-widest py-4.5 rounded-xl text-[14px] flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-[0.98]"
                    id="contact-send-btn"
                  >
                    <span>SEND</span>
                    <Send className="w-4 h-4 text-black" />
                  </button>

                </form>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Underneath: Quick contact columns in liquid glass */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left" id="contact-utility-info">
          
          <a 
            href={`tel:${siteContent?.contactPhone || "9748158051"}`}
            className="space-y-3 bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl backdrop-blur-md text-white hover:bg-white/15 transition-all block group"
          >
            <div className="w-10 h-10 bg-white/20 text-white mx-auto md:mx-0 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-[15px] tracking-tight">Give a call to your personal manager</h4>
            <p className="text-white font-bold text-[14px]">{siteContent?.contactPhone || "9748158051"}</p>
            <p className="text-white/60 text-[11px] font-bold">Daily 10:00 AM to 12:00 PM</p>
          </a>

          <div className="space-y-3 bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl backdrop-blur-md text-white block">
            <div className="w-10 h-10 bg-white/20 text-white mx-auto md:mx-0 flex items-center justify-center rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-[15px] tracking-tight">Email Addresses</h4>
            <a href={`mailto:${siteContent?.contactEmail || "ndproperties.buisness@gmail.com"}`} className="block text-white font-bold text-[14px] hover:underline truncate">
              {siteContent?.contactEmail || "ndproperties.buisness@gmail.com"}
            </a>
            <a href="mailto:contact@ndproperties.in" className="block text-white font-bold text-[14px] hover:underline truncate">
              contact@ndproperties.in
            </a>
            <p className="text-white/60 text-[11px] font-bold">Response within 15 Minutes</p>
          </div>

          <a 
            href="https://maps.google.com/?q=Acropolis+Mall+Kolkata"
            target="_blank"
            rel="noreferrer"
            className="space-y-3 bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl backdrop-blur-md text-white hover:bg-white/15 transition-all block group"
          >
            <div className="w-10 h-10 bg-white/20 text-white mx-auto md:mx-0 flex items-center justify-center rounded-lg group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-[15px] tracking-tight">Office Location</h4>
            <p className="text-white font-bold text-[14px]">Kolkata, Acropolis</p>
            <p className="text-white/60 text-[11px] font-bold">You can visit us there.</p>
          </a>
          
        </section>

        {/* Bookings / Meet Meetings list in liquid glass */}
        {bookings.length > 0 && (
          <section className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl backdrop-blur-md space-y-6 text-white" id="logged-bookings">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
              <h3 className="font-bold text-lg text-white tracking-tight">Virtual Showings & Meet Consultations ({bookings.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white/10 p-6 rounded-xl border border-white/10 shadow-sm flex flex-col justify-between gap-5 transition-all hover:border-white/30 text-white"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block leading-none">Tour Client</span>
                        <span className="font-bold text-[15px] text-white block mt-1">{booking.fullName}</span>
                        <span className="text-[12px] font-medium text-white/70 block mt-0.5">{booking.email}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block leading-none">Schedule</span>
                        <span className="text-[13px] font-bold text-white block mt-1">{booking.preferredDate}</span>
                        <span className="text-[12px] font-bold text-white/70 block mt-0.5">{booking.preferredTime}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest block mb-1">Details & Requests</span>
                        <p className="text-[13px] text-white/80 italic font-medium leading-relaxed">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Meet Link Actions if present */}
                  {booking.isMeetRequested && booking.meetLink ? (
                    <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-200 flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-extrabold text-blue-300 uppercase tracking-wider block">Google Meet Active</span>
                          <span className="text-[12px] font-mono font-medium text-gray-350 block truncate max-w-[150px] sm:max-w-xs">{booking.meetLink}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(booking.meetLink || '');
                            alert('Meet Link copied to clipboard!');
                          }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-gray-300 hover:text-white transition-colors"
                          title="Copy Meet Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <a 
                          href={booking.meetLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-650 hover:bg-blue-750 text-white font-bold text-[11px] uppercase tracking-wider rounded transition-colors"
                        >
                          <span>Join</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/50" />
                      <div>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">In-Person Viewing</span>
                        <span className="text-[11px] font-semibold text-white/80 block">Our onsite manager will schedule your reception.</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recents list: Active browser session inquiries display inside liquid glass */}
        {inquiries.length > 0 && (
          <section className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-xl backdrop-blur-md space-y-6 text-white" id="logged-inquiries">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              <h3 className="font-bold text-lg text-white tracking-tight">Active Dispatches ({inquiries.length})</h3>
            </div>
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div 
                  key={inq.id} 
                  className="bg-white/10 p-5 rounded-xl border border-white/10 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:border-white/30 text-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-[14px]">{inq.fullName}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-[12px] font-medium text-white/70">{inq.email}</span>
                    </div>
                    <p className="text-[13px] text-white/80 mt-2 italic font-medium leading-relaxed">
                      "{inq.message}"
                    </p>
                    {inq.propertyName && (
                      <span className="inline-block bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-md mt-2">
                        Property: {inq.propertyName}
                      </span>
                    )}
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[11px] font-semibold text-white/50 block">Logged Securely</span>
                    <span className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 block">Concierge Active</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
