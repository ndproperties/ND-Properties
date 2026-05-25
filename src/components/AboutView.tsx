import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, Compass, Leaf, Landmark, Sparkles, Award, Scale, BookOpen, MapPin, FileText, Car, Check } from 'lucide-react';

interface AboutViewProps {
  siteContent?: any;
}

function AnimatedNumber({ value, duration = 1500 }: { value: string; duration?: number }) {
  const numericMatch = value.match(/\d+/);
  if (!numericMatch) return <span>{value}</span>;
  
  const target = parseInt(numericMatch[0], 10);
  const suffix = value.replace(numericMatch[0], '');
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalSteps = 60;
    const stepTime = Math.max(duration / totalSteps, 16);
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

export default function AboutView({ siteContent }: AboutViewProps) {
  const steps = [
    {
      num: '01',
      title: 'Paper Verification',
      desc: 'Thorough verification of all ownership papers, deed title clearances, and building plan approvals.',
      icon: <FileText className="w-5 h-5 text-black" />
    },
    {
      num: '02',
      title: 'Locality & Distance',
      desc: 'Assessing proximity to essential amenities like hospitals, schools, colleges, and grocery stores.',
      icon: <MapPin className="w-5 h-5 text-black" />
    },
    {
      num: '03',
      title: 'Utility & Parking Check',
      desc: 'Ensuring proper parking spacing, electricity backup, water supply, and building structure stability.',
      icon: <Car className="w-5 h-5 text-black" />
    },
    {
      num: '04',
      title: 'On-Site Verification',
      desc: 'In-person physical inspection of construction quality, layout, ventilation, and surroundings.',
      icon: <Eye className="w-5 h-5 text-black" />
    },
    {
      num: '05',
      title: 'Official Listing',
      desc: 'Approved properties are photographed, cataloged, and uploaded to our official website.',
      icon: <Check className="w-5 h-5 text-black" />
    }
  ];

  return (
    <div id="about-view-container" className="space-y-32">
      
      {/* 1. Brand Mission Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div>
            <span className="text-[12px] font-bold tracking-[0.25em] text-gray-500 uppercase block mb-3">COMPANY PORTFOLIO</span>
            <h1 
              className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight" 
              id="about-mission-title"
              dangerouslySetInnerHTML={{ __html: siteContent?.aboutTitle ? siteContent.aboutTitle.replace(/\n/g, '<br />') : 'We are a premium property <br />listing company' }}
            />
          </div>
          <p className="text-gray-500 font-semibold text-[16px] md:text-[18px] leading-relaxed" id="about-mission-desc">
            {siteContent?.aboutText || "We believe that a good home is for everyone and everyone should own it. We list and verify every property with a strict five-step verification protocol to ensure it is safe, high-quality, and structurally sound for families and premium buyers in Kolkata."}
          </p>

          <div className="flex gap-10 border-t border-gray-100 pt-8">
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">
                <AnimatedNumber value="320+" />
              </span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Properties Sold</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">
                <AnimatedNumber value="98%" />
              </span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Satisfied Clients</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-bold text-black">
                <AnimatedNumber value="5 Steps" />
              </span>
              <span className="block font-bold text-[11px] text-gray-400 uppercase tracking-widest">Verification</span>
            </div>
          </div>
        </div>

        {/* Right side: Abstract architectural render */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
          <img 
            alt="Minimalist Architecture Masterpiece" 
            className="w-full h-[450px] object-cover transition-transform duration-1000 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
          />
        </div>
      </section>

      {/* 2. Signature 5-Step Verification Protocol */}
      <section className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[12px] font-bold tracking-[0.25em] text-gray-400 uppercase block mb-1">QUALITY STANDARD</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight" id="protocol-header">
            How We List & Verify Properties
          </h2>
          <p className="text-gray-500 font-semibold text-[15px] leading-relaxed">
            Every property listed with ND Properties has passed our rigorous quality checks, ensuring setting safety, structure, and amenities.
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
            "Owning a home is a dream for everyone, and we believe that a good home is for everyone. Let us help you find the property where your dream comes true."
          </blockquote>
          <cite className="block text-[12px] font-bold tracking-widest text-[#cfc4c5] uppercase not-italic">
            — ND Properties Philosophy Division
          </cite>
        </div>
      </section>

    </div>
  );
}
