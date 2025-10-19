import { Header } from '../Header';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="h-screen bg-background">
          <Header cartItemCount={3} />
          <div className="h-[200vh] flex items-center justify-center">
            <p className="text-muted-foreground">Scroll to see header behavior</p>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
