import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="font-semibold"
      data-testid="button-language-toggle"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}
