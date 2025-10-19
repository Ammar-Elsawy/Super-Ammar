import { ExperienceCard } from '../ExperienceCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import tourImage from '@assets/generated_images/Traditional_luxury_dahabiya_boat_51857c25.png';

export default function ExperienceCardExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 bg-background max-w-sm">
          <ExperienceCard
            id="1"
            title="Luxury Nile Cruise"
            description="Sail the Nile in ultimate luxury aboard a traditional dahabiya, visiting ancient temples and experiencing authentic Egyptian culture."
            imageUrl={tourImage}
            price={3500}
            duration={7}
            location="Luxor to Aswan"
            type="tour"
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
