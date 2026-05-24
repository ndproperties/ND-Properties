import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, Compass, Leaf, Landmark, Sparkles, Award, Scale, BookOpen } from 'lucide-react';

interface AboutViewProps {
  siteContent?: any;
}

export default function AboutView({ siteContent }: AboutViewProps) {
  const steps = [
    {
      num: '01',
      title: 'Title Integrity & Legal Verification',
      desc: 'Ensuring absolute, undisputed title safety and immediate escrow clearance across international jurisdictions.',
      icon: <Scale className="w-5 h-5 text-black" />
    },
    {
      num: '02',
      title: 'Structural Engineering Audit',
      desc: 'Inspection of framing parameters, material density, and structural integrity by senior architects.',
      icon: <Award className="w-5 h-5 text-black" />
    },
    {
      num: '03',
      title: 'Energy Footprint Certification',
      desc: 'Rating of sustainable heat preservation, active glass insulation levels, and building safety.',
      icon: <Leaf className="w-5 h-5 text-black" />
    },
    {
      num: '04',
      title: 'Prestige & Aesthetic Filter',
      desc: 'Evaluating integration into natural landscape, daylight orientation, and micro-climate wind circulation.',
      icon: <Compass className="w-5 h-5 text-black" />
    },
    {
      num: '05',
      title: 'Protected Transactions Secure Escrow',
      desc: 'Facilitating secure, compliant escrow transfers via highly vetted legal institutions globally.',
      icon: <Landmark className="w-5 h-5 text-black" />
    }
  ];

  return (
    <div id="about-view-container" className="space-y-32">
      
      {/* 1. Brand Mission Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <span className="text-[12px] font-bold tracking-[0.25em] text-gray-500 uppercase block mb-3">BRAND ARCHITECTURE</span>
            <h1 
              className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight" 
              id="about-mission-title"
              dangerouslySetInnerHTML={{ __html: siteContent?.aboutTitle ? siteContent.aboutTitle.replace(/\n/g, '<br />') : 'A curated luxury <br />real estate consultancy' }}
            />
          </div>
          <p className="text-gray-500 font-semibold text-[16px] md:text-[18px] leading-relaxed" id="about-mission-desc">
            {siteContent?.aboutText || "Offering premium minimalist spaces tailored with a rigorous five-step verification protocol. We operate strictly as an advisory partner, representing clients who view their residence not just as shelter, but as a fine art asset."}
          </p>

          <div className="flex gap-10 border-t border-gray-100 pt-8">
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">98.4%</span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Client Retention</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">100%</span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Pre-Vetted Assets</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">24h</span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Concierge Intake</span>
            </div>
          </div>
        </div>

        {/* Right side: Abstract architectural render */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
          <img 
            alt="Minimalist Architecture Masterpiece" 
            className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj4M2DP_wOGpxIGpOLl3LO21i7VRqAMMdaGKz2FY5rNN2ce0BvVOPSsX6uBnFjIVuFk5P5MD7AnZHovRawxbjPDIj6mFyCbcKkDUBoaR4uSdh5rhMyXdoWnI4AaKVhpNAu5QAm9-E4JV9xWDpJ9M1JcqMV5OtiZjEvK9aRqZ5Wa4EAn65EoRk2IrRj-s8HyJI9TFlMRJJjyFJ559Az7dkDWjJvyK56wJJ_f0BBaIgmUTuUa6xsp1nT8O4naGBJP-675NYBho521bA"
          />
        </div>
      </section>

      {/* 2. Signature 5-Step Verification Protocol */}
      <section className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[12px] font-bold tracking-[0.25em] text-gray-400 uppercase block mb-1">QUALITY STANDARD</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight" id="protocol-header">
            The Five-Step Verification Protocol
          </h2>
          <p className="text-gray-500 font-semibold text-[15px] leading-relaxed">
            Every estate listed with ND Properties has passed our legendary inspection protocol, defining standard-setting safety, engineering, and prestige metrics.
          </p>
        </div>

        {/* Responsive protocol stack / row cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6" id="protocol-grid">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl flex flex-col justify-between h-[280px] shadow-sm relative group hover:bg-white hover:-translate-y-2 transition-all duration-300"
              id={`protocol-card-${step.num}`}
            >
              {/* Card top */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                    {step.icon}
                  </div>
                  <span className="text-gray-300 font-extrabold text-3xl group-hover:text-black/5 transition-colors">{step.num}</span>
                </div>
                <h4 className="font-bold text-[15px] text-black tracking-tight leading-snug group-hover:text-black transition-colors">
                  {step.title}
                </h4>
              </div>

              {/* Card bottom description */}
              <p className="text-gray-500 font-medium text-[11px] leading-relaxed mt-2 uppercase tracking-wide">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Quote Block Section */}
      <section className="py-12 border-t border-gray-100 flex items-center justify-center text-center">
        <div className="max-w-2xl space-y-6">
          <BookOpen className="w-8 h-8 text-black/20 mx-auto" />
          <blockquote className="text-xl md:text-2xl font-light italic text-gray-700 tracking-tight leading-relaxed">
            "A home is not simply glass and steel. It is an extension of future memories, a sanctuary designed to make your dream come true."
          </blockquote>
          <cite className="block text-[12px] font-bold tracking-widest text-[#cfc4c5] uppercase not-italic">
            — ND Properties Philosophy Division
          </cite>
        </div>
      </section>

    </div>
  );
}
