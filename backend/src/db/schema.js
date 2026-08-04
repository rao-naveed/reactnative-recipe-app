import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// 1. Users Table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 })
    .notNull()
    .unique(),

  password: text("password").notNull(),

  // Email Verification
  verificationCode: varchar("verification_code", {
    length: 6,
  }),

  isVerified: boolean("is_verified")
    .notNull()
    .default(false),

  verifiedAt: timestamp("verified_at"),

subscriptionTier: varchar("subscription_tier", { length: 20 })
  .default("FREE")
  .notNull(),

subscriptionExpiresAt: timestamp("subscription_expires_at"),

freeViewsUsed: integer("free_views_used")
  .default(0)
  .notNull(),

freeViewsMonth: varchar("free_views_month", {
  length: 7,
}),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

// 2. Recipes Table
export const recipesTable = pgTable("recipes", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  ingredients: text("ingredients").notNull(),

  instructions: text("instructions").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

// 3. Favorites Table
export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),

  // External API recipe ID (NOT linked to recipes table)
  recipeId: integer("recipe_id").notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  image: text("image"),

  cookTime: integer("cook_time"),

  servings: integer("servings"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const recipeViewsTable = pgTable(
  "recipe_views",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),

    // TheMealDB recipe ID
    recipeId: integer("recipe_id").notNull(),

    viewedAt: timestamp("viewed_at")
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueUserRecipeView: unique().on(table.userId, table.recipeId),
  })
);