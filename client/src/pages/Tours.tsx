import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ExperienceCard } from '@/components/ExperienceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';

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

export default function Tours() {
  const { t } = useLanguage();
  const { cartCount } = useCart();
  const [isTours] = useRoute('/tours');
  const [isTrips] = useRoute('/trips');
  const [isPackages] = useRoute('/packages');

  let type = 'tour';
  let title = t('tours');
  let description = 'Guided luxury tours with expert Egyptologists and exclusive access to iconic sites';

  if (isTrips) {
    type = 'trip';
    title = t('trips');
    description = 'Exclusive day trips and short excursions to Egypt\'s most magnificent destinations';
  } else if (isPackages) {
    type = 'package';
    title = t('packages');
    description = 'Complete luxury travel packages with accommodations, tours, and unforgettable experiences';
  }

  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ['/api/experiences', { type }],
    queryFn: async () => {
      const response = await fetch(`/api/experiences?type=${type}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-serif font-bold tracking-luxury">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((experience) => (
              <ExperienceCard key={experience.id} {...experience} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
