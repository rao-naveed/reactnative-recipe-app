import express from "express";
import Stripe from "stripe";
import { db } from "../config/db.js";
import { usersTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        error: "userId and amount are required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "Premium Recipe Access (Unlimited)",
            },

            unit_amount: Math.round(Number(amount) * 100),
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      // Stripe payment successful hone ke baad
      // Vercel backend ke success endpoint par jayega
      success_url: `https://backend-rho-rosy-70.vercel.app/api/payments/success?userId=${userId}`,

      cancel_url: "https://backend-rho-rosy-70.vercel.app/api/payments/cancel",

      metadata: {
        userId: String(userId),
      },
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

// 2. Payment Success
router.get("/success", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send("User ID is missing.");
    }

    // User ko Premium subscription dein
    // Testing ke liye 30 days
    const subscriptionExpiresAt = new Date();

    subscriptionExpiresAt.setDate(subscriptionExpiresAt.getDate() + 30);

    await db
      .update(usersTable)
      .set({
        subscriptionTier: "PREMIUM",
        subscriptionExpiresAt,
      })
      .where(eq(usersTable.id, Number(userId)));

    res.send(`
      <html>
        <head>
          <title>Payment Successful</title>
        </head>

        <body>
          <h1>✅ Payment Successful!</h1>
          <p>You are now a Premium user.</p>
          <p>You can return to the app.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Payment Success Error:", err);

    res.status(500).send("Error updating user subscription.");
  }
});

// 3. Payment Cancel
router.get("/cancel", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Payment Cancelled</title>
      </head>

      <body>
        <h1>❌ Payment Cancelled</h1>
        <p>No payment was completed.</p>
        <p>You can return to the app.</p>
      </body>
    </html>
  `);
});

export default router;
