import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './googleAuth';
import { INITIAL_PROPERTIES, Property } from '../types';

export const seedDatabase = async () => {
  try {
    // 1. Seed Global Site Content CMS Document
    const siteContentRef = doc(db, 'site_content', 'global');
    const siteContentSnap = await getDoc(siteContentRef);
    
    if (!siteContentSnap.exists()) {
      console.log('Seeding default CMS copy to Firestore...');
      await setDoc(siteContentRef, {
        heroTitle: "Find Your Dream Residence",
        heroSubtitle: "Explore elite residential properties, premium villas, and smart studios curated specifically around modern layouts in prime localities.",
        aboutTitle: "Our Legacy of Excellence",
        aboutText: "Our multi-national escrow and styling teams stand ready to guide your portfolio expansion. For over two decades, ND Properties has curated structural benchmarks across prime international sectors, aligning luxury, privacy, and architectural intelligence.",
        contactEmail: "hello@ndproperties.com",
        contactPhone: "+880 1234 567890",
        contactLoungeBE: "Beverly Hills",
        contactLoungeZH: "Zurich",
        contactLoungeDK: "Dhaka"
      });
    }

    // 2. Seed Initial Properties if empty
    const propertiesColRef = collection(db, 'properties');
    const propertiesSnap = await getDocs(propertiesColRef);
    
    if (propertiesSnap.empty) {
      console.log('Seeding default property listings to Firestore...');
      const batch = writeBatch(db);
      
      INITIAL_PROPERTIES.forEach((property: Property) => {
        // Create document reference using the property ID
        const docRef = doc(db, 'properties', property.id);
        batch.set(docRef, {
          ...property,
          // Support image array for carousels; default to containing the single main image
          images: [property.image],
          createdAt: new Date().getTime()
        });
      });
      
      await batch.commit();
      console.log('Property seeding completed successfully.');
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};
