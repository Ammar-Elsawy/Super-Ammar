import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-serif font-bold text-primary tracking-luxury">
              Along The Nile
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="hover-elevate px-3 py-2 rounded-md">
              <span className="font-medium" data-testid="link-home">{t('home')}</span>
            </Link>
            <Link href="/about" className="hover-elevate px-3 py-2 rounded-md">
              <span className="font-medium" data-testid="link-about">{t('about')}</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium" data-testid="button-experiences">
                  {t('experiences')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/tours" data-testid="link-tours">
                    {t('tours')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/trips" data-testid="link-trips">
                    {t('trips')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/packages" data-testid="link-packages">
                    {t('packages')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/contact" className="hover-elevate px-3 py-2 rounded-md">
              <span className="font-medium" data-testid="link-contact">{t('contact')}</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    data-testid="text-cart-count"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2">
            <Link href="/" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('home')}</span>
            </Link>
            <Link href="/about" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('about')}</span>
            </Link>
            <Link href="/tours" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('tours')}</span>
            </Link>
            <Link href="/trips" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('trips')}</span>
            </Link>
            <Link href="/packages" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('packages')}</span>
            </Link>
            <Link href="/contact" className="block hover-elevate px-4 py-3 rounded-md">
              <span className="font-medium">{t('contact')}</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
