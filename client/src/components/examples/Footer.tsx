import { Footer } from '../Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function FooterExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-background">
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
