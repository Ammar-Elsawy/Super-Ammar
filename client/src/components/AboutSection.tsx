import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Globe, Users, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AboutSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Award, label: '20+ Years', description: 'Of Excellence' },
    { icon: Globe, label: '50+ Destinations', description: 'Across Egypt' },
    { icon: Users, label: '10,000+', description: 'Happy Travelers' },
    { icon: Star, label: '5-Star', description: 'Luxury Service' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-serif font-bold tracking-luxury" data-testid="text-about-title">
            {t('aboutTitle')}
          </h2>
          <p className="text-xl text-primary font-medium">
            {t('aboutSubtitle')}
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('aboutText')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 text-center space-y-3 hover-elevate">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold">{feature.label}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
