// import express from "express";
// import Stripe from "stripe";
// import { ENV } from "../config/env.js";

// const router = express.Router();
// const stripe = new Stripe(
//   ENV.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY,
// );

// // POST: /api/payments/create-checkout-session
// router.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { userId, amount } = req.body;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Premium Recipe Access",
//             },
//             unit_amount: amount ? amount * 100 : 999, // $9.99
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:5001/api/health", // Ya app ka success screen
//       cancel_url: "http://localhost:5001/api/health",
//       metadata: {
//         userId: userId || "guest_user",
//       },
//     });

//     return res.status(200).json({ url: session.url });
//   } catch (error) {
//     console.error("Stripe Error:", error);
//     return res.status(500).json({ error: "Failed to create checkout session" });
//   }
// });

// export default router;

import express from "express";
import Stripe from "stripe";
import { db } from "../config/db.js"; // Aapka Drizzle/DB setup
import { usersTable } from "../db/schema.js"; // Aapka Users Table
import { eq } from "drizzle-orm";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Recipe Access (Unlimited)",
            },
            unit_amount: amount * 100, // $10 -> 1000 cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Mobile / Web redirect back URLs
      success_url: `http://localhost:5001/api/payments/success?userId=${userId}`,
      cancel_url: `http://localhost:5001/api/payments/cancel`,
      metadata: { userId: String(userId) },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Direct Redirect Success Handler (DB update mark premium)
router.get("/success", async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      // User ko Premium update kar dein DB mein
      await db
        .update(usersTable)
        .set({ isPremium: true })
        .where(eq(usersTable.id, Number(userId)));
    }

    res.send(
      "<h1>✅ Payment Successful! Aap Premium user ban chuke hain. App par wapas jayein.</h1>",
    );
  } catch (err) {
    res.status(500).send("Error updating user status.");
  }
});

export default router;
