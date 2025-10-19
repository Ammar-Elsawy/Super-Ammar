import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Target, Heart, Shield, Award } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();
  const { cartCount } = useCart();

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To create unforgettable journeys that showcase the timeless beauty and rich heritage of Egypt while exceeding every expectation.',
    },
    {
      icon: Heart,
      title: 'Our Passion',
      description: 'We are deeply passionate about Egypt\'s culture, history, and people, and we love sharing this passion with our guests.',
    },
    {
      icon: Shield,
      title: 'Our Commitment',
      description: 'Your safety, comfort, and satisfaction are our top priorities. We ensure every detail is perfectly crafted.',
    },
    {
      icon: Award,
      title: 'Our Excellence',
      description: 'Award-winning service and consistently high ratings from travelers worldwide speak to our dedication to quality.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-5xl font-serif font-bold tracking-luxury">
              {t('aboutTitle')}
            </h1>
            <p className="text-2xl text-primary font-medium">
              {t('aboutSubtitle')}
            </p>
          </div>

          <AboutSection />

          <div className="mt-20">
            <h2 className="text-3xl font-serif font-bold text-center mb-12 tracking-luxury">
              What Defines Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-8 space-y-4 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-serif font-semibold">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-20 bg-card rounded-lg p-12 text-center space-y-6">
            <h2 className="text-3xl font-serif font-bold tracking-luxury">
              Experience the Difference
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From the moment you contact us to the final farewell, every aspect of your journey is meticulously planned and flawlessly executed. Our team of expert guides, luxury partners, and dedicated staff work together to ensure your Egyptian adventure is truly exceptional.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
