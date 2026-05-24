export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  type: 'sale' | 'rent';
  beds: number;
  baths: number;
  sqft: number;
  featured: boolean;
  image: string;
  images?: string[];
  highlights: string[];
  description: string;
  amenities: string[];
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyName?: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  timestamp: string;
  meetLink?: string;
  isMeetRequested?: boolean;
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'zenith-pavilion',
    title: 'The Zenith Pavilion',
    location: 'Beverly Hills, California',
    price: '₹1.25 Cr',
    numericPrice: 12500000,
    type: 'sale',
    beds: 4,
    baths: 5,
    sqft: 6500,
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaIw5kDV4aGh6ghEG48XXZvbdBqf1E118dAmuCa_4A8pjReeTmVvVPFb840l5GTPDbzlhs8pyRCVtB4BaWsxu0EWBscn9qznU0mhyPV7hhc-PaOk2u2pWtvhk5xJT8zrVA7KqV22l7bzJNC-j2VGShlGrJ5N4d2SVFuWg9W21V_MJpKteokjwaGm7HX2zGnJTAbdd9RqY89TOtiDYSMEHnyhiqdgfrQNCqLl32IHNjNutGaTn9V0fl5UTefTVMubLYZrrc0-pt-cA',
    highlights: ['Panoramic Ocean Views', 'Zero-Edge Pool', 'Underground Gallery Garage'],
    description: 'An architectural marvel perched high in Beverly Hills, featuring seamless transitions from indoor minimalist luxury to massive outdoor living decks, and a custom subterranean viewing gallery for automobile collectors.',
    amenities: ['pool', 'fitness_center', 'local_parking', 'security', 'home_theater']
  },
  {
    id: 'azure-loft',
    title: 'Azure Loft',
    location: 'Miami, Florida',
    price: '₹28 Lakhs',
    numericPrice: 2800000,
    type: 'sale',
    beds: 2,
    baths: 2.5,
    sqft: 2800,
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDQcl5xC7HE5Mz5Bh5ARCvOQ_HqD1vJmww9JddLbjg2wI8eCtXmlpgaxUv1VkUDFQy1rVQX1XpNXETzmd758IhCZxdpHbo6nqNzoe5TrjL5XQbJi9lJ_U9UFmq1-sRVROApNEagl9Sk8tsohfFZbd-tysA52wDouedUnVI6OcCBG1ozF2qov1oYOsxbYcWOEkI5JEhtFttkcJXG-U3rr-ahrVmjIXcCGXEDM0447jL_m1Zq2pP648RNC9CXknTAr7fbka917TRs5E',
    highlights: ['Double Height Ceilings', 'Direct Beach Gate Access', 'Spa-Grade Bathrooms'],
    description: 'Floating directly above the Atlantic Shoreline, Azure Loft offers dual-level glazing for unprecedented maritime horizons, tailored with smoked oak floors and custom hand-cast raw concrete finishes.',
    amenities: ['pool', 'fitness_center', 'local_parking', 'wifi', 'spa']
  },
  {
    id: 'onyx-suite',
    title: 'The Onyx Suite',
    location: 'London, UK',
    price: '₹55 Lakhs',
    numericPrice: 5500000,
    type: 'sale',
    beds: 3,
    baths: 3,
    sqft: 3200,
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj4M2DP_wOGpxIGpOLl3LO21i7VRqAMMdaGKz2FY5rNN2ce0BvVOPSsX6uBnFjIVuFk5P5MD7AnZHovRawxbjPDIj6mFyCbcKkDUBoaR4uSdh5rhMyXdoWnI4AaKVhpNAu5QAm9-E4JV9xWDpJ9M1JcqMV5OtiZjEvK9aRqZ5Wa4EAn65EoRk2IrRj-s8HyJI9TFlMRJJjyFJ559Az7dkDWjJvyK56wJJ_f0BBaIgmUTuUa6xsp1nT8O4naGBJP-675NYBho521bA',
    highlights: ['Historic Architecture Outer Frame', 'Curated Art Lighting', 'Personal Butler Service'],
    description: 'Discreetly situated in London\'s most exclusive neighborhood, the Onyx Suite combines restored high Victorian windows with state-of-the-art climate, security, and sound insulated technology.',
    amenities: ['security', 'concierge', 'local_parking', 'heat_detector', 'lift']
  },
  {
    id: 'terra-observatory',
    title: 'Terra Observatory',
    location: 'Joshua Tree, California',
    price: '₹95 Lakhs',
    numericPrice: 9500000,
    type: 'sale',
    beds: 3,
    baths: 3.5,
    sqft: 4100,
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5bomKRFAc_MCf_3RLuysvkj0uowANxbbxVeEveO6M11xp9w0JC7a2D73mqAhqcTrkXWfyLK-fH4NmCoq8CZzvDyJTxDIBVsnMHyGLx-mPqDDl9XxrvPCdG89YJ4nixZEkHWB_i2WcQMBeXfu78MHyIqdj6ffEQT3znmRroGrRchQhr6Kcn-KrIiGXn_-IN_zc9fdJipnF3iNLZ6K22l4U6KO7cknBeVaiy_VBU9B0kzss5f2yTm4e2Vc_w54lyoVimMUM1jFMPgY',
    highlights: ['Celestial Skylights', 'Sustainable Thermal Earth-Wall', 'Private Stargazing Lounge'],
    description: 'Emerging from the Mojave desert landscape like a natural rock formation, Terra Observatory incorporates raw rammed-earth architecture with astronomical skylights for off-grid ultra-luxury.',
    amenities: ['solar_power', 'pool', 'local_parking', 'hottub', 'climate_control']
  },
  {
    id: 'oak-iron-estate',
    title: 'Oak & Iron Estate',
    location: 'Austin, Texas',
    price: '₹45 Lakhs',
    numericPrice: 4500000,
    type: 'sale',
    beds: 4,
    baths: 4.5,
    sqft: 5200,
    featured: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIJy6OV9QNuuoJbk38DZKuXvf4b3_7PAidQr3Ybblrdi4s62aZMQ0n8YkcjLwl89xnfhtpuUF8VDJ59sGXd4m3CUUnN12LhcGmgkdunYi-gysX_cjcq0VdSUMhrRoYlLcSEZiCin5IQq-4ws3368eOOLE_lI-HFWX84OXAYN1mvEbNUCOwFmV1r7H0kI8M33VFQZzx3Vr1JXZF3f_-F2mpj3hz2oPpCRIHJPNnvFcwbort5_8Tqal5PYMrEor_3OS7aniuMrxKARI',
    highlights: ['Chef-Grade Minimalist Kitchen', 'Japanese Garden Courtyard', 'Smart Glass Enclosure'],
    description: 'Located amidst majestic oaks, this architectural residence integrates textured charred wood (Shou Sugi Ban) with heavy industrial hot-rolled steel and architectural smart-glazing.',
    amenities: ['kitchen', 'backyard', 'local_parking', 'smart_home', 'cellar']
  },
  {
    id: 'refraction-house',
    title: 'Refraction House',
    location: 'Stuttgart, Germany',
    price: '₹35 Lakhs',
    numericPrice: 3500000,
    type: 'sale',
    beds: 3,
    baths: 3,
    sqft: 3900,
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfqQ5dD4ymNK3HSXH-Fc7_RvCdfQ7wTup6zLQpAQCGtn_GCR8D40G4ebjKQvSFJwHCxLVxtUwE4x8f5-qFhIRECgAb9KfVfBMVegCY8-PvL_aTJzHEtNGIEo1sx5f6HU905U26OqbBPlCp0-kPeXm7oIPr2AMJiJnYWqWZ6tdbZ8bRc2vDyIHdJklnSqR5bgBPWogdDX4haDn99cFq0ckbc79cm6shNqukoA6KopQaMH7QqoaCfd3OoyukwV2KWO4WeDMuBj2IoGY',
    highlights: ['Floating Glass Stairs', 'Multi-Level Water Reflection Pools', 'Carbon-Neutral Construction'],
    description: 'Refraction House stands out with its dynamic light-manipulating facade, which acts as a filter to disperse natural illumination softly across its deep high-performance concrete volumes.',
    amenities: ['pool', 'local_parking', 'solar_power', 'charging_station', 'security']
  },
  {
    id: 'aether-penthouse',
    title: 'Aether Penthouse',
    location: 'Zurich, Switzerland',
    price: '₹1.40 Cr',
    numericPrice: 14000000,
    type: 'sale',
    beds: 4,
    baths: 4,
    sqft: 4800,
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaqDzzkS6edUtiBGGNMrXqJP8RfK2eZGiu48You4MOtadgBvsIlwmwQCoKQQrY0BFdmcZBmyI_hPtC-WRwiWVWGCI7wfkoB8vah0h-Lzb89dIPc40UgZY3iC5Y0hSwoPbUFK40mFGw7Oxx10rLhrpusey_PQLFkKCCPwJylQ--7lW4tsOrHjoIDNMzbvO1QDz6xsoMZPXV207VWnuf-b2RMBBlqsDqbJe0J0uZd08DiyVCSAM0eNEz6nnf3ySc6WiFIKYg87Yu3hc',
    highlights: ['Indoor Saltwater Pool', 'Private Alpine Peak Vantage Deck', 'Custom Cedar Sauna'],
    description: 'A masterclass in luxury, this high-alpine penthouse floats over Zurich Lake, wrapped in triple-layered low-iron acoustic safety glass and custom light silver travertine flooring.',
    amenities: ['pool', 'spa', 'local_parking', 'fireplace', 'concierge']
  },
  {
    id: 'liquid-horizon',
    title: 'Liquid Horizon',
    location: 'Malibu, California',
    price: '₹18 Lakhs',
    numericPrice: 1800000,
    type: 'sale',
    beds: 5,
    baths: 6,
    sqft: 8100,
    featured: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuIQ-J_Z2zDM1PPGSq99ETu4joz8V6RLEep04jRiF9-W7MMxwfJBmPkKxL-SIurn0llYtrEPTguAjw2SySmSzoTwi0e3cMiu9HTv_CHDWKPoEEhDQKTHUlVt8YImMo-BvrAYjmi0HCNKaf-Kkt3tI64SIpwuodZyrKBUh7re9m7Ja-UWiopF0ecdt4MtS2LnqcGVgDchdtuoJP6zaDdnqhupeyCgaHLysfhVj2g3H8W0ARCCtWbBtolojUCMrZI8tHOsbE043DLSc',
    highlights: ['Cantilevered Living Deck', 'Direct Helicourse Ingress', 'Private Wellness Wing'],
    description: 'Seamlessly extending out from Malibu\'s dramatic sea cliffs, Liquid Horizon is constructed of prestressed marine-grade stainless steel framing and post-tensioned low-carbon concrete slab structures.',
    amenities: ['pool', 'fitness_center', 'spa', 'local_parking', 'security']
  }
];
