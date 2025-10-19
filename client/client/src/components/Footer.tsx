import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-primary tracking-luxury">
              Along The Nile
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('footerTagline')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('home')}
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('about')}
              </Link>
              <Link href="/tours" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('tours')}
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('contact')}
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('followUs')}</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('newsletter')}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {t('newsletterText')}
            </p>
            <div className="flex gap-2">
              <Input placeholder={t('email')} type="email" data-testid="input-newsletter" />
              <Button variant="default" data-testid="button-subscribe">
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 Along The Nile. {t('rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
