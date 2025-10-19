import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { t } = useLanguage();
  const { cartCount, cartItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    startDate: '',
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const cartItemIds = cartItems.map(item => item.id);
      
      // Create booking with all cart item IDs
      const bookingRes = await apiRequest('POST', '/api/bookings', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cartItemIds: cartItemIds,
        travelers: formData.travelers,
        startDate: formData.startDate,
        totalAmount: total,
      });
      const booking = await bookingRes.json();

      // Create Stripe checkout session with validated cart item IDs
      const sessionRes = await apiRequest('POST', '/api/create-checkout-session', {
        bookingId: booking.id,
        cartItemIds: cartItemIds,
      });
      const session = await sessionRes.json();

      return session;
    },
    onSuccess: async (session) => {
      const stripe = await stripePromise;
      if (stripe && session.url) {
        window.location.href = session.url;
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to process checkout. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.startDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    checkoutMutation.mutate();
  };

  if (cartItems.length === 0) {
    setLocation('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 tracking-luxury">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-serif font-semibold mb-6">Booking Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        data-testid="input-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travelers">Number of Travelers</Label>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                        data-testid="input-travelers"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Travel Start Date *</Label>
                    <div className="relative">
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                        data-testid="input-start-date"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full" 
                    disabled={checkoutMutation.isPending}
                    data-testid="button-submit"
                  >
                    {checkoutMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                <h3 className="text-xl font-serif font-semibold">Order Summary</h3>
                
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.title} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-serif font-bold text-xl pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total">
                    ${total.toLocaleString()}
                  </span>
                </div>

                <div className="pt-6 border-t text-xs text-muted-foreground space-y-2">
                  <p>Secure payment powered by Stripe</p>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
