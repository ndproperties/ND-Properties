import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, CheckCircle2, Home, Video } from 'lucide-react';
import { Property, Booking } from '../types';
import { googleSignIn, createGoogleMeetSpace } from '../lib/googleAuth';

interface BookTodayModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  selectedPropertyId?: string;
  onSaveBooking: (booking: Omit<Booking, 'id' | 'timestamp'>) => void;
}

export default function BookTodayModal({ 
  isOpen, 
  onClose, 
  properties, 
  selectedPropertyId = '',
  onSaveBooking 
}: BookTodayModalProps) {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [preferredDate, setPreferredDate] = React.useState('');
  const [preferredTime, setPreferredTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [propertyId, setPropertyId] = React.useState(selectedPropertyId);
  const [submitted, setSubmitted] = React.useState(false);

  // Google Meet related states
  const [isMeetRequested, setIsMeetRequested] = React.useState(false);
  const [googleUser, setGoogleUser] = React.useState<any>(null);
  const [googleToken, setGoogleToken] = React.useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const [meetLink, setMeetLink] = React.useState<string | null>(null);
  const [meetError, setMeetError] = React.useState<string | null>(null);

  const isInIframe = React.useMemo(() => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  React.useEffect(() => {
    if (selectedPropertyId) {
      setPropertyId(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  const handleGoogleConnect = async () => {
    setIsAuthenticating(true);
    setMeetError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Failed to authenticate Google:', err);
      if (err.message?.includes('popup-closed-by-user') || err.code?.includes('popup-closed-by-user')) {
        setMeetError(
          'The login popup was closed before completion. If you are previewing inside the AI Studio frame, browsers block cross-origin popups/cookies. Open the app in a new window using the "Open in New Tab" button to authenticate successfully.'
        );
      } else {
        setMeetError(err.message || 'Google Authentication failed. Please try again.');
      }
      setIsMeetRequested(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnectGoogle = () => {
    setGoogleUser(null);
    setGoogleToken(null);
    setMeetLink(null);
    setIsMeetRequested(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !preferredDate || !preferredTime) {
      alert('Please fill out all required fields');
      return;
    }

    let generatedMeetLink = '';

    if (isMeetRequested) {
      if (!googleToken) {
        alert('Please connect your Google Account to generate a Google Meet link.');
        return;
      }
      try {
        setIsAuthenticating(true);
        const space = await createGoogleMeetSpace(googleToken);
        generatedMeetLink = space.meetingUri;
        setMeetLink(space.meetingUri);
      } catch (err: any) {
        console.error('Meet link generation failed:', err);
        alert(`Google Meet Space setup failed: ${err.message || 'Unknown network error'}. We will record your booking without a link.`);
      } finally {
        setIsAuthenticating(false);
      }
    }
    
    // Call props callback
    onSaveBooking({
      fullName,
      email,
      phone,
      preferredDate,
      preferredTime,
      isMeetRequested,
      meetLink: generatedMeetLink || undefined,
      notes: notes + (propertyId ? ` (Interested in: ${properties.find(p => p.id === propertyId)?.title})` : '')
    });
    
    setSubmitted(true);
    
    // Reset form fields
    const displayTimeout = generatedMeetLink ? 6500 : 3200; // More time if they need to copy Meet link
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setPreferredDate('');
      setPreferredTime('');
      setNotes('');
      setPropertyId('');
      setIsMeetRequested(false);
      setMeetLink(null);
      onClose();
    }, displayTimeout);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
            id="book-modal-backdrop"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl overflow-hidden relative z-10 p-6 md:p-8"
            id="book-modal-card"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              id="book-modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8 px-4"
                id="booking-success-state"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2 tracking-tight">Private Showing Booked</h3>
                <p className="text-gray-500 font-medium max-w-sm mb-1 text-[15px]">
                  Thank you, <span className="font-bold text-black">{fullName}</span>.
                </p>
                <p className="text-gray-400 text-[14px] mb-4">
                  A luxury concierge will reach out to confirm your slot shortly. We have reserved a tentative appointment for you on <span className="font-bold text-black">{preferredDate}</span> at <span className="font-bold text-black">{preferredTime}</span>.
                </p>

                {meetLink && (
                  <div className="w-full mt-4 p-5 bg-[#dce3ef]/30 border border-blue-100 rounded-xl max-w-sm mx-auto text-left space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="text-[12px] uppercase font-bold text-blue-800 tracking-wider">Meet Space Created</span>
                    </div>
                    <p className="text-[12px] text-gray-400 font-medium font-mono leading-none">Your join link is active:</p>
                    <p className="text-[14px] font-bold text-black font-mono break-all bg-white/70 py-2.5 px-3 rounded-lg border border-gray-150 select-all shadow-sm">
                      {meetLink}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(meetLink);
                          alert('Copied Meet Link!');
                        }}
                        className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 font-bold text-[11px] text-gray-700 uppercase tracking-widest rounded-lg shadow-sm transition-all"
                      >
                        Copy Link
                      </button>
                      <a 
                        href={meetLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 py-2 bg-black text-white font-bold text-[11px] uppercase tracking-widest rounded-lg shadow-sm hover:opacity-90 transition-all text-center inline-block"
                      >
                        Launch Meet
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div id="booking-form-state">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black tracking-tight">Arrange Private View</h3>
                    <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider">ND Properties Premium Escrow</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none"
                    />
                  </div>

                  {/* Dual Grid: Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (212) 555-0198"
                        className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Dual Grid: Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Time *</label>
                      <div className="relative">
                        <input
                          type="time"
                          required
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Select Property */}
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Interested Property</label>
                    <div className="relative">
                      <select
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black transition-all outline-none appearance-none"
                      >
                        <option value="">General Consultancy / No Specific Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 📹 Google Meet Option Section */}
                  <div className="bg-[#fcfbf9] p-4.5 rounded-xl border border-gray-200/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-black leading-tight">Virtual Showings via Google Meet</h4>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">Generate a dedicated space for dynamic immersive tours.</p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={isMeetRequested} 
                          onChange={(e) => {
                            setIsMeetRequested(e.target.checked);
                            if (e.target.checked && !googleToken) {
                              handleGoogleConnect();
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>

                    {isMeetRequested && (
                      <div className="pl-12 text-[12px] border-t border-gray-100 pt-3 mt-1 space-y-3">
                        {isAuthenticating ? (
                          <span className="text-gray-400 font-bold flex items-center gap-2">
                            <span className="animate-spin text-black inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full"></span> Linking Google Calendar & Meet services...
                          </span>
                        ) : googleToken ? (
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 py-1 px-2.5 rounded-md border border-emerald-100">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                              Connected: {googleUser?.email}
                            </span>
                            <button 
                              type="button" 
                              onClick={handleDisconnectGoogle} 
                              className="text-red-500 hover:underline font-extrabold"
                            >
                              Disconnect
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            <p className="text-amber-700 font-bold mb-1.5 flex items-center gap-1">
                              ⚠️ Auth credentials required to create rooms
                            </p>
                            <button
                              type="button"
                              onClick={handleGoogleConnect}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded-lg shadow-sm font-bold text-[11px] uppercase tracking-wider"
                            >
                              Authorize with Google Account
                            </button>
                          </div>
                        )}

                        {/* Beautiful Error State */}
                        {meetError && (
                          <div className="bg-red-50/80 border border-red-200/50 rounded-lg p-3 text-[11px] text-red-900 space-y-2">
                            <p className="font-bold flex items-center gap-1 text-red-800">
                              <span>⚠️</span> Authentication Interrupted
                            </p>
                            <p className="leading-relaxed font-medium text-gray-750">
                              {meetError}
                            </p>
                            <div className="flex items-center gap-2 pt-1 font-bold">
                              <button 
                                type="button"
                                onClick={() => {
                                  setMeetError(null);
                                  handleGoogleConnect();
                                }}
                                className="px-2.5 py-1 bg-red-800 text-white hover:bg-red-900 rounded text-[10px] uppercase tracking-wide transition-all select-none"
                              >
                                Retry
                              </button>
                              <a 
                                href={window.location.origin} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-2.5 py-1 bg-white border border-red-200 text-red-800 hover:bg-red-50 rounded text-[10px] uppercase tracking-wide text-center transition-all select-none inline-block font-bold"
                              >
                                Open in New Tab
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Proactive Iframe Tip */}
                        {isInIframe && !googleToken && !meetError && (
                          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-800 space-y-1.5 font-medium leading-relaxed">
                            <p className="font-bold flex items-center gap-1 text-blue-900">
                              <span>💡</span> Iframe Environment Tip
                            </p>
                            <p>
                              If Google blocks the login window here, click below to open the application in a full tab and authorize Google Meet instantly.
                            </p>
                            <a 
                              href={window.location.origin} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-block font-extrabold text-blue-900 hover:underline"
                            >
                              Launch Independent Tab ↗
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">Special Notes / Requirements</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify dietary requirements, helipad coordinates, structural inspection documents request, etc."
                      className="w-full bg-gray-50 border border-gray-100 focus:border-black focus:bg-white focus:ring-0 rounded-lg px-4 py-3 font-semibold text-black placeholder-gray-300 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-4 rounded-xl font-bold tracking-wide shadow-lg flex items-center justify-center gap-2 text-[16px] active:scale-[0.98]"
                    id="submit-booking-btn"
                  >
                    Confirm Private Showing Application
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
