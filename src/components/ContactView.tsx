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
    <div id="contact-view-container" className="space-y-24 max-w-6xl mx-auto px-4">
      
      {/* Centered Top Form block */}
      <section className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase block mb-1">
            CONCIERGE GATEWAY
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-none" id="contact-form-title">
            Questions? Get in touch
          </h1>
          <p className="text-gray-500 font-semibold text-[15px] max-w-sm mx-auto">
            Our multi-national escrow and styling teams stand ready to guide your portfolio expansion.
          </p>
        </div>

        {/* The beautiful minimal contact form */}
        <div className="bg-white/50 border border-white/60 p-8 md:p-12 rounded-2xl shadow-xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-12 px-2"
                id="contact-sent-success"
              >
                <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-full mb-6">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Message Dispatched</h3>
                <p className="text-gray-500 font-medium max-w-xs text-[14px]">
                  Your query has been logged securely under ND Properties Escrow protocol guidelines. Let's make your dream come true.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" id="contact-form-gate">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    Your Full Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent border-b-2 border-black/10 focus:border-black py-3 px-1 font-semibold text-black placeholder-gray-300 outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-transparent border-b-2 border-black/10 focus:border-black py-3 px-1 font-semibold text-black placeholder-gray-300 outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                    Describe your project or dream
                  </label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specifically interested in glass-insulated beachfront penthouses with private star observatory decks..."
                    className="w-full bg-transparent border-b-2 border-black/10 focus:border-black py-3 px-1 font-semibold text-black placeholder-gray-300 outline-none transition-colors resize-none"
                  />
                </div>

                {/* CTA SEND button */}
                <button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800 transition-all font-bold uppercase tracking-widest py-4.5 rounded-xl text-[14px] flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-[0.98]"
                  id="contact-send-btn"
                >
                  <span>SEND</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Underneath: Quick contact columns */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left border-t border-gray-100 pt-16" id="contact-utility-info">
        <div className="space-y-2">
          <div className="w-10 h-10 bg-gray-50 text-black mx-auto md:mx-0 flex items-center justify-center rounded-lg">
            <Phone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-black text-[15px]">Call Global Advisory</h4>
          <p className="text-gray-500 text-[13px] font-medium">{siteContent?.contactPhone || "+880 1234 567890"}</p>
          <p className="text-gray-400 text-[11px]">Daily 08:30 — 22:00 BST</p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 bg-gray-50 text-black mx-auto md:mx-0 flex items-center justify-center rounded-lg">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-black text-[15px]">General & Escrow Inbox</h4>
          <p className="text-gray-500 text-[13px] font-medium">{siteContent?.contactEmail || "hello@ndproperties.com"}</p>
          <p className="text-gray-400 text-[11px]">Response within 15 Minutes</p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 bg-gray-50 text-black mx-auto md:mx-0 flex items-center justify-center rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-black text-[15px]">Advisory Lounges</h4>
          <p className="text-gray-500 text-[13px] font-medium">
            {siteContent?.contactLoungeBE || "Beverly Hills"} • {siteContent?.contactLoungeZH || "Zurich"} • {siteContent?.contactLoungeDK || "Dhaka"}
          </p>
          <p className="text-gray-400 text-[11px]">By Private Invitation Only</p>
        </div>
      </section>

      {/* Bookings / Meet Meetings list */}
      {bookings.length > 0 && (
        <section className="bg-gray-50/50 p-8 rounded-2xl border border-gray-200/50 space-y-6" id="logged-bookings">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
            <h3 className="font-bold text-lg text-black tracking-tight">Virtual Showings & Meet Consultations ({bookings.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between gap-5 transition-all hover:border-gray-300"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Tour Client</span>
                      <span className="font-bold text-[15px] text-black block mt-1">{booking.fullName}</span>
                      <span className="text-[12px] font-medium text-gray-500 block mt-0.5">{booking.email}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Schedule</span>
                      <span className="text-[13px] font-bold text-black block mt-1">{booking.preferredDate}</span>
                      <span className="text-[12px] font-bold text-gray-500 block mt-0.5">{booking.preferredTime}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Details & Requests</span>
                      <p className="text-[13px] text-gray-600 italic font-medium leading-relaxed">
                        "{booking.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Meet Link Actions if present */}
                {booking.isMeetRequested && booking.meetLink ? (
                  <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider block">Google Meet Active</span>
                        <span className="text-[12px] font-mono font-medium text-gray-600 block truncate max-w-[150px] sm:max-w-xs">{booking.meetLink}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(booking.meetLink || '');
                          alert('Meet Link copied to clipboard!');
                        }}
                        className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded text-gray-500 hover:text-black transition-colors"
                        title="Copy Meet Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a 
                        href={booking.meetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider rounded transition-colors"
                      >
                        <span>Join</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-150 rounded-lg p-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">In-Person Viewing</span>
                      <span className="text-[11px] font-semibold text-gray-650 block">Concierge will schedule an advisor for onsite reception.</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recents list: Active browser session inquiries display */}
      {inquiries.length > 0 && (
        <section className="bg-gray-50/50 p-8 rounded-2xl border border-gray-200/50 space-y-6" id="logged-inquiries">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-black rounded-full animate-ping" />
            <h3 className="font-bold text-lg text-black tracking-tight">Active Dispatches ({inquiries.length})</h3>
          </div>
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div 
                key={inq.id} 
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all hover:border-gray-300"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-[14px]">{inq.fullName}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[12px] font-medium text-gray-500">{inq.email}</span>
                  </div>
                  <p className="text-[13px] text-gray-600 mt-2 italic font-medium leading-relaxed">
                    "{inq.message}"
                  </p>
                  {inq.propertyName && (
                    <span className="inline-block bg-black/5 text-black text-[10px] font-bold px-2 py-1 rounded-md mt-2">
                      Property: {inq.propertyName}
                    </span>
                  )}
                </div>
                <div className="text-left md:text-right shrink-0">
                  <span className="text-[11px] font-semibold text-gray-400 block">Logged Securely</span>
                  <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5 block">Concierge Active</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
