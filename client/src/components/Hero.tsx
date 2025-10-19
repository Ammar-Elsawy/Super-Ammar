import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';

interface HeroProps {
  imageUrl: string;
  title?: string;
  subtitle?: string;
}

export function Hero({ imageUrl, title, subtitle }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-[85vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-luxury leading-tight"
            data-testid="text-hero-title"
          >
            {title || t('discoverEgypt')}
          </h1>
          <p 
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            {subtitle || t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tours">
              <Button 
                size="lg" 
                variant="default"
                className="text-lg px-8"
                data-testid="button-explore"
              >
                {t('exploreExperiences')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 bg-background/20 backdrop-blur-md border-white/30 text-white hover:bg-background/30"
                data-testid="button-contact"
              >
                {t('contact')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
