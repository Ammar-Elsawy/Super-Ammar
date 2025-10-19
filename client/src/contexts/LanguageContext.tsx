import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    experiences: 'Our Experiences',
    tours: 'Tours',
    trips: 'Trips',
    packages: 'Packages',
    contact: 'Contact Us',
    cart: 'Cart',
    discoverEgypt: 'Discover Egypt in Unparalleled Luxury',
    heroSubtitle: 'Experience the timeless wonders of the Nile with bespoke journeys crafted for the discerning traveler',
    exploreExperiences: 'Explore Experiences',
    bookNow: 'Book Now',
    viewDetails: 'View Details',
    from: 'From',
    perPerson: 'per person',
    days: 'days',
    aboutTitle: 'Along The Nile',
    aboutSubtitle: 'Your Gateway to Luxury Egyptian Travel',
    aboutText: 'For over two decades, Along The Nile has been crafting unforgettable journeys through Egypt\'s most magnificent destinations. Our commitment to excellence and attention to detail ensures every moment of your journey exceeds expectations.',
    contactTitle: 'Begin Your Journey',
    contactSubtitle: 'Contact us to craft your perfect Egyptian experience',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Message',
    sendMessage: 'Send Message',
    footerTagline: 'Crafting unforgettable journeys through Egypt since 2003',
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    newsletter: 'Newsletter',
    newsletterText: 'Subscribe for exclusive offers and travel inspiration',
    subscribe: 'Subscribe',
    rights: 'All rights reserved',
    addToCart: 'Add to Cart',
    items: 'items',
  },
  ar: {
    home: 'الرئيسية',
    about: 'عن الشركة',
    experiences: 'تجاربنا',
    tours: 'الجولات',
    trips: 'الرحلات',
    packages: 'الباقات',
    contact: 'اتصل بنا',
    cart: 'السلة',
    discoverEgypt: 'اكتشف مصر في رفاهية لا مثيل لها',
    heroSubtitle: 'اختبر عجائب النيل الخالدة مع رحلات مصممة خصيصًا للمسافر المميز',
    exploreExperiences: 'استكشف التجارب',
    bookNow: 'احجز الآن',
    viewDetails: 'عرض التفاصيل',
    from: 'من',
    perPerson: 'للشخص',
    days: 'أيام',
    aboutTitle: 'على طول النيل',
    aboutSubtitle: 'بوابتك للسفر الفاخر في مصر',
    aboutText: 'منذ أكثر من عقدين، تصنع شركة على طول النيل رحلات لا تُنسى عبر أروع وجهات مصر. التزامنا بالتميز والاهتمام بالتفاصيل يضمن أن كل لحظة من رحلتك تفوق التوقعات.',
    contactTitle: 'ابدأ رحلتك',
    contactSubtitle: 'اتصل بنا لصياغة تجربتك المصرية المثالية',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    message: 'الرسالة',
    sendMessage: 'إرسال رسالة',
    footerTagline: 'نصنع رحلات لا تُنسى عبر مصر منذ عام 2003',
    quickLinks: 'روابط سريعة',
    followUs: 'تابعنا',
    newsletter: 'النشرة الإخبارية',
    newsletterText: 'اشترك للحصول على عروض حصرية وإلهام السفر',
    subscribe: 'اشترك',
    rights: 'جميع الحقوق محفوظة',
    addToCart: 'أضف إلى السلة',
    items: 'عناصر',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-serif' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
