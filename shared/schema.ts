import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  price: real("price").notNull(),
  duration: integer("duration").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  images: text("images").array().notNull(),
  maxGuests: integer("max_guests").notNull().default(12),
  highlights: text("highlights").array().notNull(),
  itinerary: text("itinerary").notNull(),
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
});

export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  experienceId: varchar("experience_id").notNull(),
  title: text("title").notNull(),
  price: real("price").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  cartItemIds: text("cart_item_ids").array().notNull(),
  travelers: integer("travelers").notNull(),
  startDate: text("start_date").notNull(),
  totalAmount: real("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default('pending'),
  stripeSessionId: text("stripe_session_id"),
  paid: boolean("paid").notNull().default(false),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  paymentStatus: true,
  stripeSessionId: true,
  paid: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
