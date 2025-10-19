import { ContactSection } from '../ContactSection';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

export default function ContactSectionExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-background">
          <ContactSection />
          <Toaster />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
