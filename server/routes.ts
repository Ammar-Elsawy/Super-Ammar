import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertBookingSchema } from "@shared/schema";
import Stripe from "stripe";
import { randomUUID } from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

// Middleware to ensure session ID exists
function ensureSession(req: Request, res: Response, next: NextFunction) {
  if (!req.session.cartId) {
    req.session.cartId = randomUUID();
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Experience routes
  app.get("/api/experiences", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const experiences = await storage.getExperiences(type);
      res.json(experiences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experiences" });
    }
  });

  app.get("/api/experiences/:id", async (req, res) => {
    try {
      const experience = await storage.getExperience(req.params.id);
      if (!experience) {
        return res.status(404).json({ error: "Experience not found" });
      }
      res.json(experience);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch experience" });
    }
  });

  // Cart routes (with session support)
  app.get("/api/cart", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const validatedItem = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addCartItem(sessionId, validatedItem);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid cart item data" });
    }
  });

  app.patch("/api/cart/:id", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
      const updated = await storage.updateCartItemQuantity(sessionId, req.params.id, quantity);
      if (!updated) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const success = await storage.removeCartItem(sessionId, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Booking routes
  app.post("/api/bookings", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const { cartItemIds, name, email, phone, travelers, startDate } = req.body;

      // Validate cart items and recalculate total from server-side prices
      const cartItems = await storage.getCartItems(sessionId);
      const validatedItems = cartItems.filter(item => cartItemIds.includes(item.id));

      if (validatedItems.length === 0) {
        return res.status(400).json({ error: "No valid cart items" });
      }

      // Recalculate total from canonical experience pricing
      let totalAmount = 0;
      for (const cartItem of validatedItems) {
        const experience = await storage.getExperience(cartItem.experienceId);
        if (!experience) {
          return res.status(400).json({ error: `Experience ${cartItem.experienceId} not found` });
        }
        totalAmount += experience.price * cartItem.quantity;
      }

      const booking = await storage.createBooking({
        name,
        email,
        phone,
        cartItemIds,
        travelers,
        startDate,
        totalAmount, // Server-calculated total
      });

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  // Stripe checkout session
  app.post("/api/create-checkout-session", ensureSession, async (req, res) => {
    try {
      const sessionId = req.session.cartId!;
      const { bookingId, cartItemIds } = req.body;

      if (!bookingId || !cartItemIds || !Array.isArray(cartItemIds)) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Fetch cart items from server storage to validate pricing
      const cartItems = await storage.getCartItems(sessionId);
      const validatedItems = cartItems.filter(item => cartItemIds.includes(item.id));

      if (validatedItems.length === 0) {
        return res.status(400).json({ error: "No valid cart items found" });
      }

      // Verify each cart item against the canonical experience data
      const lineItems = await Promise.all(
        validatedItems.map(async (cartItem) => {
          const experience = await storage.getExperience(cartItem.experienceId);
          if (!experience) {
            throw new Error(`Experience ${cartItem.experienceId} not found`);
          }

          // Use server-side price from experience catalog, not client-supplied price
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: experience.title,
                images: experience.imageUrl ? [experience.imageUrl] : [],
              },
              unit_amount: Math.round(experience.price * 100),
            },
            quantity: cartItem.quantity,
          };
        })
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin || 'http://localhost:5000'}/booking-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${req.headers.origin || 'http://localhost:5000'}/cart`,
        metadata: {
          bookingId,
        },
      });

      await storage.updateBookingPayment(bookingId, session.id, false);

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing signature');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
          await storage.updateBookingPayment(bookingId, session.id, true);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send('Webhook error');
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
