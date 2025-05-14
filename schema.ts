import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  profilePicture: text("profile_picture"),
  profession: text("profession"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  profession: true,
  bio: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Wellness Dimensions Table
export const wellnessDimensions = pgTable("wellness_dimensions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
  colorHex: text("color_hex"),
  order: integer("order").notNull(),
});

export const insertWellnessDimensionSchema = createInsertSchema(wellnessDimensions).pick({
  name: true,
  description: true,
  iconName: true,
  colorHex: true,
  order: true,
});

export type InsertWellnessDimension = z.infer<typeof insertWellnessDimensionSchema>;
export type WellnessDimension = typeof wellnessDimensions.$inferSelect;

// Sub-dimensions Table
export const subDimensions = pgTable("sub_dimensions", {
  id: serial("id").primaryKey(),
  dimensionId: integer("dimension_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  iconName: text("icon_name"),
});

export const insertSubDimensionSchema = createInsertSchema(subDimensions).pick({
  dimensionId: true,
  name: true,
  description: true,
  iconName: true,
});

export type InsertSubDimension = z.infer<typeof insertSubDimensionSchema>;
export type SubDimension = typeof subDimensions.$inferSelect;

// User Wellness Scores Table
export const userWellnessScores = pgTable("user_wellness_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dimensionId: integer("dimension_id").notNull(),
  score: integer("score").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserWellnessScoreSchema = createInsertSchema(userWellnessScores).pick({
  userId: true,
  dimensionId: true,
  score: true,
});

export type InsertUserWellnessScore = z.infer<typeof insertUserWellnessScoreSchema>;
export type UserWellnessScore = typeof userWellnessScores.$inferSelect;

// User Sub-dimension Scores Table
export const userSubDimensionScores = pgTable("user_sub_dimension_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  subDimensionId: integer("sub_dimension_id").notNull(),
  score: integer("score").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSubDimensionScoreSchema = createInsertSchema(userSubDimensionScores).pick({
  userId: true,
  subDimensionId: true,
  score: true,
});

export type InsertUserSubDimensionScore = z.infer<typeof insertUserSubDimensionScoreSchema>;
export type UserSubDimensionScore = typeof userSubDimensionScores.$inferSelect;

// Wellness Activities Table
export const wellnessActivities = pgTable("wellness_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dimensionId: integer("dimension_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWellnessActivitySchema = createInsertSchema(wellnessActivities).pick({
  userId: true,
  dimensionId: true,
  title: true,
  description: true,
  date: true,
});

export type InsertWellnessActivity = z.infer<typeof insertWellnessActivitySchema>;
export type WellnessActivity = typeof wellnessActivities.$inferSelect;

// Product Categories Table
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dimensionId: integer("dimension_id"),
  description: text("description"),
  colorName: text("color_name"),
});

export const insertProductCategorySchema = createInsertSchema(productCategories).pick({
  name: true,
  dimensionId: true,
  description: true,
  colorName: true,
});

export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type ProductCategory = typeof productCategories.$inferSelect;

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Stored in cents
  categoryId: integer("category_id").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating"),
  reviewCount: integer("review_count"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  categoryId: true,
  imageUrl: true,
  rating: true,
  reviewCount: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Research Articles Table
export const researchArticles = pgTable("research_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal"),
  publicationDate: text("publication_date"),
  dimensionId: integer("dimension_id"),
  imageUrl: text("image_url"),
  contentUrl: text("content_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResearchArticleSchema = createInsertSchema(researchArticles).pick({
  title: true,
  abstract: true,
  authors: true,
  journal: true,
  publicationDate: true,
  dimensionId: true,
  imageUrl: true,
  contentUrl: true,
});

export type InsertResearchArticle = z.infer<typeof insertResearchArticleSchema>;
export type ResearchArticle = typeof researchArticles.$inferSelect;

// User Wellness Goals Table
export const userWellnessGoals = pgTable("user_wellness_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dimensionId: integer("dimension_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: timestamp("target_date"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserWellnessGoalSchema = createInsertSchema(userWellnessGoals).pick({
  userId: true,
  dimensionId: true,
  title: true,
  description: true,
  targetDate: true,
  completed: true,
});

export type InsertUserWellnessGoal = z.infer<typeof insertUserWellnessGoalSchema>;
export type UserWellnessGoal = typeof userWellnessGoals.$inferSelect;

// Blockchain Wallets Table
export const blockchainWallets = pgTable("blockchain_wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  walletType: text("wallet_type").notNull(),
  connectedAt: timestamp("connected_at").defaultNow(),
});

export const insertBlockchainWalletSchema = createInsertSchema(blockchainWallets).pick({
  userId: true,
  walletAddress: true,
  walletType: true,
});

export type InsertBlockchainWallet = z.infer<typeof insertBlockchainWalletSchema>;
export type BlockchainWallet = typeof blockchainWallets.$inferSelect;

// User Data Settings Table
export const userDataSettings = pgTable("user_data_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  shareAnonymousData: boolean("share_anonymous_data").default(true),
  contributeToResearch: boolean("contribute_to_research").default(true),
  profileVisibility: text("profile_visibility").default("private"),
  blockchainStorage: boolean("blockchain_storage").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserDataSettingSchema = createInsertSchema(userDataSettings).pick({
  userId: true,
  shareAnonymousData: true,
  contributeToResearch: true,
  profileVisibility: true,
  blockchainStorage: true,
});

export type InsertUserDataSetting = z.infer<typeof insertUserDataSettingSchema>;
export type UserDataSetting = typeof userDataSettings.$inferSelect;

// User Notification Settings Table
export const userNotificationSettings = pgTable("user_notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(true),
  productUpdates: boolean("product_updates").default(false),
  researchUpdates: boolean("research_updates").default(true),
  marketplaceOffers: boolean("marketplace_offers").default(false),
  wellnessReminders: boolean("wellness_reminders").default(true),
  emailFrequency: text("email_frequency").default("weekly"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserNotificationSettingSchema = createInsertSchema(userNotificationSettings).pick({
  userId: true,
  emailNotifications: true,
  pushNotifications: true,
  productUpdates: true,
  researchUpdates: true,
  marketplaceOffers: true,
  wellnessReminders: true,
  emailFrequency: true,
});

export type InsertUserNotificationSetting = z.infer<typeof insertUserNotificationSettingSchema>;
export type UserNotificationSetting = typeof userNotificationSettings.$inferSelect;
