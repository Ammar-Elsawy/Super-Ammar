import { 
  type User, 
  type InsertUser,
  type Experience,
  type InsertExperience,
  type CartItem,
  type InsertCartItem,
  type Booking,
  type InsertBooking
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getExperiences(type?: string): Promise<Experience[]>;
  getExperience(id: string): Promise<Experience | undefined>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(sessionId: string, item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(sessionId: string, id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingPayment(id: string, stripeSessionId: string, paid: boolean): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private experiences: Map<string, Experience>;
  // Per-session cart storage: sessionId => Map<cartItemId, CartItem>
  private carts: Map<string, Map<string, CartItem>>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.experiences = new Map();
    this.carts = new Map();
    this.bookings = new Map();
    this.seedExperiences();
  }

  private seedExperiences() {
    const experiencesData: Omit<Experience, 'id'>[] = [
      {
        title: 'Luxury Nile Cruise',
        description: 'Experience the timeless beauty of the Nile aboard a luxurious traditional dahabiya. This exclusive journey takes you through ancient Egypt\'s most magnificent temples and archaeological sites while enjoying world-class service and amenities.',
        type: 'tour',
        price: 3500,
        duration: 7,
        location: 'Luxor to Aswan',
        imageUrl: '/assets/tour1.png',
        images: ['/assets/tour1.png', '/assets/tour2.png', '/assets/tour3.png'],
        maxGuests: 12,
        highlights: [
          'Private Egyptologist guide throughout the journey',
          'Luxury accommodation aboard traditional dahabiya',
          'All meals including gourmet dining experiences',
          'Entrance fees to all archaeological sites',
          'Traditional Egyptian entertainment',
          'Airport transfers in luxury vehicles',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival in Luxor', description: 'Welcome aboard and evening cruise' },
          { day: 2, title: 'Valley of the Kings', description: 'Visit tombs and Hatshepsut Temple' },
          { day: 3, title: 'Edfu Temple', description: 'Explore the best-preserved temple in Egypt' },
          { day: 4, title: 'Kom Ombo', description: 'Visit the unique double temple' },
          { day: 5, title: 'Aswan Sights', description: 'Philae Temple and the High Dam' },
          { day: 6, title: 'Abu Simbel', description: 'Optional excursion to Ramses II temples' },
          { day: 7, title: 'Departure', description: 'Farewell breakfast and transfer' },
        ]),
      },
      {
        title: 'Abu Simbel Adventure',
        description: 'Exclusive private tour to the magnificent Abu Simbel temples, one of Egypt\'s most iconic archaeological wonders.',
        type: 'trip',
        price: 1200,
        duration: 2,
        location: 'Abu Simbel',
        imageUrl: '/assets/tour2.png',
        images: ['/assets/tour2.png', '/assets/tour3.png'],
        maxGuests: 8,
        highlights: [
          'Private transportation to Abu Simbel',
          'Expert guide with archaeological expertise',
          'Premium hotel accommodation',
          'All entrance fees included',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Journey to Abu Simbel', description: 'Travel and temple exploration' },
          { day: 2, title: 'Return Journey', description: 'Morning visit and return' },
        ]),
      },
      {
        title: 'Pyramids & Sphinx Experience',
        description: 'VIP access to the Great Pyramids of Giza and the Sphinx with private Egyptologist guide and exclusive sunrise viewing.',
        type: 'trip',
        price: 850,
        duration: 1,
        location: 'Cairo',
        imageUrl: '/assets/tour3.png',
        images: ['/assets/tour3.png', '/assets/tour1.png'],
        maxGuests: 10,
        highlights: [
          'Sunrise access to Giza Plateau',
          'Private Egyptologist guide',
          'Luxury transportation',
          'Photography opportunities',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Pyramids Exploration', description: 'Full day exploring the wonders' },
        ]),
      },
      {
        title: 'Premium Cairo Package',
        description: 'Complete Cairo experience with luxury accommodations, private tours of pyramids, museums, and Islamic Cairo.',
        type: 'package',
        price: 4200,
        duration: 5,
        location: 'Cairo',
        imageUrl: '/assets/tour4.png',
        images: ['/assets/tour4.png', '/assets/tour3.png', '/assets/tour1.png'],
        maxGuests: 12,
        highlights: [
          '5-star luxury hotel accommodation',
          'Private tours of all major sites',
          'Egyptian Museum VIP access',
          'Traditional Egyptian dinners',
          'All transfers and entrance fees',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Arrival & Pyramids', description: 'Check-in and pyramid visit' },
          { day: 2, title: 'Egyptian Museum', description: 'Full day at the museum' },
          { day: 3, title: 'Islamic Cairo', description: 'Historic mosques and bazaars' },
          { day: 4, title: 'Saqqara & Memphis', description: 'Ancient capital exploration' },
          { day: 5, title: 'Departure', description: 'Final breakfast and transfer' },
        ]),
      },
      {
        title: 'Gourmet Nile Dining',
        description: 'Exquisite culinary journey featuring traditional Egyptian cuisine and international dishes on a luxury Nile cruise.',
        type: 'tour',
        price: 450,
        duration: 1,
        location: 'Cairo',
        imageUrl: '/assets/tour5.png',
        images: ['/assets/tour5.png'],
        maxGuests: 20,
        highlights: [
          'Multi-course gourmet dinner',
          'Traditional Egyptian dishes',
          'Live entertainment',
          'Nile cruise experience',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Evening Dinner Cruise', description: 'Luxury dining on the Nile' },
        ]),
      },
      {
        title: 'Grand Egypt Discovery',
        description: 'The ultimate 14-day luxury journey covering Cairo, Luxor, Aswan, and Abu Simbel with 5-star accommodations throughout.',
        type: 'package',
        price: 8500,
        duration: 14,
        location: 'Multiple Cities',
        imageUrl: '/assets/tour1.png',
        images: ['/assets/tour1.png', '/assets/tour2.png', '/assets/tour3.png', '/assets/tour4.png'],
        maxGuests: 16,
        highlights: [
          'Comprehensive Egypt experience',
          'All 5-star accommodations',
          'Private Egyptologist guides',
          'Domestic flights included',
          'All meals and transfers',
          'Exclusive site access',
        ],
        itinerary: JSON.stringify([
          { day: 1, title: 'Cairo Arrival', description: 'Welcome to Egypt' },
          { day: 2, title: 'Pyramids & Sphinx', description: 'Giza Plateau exploration' },
          { day: 3, title: 'Egyptian Museum', description: 'Treasures of ancient Egypt' },
          { day: 4, title: 'Flight to Luxor', description: 'Karnak Temple visit' },
          { day: 5, title: 'Valley of the Kings', description: 'Royal tombs exploration' },
          { day: 6, title: 'Nile Cruise Begins', description: 'Board luxury cruise' },
          { day: 7, title: 'Edfu Temple', description: 'Temple of Horus' },
          { day: 8, title: 'Kom Ombo', description: 'Double temple visit' },
          { day: 9, title: 'Aswan Arrival', description: 'Philae Temple' },
          { day: 10, title: 'Abu Simbel', description: 'Ramses II temples' },
          { day: 11, title: 'Aswan Exploration', description: 'Nubian village visit' },
          { day: 12, title: 'Flight to Cairo', description: 'Islamic Cairo tour' },
          { day: 13, title: 'Free Day', description: 'Shopping and leisure' },
          { day: 14, title: 'Departure', description: 'Farewell Egypt' },
        ]),
      },
    ];

    experiencesData.forEach((exp) => {
      const id = randomUUID();
      this.experiences.set(id, { ...exp, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExperiences(type?: string): Promise<Experience[]> {
    const allExperiences = Array.from(this.experiences.values());
    if (type) {
      return allExperiences.filter((exp) => exp.type === type);
    }
    return allExperiences;
  }

  async getExperience(id: string): Promise<Experience | undefined> {
    return this.experiences.get(id);
  }

  async createExperience(experience: InsertExperience): Promise<Experience> {
    const id = randomUUID();
    const newExperience: Experience = { ...experience, id, maxGuests: experience.maxGuests || 12 };
    this.experiences.set(id, newExperience);
    return newExperience;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    const sessionCart = this.carts.get(sessionId);
    if (!sessionCart) return [];
    return Array.from(sessionCart.values());
  }

  async addCartItem(sessionId: string, item: InsertCartItem): Promise<CartItem> {
    if (!this.carts.has(sessionId)) {
      this.carts.set(sessionId, new Map());
    }
    const sessionCart = this.carts.get(sessionId)!;

    const existing = Array.from(sessionCart.values()).find(
      (cartItem) => cartItem.experienceId === item.experienceId
    );

    if (existing) {
      existing.quantity += (item.quantity || 1);
      sessionCart.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const newItem: CartItem = { ...item, id, quantity: item.quantity || 1 };
    sessionCart.set(id, newItem);
    return newItem;
  }

  async updateCartItemQuantity(sessionId: string, id: string, quantity: number): Promise<CartItem | undefined> {
    const sessionCart = this.carts.get(sessionId);
    if (!sessionCart) return undefined;
    
    const item = sessionCart.get(id);
    if (item) {
      item.quantity = quantity;
      sessionCart.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeCartItem(sessionId: string, id: string): Promise<boolean> {
    const sessionCart = this.carts.get(sessionId);
    if (!sessionCart) return false;
    return sessionCart.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    this.carts.delete(sessionId);
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const newBooking: Booking = {
      ...booking,
      id,
      paymentStatus: 'pending',
      stripeSessionId: null,
      paid: false,
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingPayment(
    id: string,
    stripeSessionId: string,
    paid: boolean
  ): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.stripeSessionId = stripeSessionId;
      booking.paid = paid;
      booking.paymentStatus = paid ? 'completed' : 'pending';
      this.bookings.set(id, booking);
      return booking;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
