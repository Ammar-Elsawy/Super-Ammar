import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';

export interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: number;
  location: string;
  type: 'tour' | 'trip' | 'package';
}

export function ExperienceCard({
  id,
  title,
  description,
  imageUrl,
  price,
  duration,
  location,
  type,
}: ExperienceCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden group hover-elevate" data-testid={`card-experience-${id}`}>
      <Link href={`/${type}s/${id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-semibold tracking-luxury" data-testid={`text-title-${id}`}>
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-2" data-testid={`text-description-${id}`}>
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration} {t('days')}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">{t('from')}</p>
            <p className="text-2xl font-serif font-bold text-primary" data-testid={`text-price-${id}`}>
              ${price.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{t('perPerson')}</p>
          </div>
          <Link href={`/${type}s/${id}`}>
            <Button variant="default" data-testid={`button-view-${id}`}>
              {t('viewDetails')}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
