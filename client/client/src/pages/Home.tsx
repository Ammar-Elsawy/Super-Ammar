import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ExperienceCard } from '@/components/ExperienceCard';
import { AboutSection } from '@/components/AboutSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import heroImage from '@assets/generated_images/Luxury_Nile_cruise_sunset_hero_5dd3db81.png';

interface Experience {
  id: string;
  title: string;
  description: string;
  type: 'tour' | 'trip' | 'package';
  price: number;
  duration: number;
  location: string;
  imageUrl: string;
  images: string[];
  maxGuests: number;
  highlights: string[];
  itinerary: string;
}

export default function Home() {
  const { t } = useLanguage();
  const { cartCount } = useCart();
  
  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ['/api/experiences'],
  });

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      <Hero imageUrl={heroImage} />
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-serif font-bold tracking-luxury">
              {t('experiences')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curated luxury experiences designed for discerning travelers seeking the extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.slice(0, 6).map((experience) => (
              <ExperienceCard key={experience.id} {...experience} />
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
