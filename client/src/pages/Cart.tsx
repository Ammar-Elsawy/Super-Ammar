import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';

export default function Cart() {
  const { t } = useLanguage();
  const { cartItems, cartCount, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    console.log('Proceeding to checkout with items:', cartItems);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8 tracking-luxury" data-testid="text-cart-title">
            {t('cart')}
          </h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-6 bg-muted rounded-full">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Discover our luxury experiences and start planning your Egyptian adventure
                </p>
              </div>
              <Link href="/tours">
                <Button size="lg" data-testid="button-explore-tours">
                  {t('exploreExperiences')}
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6" data-testid={`cart-item-${item.id}`}>
                    <div className="flex gap-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-2xl font-bold text-primary">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold" data-testid={`text-quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24 space-y-6">
                  <h3 className="text-xl font-serif font-semibold">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span data-testid="text-subtotal">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-serif font-bold text-xl pt-3 border-t">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Link href={`/checkout?items=${encodeURIComponent(JSON.stringify(cartItems))}`}>
                    <Button size="lg" className="w-full" data-testid="button-checkout">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
