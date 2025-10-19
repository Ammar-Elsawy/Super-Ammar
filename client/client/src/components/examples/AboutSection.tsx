import { AboutSection } from '../AboutSection';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AboutSectionExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-background">
          <AboutSection />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
