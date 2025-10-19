import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { useCart } from '@/contexts/CartContext';

export default function Contact() {
  const { cartCount } = useCart();
  
  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32">
        <ContactSection />
      </div>

      <Footer />
    </div>
  );
}
