import express from "express";
import { db } from "../config/db.js";
import { recipeViewsTable, usersTable } from "../db/schema.js";
import { eq, count } from "drizzle-orm";

const router = express.Router();

const MAX_FREE_VIEWS = 3;

router.post("/view", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
      return res.status(400).json({
        error: "userId and recipeId are required",
      });
    }

    // 1. Get user
    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)));

    if (userResult.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const user = userResult[0];

    // 2. Check active Premium subscription
    const isSubscriptionActive =
      user.subscriptionTier !== "FREE" &&
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) > new Date();

    if (isSubscriptionActive) {
      return res.json({
        isPremium: true,
        limitReached: false,
        allowed: true,
      });
    }

    // 3. Count total free views
    const totalViewsRes = await db
      .select({ value: count() })
      .from(recipeViewsTable)
      .where(eq(recipeViewsTable.userId, Number(userId)));

    const totalViews = Number(totalViewsRes[0]?.value || 0);

    // 4. Free view limit reached
    if (totalViews >= MAX_FREE_VIEWS) {
      return res.json({
        isPremium: false,
        limitReached: true,
        allowed: false,
        views: totalViews,
      });
    }

    // 5. Record view
    await db.insert(recipeViewsTable).values({
      userId: Number(userId),
      recipeId: Number(recipeId),
    });

    return res.json({
      isPremium: false,
      limitReached: false,
      allowed: true,
      views: totalViews + 1,
    });
  } catch (err) {
    console.error("Recipe view error:", err);

    return res.status(500).json({
      error: "Unable to record view.",
    });
  }
});

export default router;
