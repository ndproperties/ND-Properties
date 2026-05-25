import { supabase } from './supabaseClient';
import { INITIAL_PROPERTIES, Property } from '../types';

export const seedDatabase = async () => {
  try {
    // 1. Seed Global Site Content Copy
    const { data: siteCopy, error: copyError } = await supabase
      .from('site_content')
      .select('id')
      .eq('id', 'global')
      .maybeSingle();

    if (copyError) {
      console.warn('Check site_content table failed:', copyError.message);
    }

    if (!siteCopy) {
      console.log('Seeding default CMS copy to Supabase site_content table...');
      const { error: insertError } = await supabase
        .from('site_content')
        .insert({
          id: 'global',
          heroTitle: 'Get to own your own home and <br /><span class="italic text-gray-400 font-normal">Make your dream come true</span>',
          heroSubtitle: 'Exclusive architectural masterpieces, thoughtfully curated for Bengalis who appreciate minimalist elegance and visionary living.',
          aboutTitle: 'A curated luxury <br />real estate consultancy',
          aboutText: 'Offering premium minimalist spaces tailored with a rigorous five-step verification protocol. We operate strictly as an advisory partner, representing clients who view their residence not just as shelter, but as a fine art asset.',
          contactEmail: 'ndproperties.buisness@gmail.com',
          contactPhone: '9748158051',
          contactLoungeBE: 'Beverly Hills',
          contactLoungeZH: 'Glass Villa, Penthouse, Loft, Estate, Apartment',
          contactLoungeDK: '15-30, 30-60, 60-1.5',
        });
      if (insertError) {
        console.error('Failed to seed site_content:', insertError.message);
      }
    }

    // 2. Seed Initial Properties if empty
    const { data: propertiesList, error: propError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (propError) {
      console.warn('Check properties table failed:', propError.message);
    }

    if (!propertiesList || propertiesList.length === 0) {
      console.log('Seeding default property listings to Supabase properties table...');
      
      const payload = INITIAL_PROPERTIES.map((property: Property) => {
        // Automatically determine the rupee budget bracket for compatibility
        let range: '15-30' | '30-60' | '60-150' = '15-30';
        const lakhsValue = property.numericPrice / 100000;
        if (lakhsValue >= 15 && lakhsValue <= 30) {
          range = '15-30';
        } else if (lakhsValue > 30 && lakhsValue <= 60) {
          range = '30-60';
        } else {
          range = '60-150';
        }

        return {
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          numericPrice: property.numericPrice,
          type: property.type,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          featured: property.featured,
          image: property.image,
          images: property.images || [property.image],
          highlights: property.highlights,
          amenities: property.amenities,
          description: property.description,
          range,
          createdAt: new Date().getTime(),
        };
      });

      const { error: bulkInsertError } = await supabase
        .from('properties')
        .insert(payload);

      if (bulkInsertError) {
        console.error('Failed to seed properties table:', bulkInsertError.message);
      } else {
        console.log('Property seeding to Supabase completed successfully.');
      }
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};
