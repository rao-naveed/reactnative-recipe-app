import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { sql } from "drizzle-orm";
import { favoritesTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";
import recipeViewsRouter from "./routes/recipeViews.js";
import paymentsRouter from "./routes/payments.js";

const app = express();
const PORT = ENV.PORT || 5001;

// Initialize Stripe instance
const stripe = new Stripe(
  ENV.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY,
);

if (ENV.NODE_ENV === "production") job.start();

app.use(cors());

// =========================================================================
// 0. ROOT ROUTE FOR TESTING (Vercel Test Route)
// =========================================================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Server is Live and Running Successfully!",
    status: "Active",
  });
});

// =========================================================================
// 1. STRIPE WEBHOOK ENDPOINT
// IMPORTANT: Must be placed BEFORE express.json() because Stripe needs raw body
// =========================================================================
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret =
      ENV.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // Fallback for local testing without webhook secret
        event = JSON.parse(req.body.toString());
      }
    } catch (err) {
      console.error("❌ Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the payment success event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      console.log(`✅ Payment Successful for User ID: ${userId}`);
    }

    res.status(200).json({ received: true });
  },
);

// =========================================================================
// 2. MIDDLEWARES & ROUTES (Parse JSON for all other API endpoints)
// =========================================================================
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);
app.use("/api/recipe-views", recipeViewsRouter);
app.use("/api/payments", paymentsRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

// =========================================================================
// 3. FAVORITES ROUTES
// =========================================================================
app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingFavorite = await db
      .select()
      .from(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, Number(userId)),
          eq(favoritesTable.recipeId, Number(recipeId)),
        ),
      );

    if (existingFavorite.length > 0) {
      return res.status(200).json({
        alreadyExists: true,
        favorite: existingFavorite[0],
      });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(newFavorite[0]);
  } catch (error) {
    console.log("Error adding favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId)),
        ),
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Export app for Vercel serverless environment
export default app;

// =========================================================================
// 4. START SERVER (Local Development)
// =========================================================================
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on PORT:", PORT);
  });
}
