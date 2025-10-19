import { Hero } from '../Hero';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import heroImage from '@assets/generated_images/Luxury_Nile_cruise_sunset_hero_5dd3db81.png';

export default function HeroExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Hero imageUrl={heroImage} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
