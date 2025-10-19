import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageGallery } from '@/components/ImageGallery';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, Users, Calendar, Check } from 'lucide-react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface Experience {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  duration: number;
  location: string;
  imageUrl: string;
  images: string[];
  maxGuests: number;
  highlights: string[];
  itinerary: string;
}

export default function TourDetail() {
  const { t } = useLanguage();
  const { cartCount, addToCart } = useCart();
  const params = useParams();
  const [, setLocation] = useLocation();

  const { data: experience, isLoading } = useQuery<Experience>({
    queryKey: ['/api/experiences', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/experiences/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!params.id,
  });

  if (isLoading || !experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartCount} />
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const itinerary: ItineraryDay[] = JSON.parse(experience.itinerary);

  const handleAddToCart = () => {
    addToCart({
      experienceId: experience.id,
      title: experience.title,
      price: experience.price,
      imageUrl: experience.imageUrl,
      type: experience.type,
      quantity: 1,
    });
  };

  const handleBookNow = () => {
    addToCart({
      experienceId: experience.id,
      title: experience.title,
      price: experience.price,
      imageUrl: experience.imageUrl,
      type: experience.type,
      quantity: 1,
    });
    setLocation('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery images={experience.images} alt={experience.title} />

              <div className="space-y-4">
                <h1 className="text-4xl font-serif font-bold tracking-luxury" data-testid="text-tour-title">
                  {experience.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{experience.duration} {t('days')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Max {experience.maxGuests} guests</span>
                  </div>
                </div>
                <p className="text-lg leading-relaxed" data-testid="text-tour-description">
                  {experience.description}
                </p>
              </div>

              <Card className="p-8 space-y-4">
                <h2 className="text-2xl font-serif font-semibold">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {experience.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8 space-y-6">
                <h2 className="text-2xl font-serif font-semibold">Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">{day.day}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{day.title}</h3>
                        <p className="text-muted-foreground text-sm">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('from')}</p>
                  <p className="text-4xl font-serif font-bold text-primary" data-testid="text-tour-price">
                    ${experience.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{t('perPerson')}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">Select your travel dates</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart} data-testid="button-add-to-cart">
                  {t('addToCart')}
                </Button>
                <Button size="lg" variant="outline" className="w-full" onClick={handleBookNow} data-testid="button-book-now">
                  {t('bookNow')}
                </Button>

                <div className="pt-6 border-t text-sm text-muted-foreground space-y-2">
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Free cancellation up to 30 days
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Best price guarantee
                  </p>
                  <p className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    24/7 customer support
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
