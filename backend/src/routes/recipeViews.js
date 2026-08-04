// import express from "express";

// import { db } from "../config/db.js";
// import { recipeViewsTable } from "../db/schema.js";
// import { and, eq, count } from "drizzle-orm";

// const router = express.Router();

// /*
// ==========================================
// POST /api/recipe-views/view
// Records one unique view per user
// ==========================================
// */
// router.post("/view", async (req, res) => {
//   try {
//     const { userId, recipeId } = req.body;

//     if (!userId || !recipeId) {
//       return res.status(400).json({
//         error: "userId and recipeId are required.",
//       });
//     }

//     // Check if this user has already viewed this recipe
//     const existingView = await db
//       .select()
//       .from(recipeViewsTable)
//       .where(
//         and(
//           eq(recipeViewsTable.userId, Number(userId)),
//           eq(recipeViewsTable.recipeId, Number(recipeId))
//         )
//       );

//     // Already viewed → don't add another row
//     if (existingView.length > 0) {
//       return res.status(200).json({
//         success: true,
//         message: "View already recorded.",
//       });
//     }

//     // First time viewing → save it
//     await db.insert(recipeViewsTable).values({
//       userId: Number(userId),
//       recipeId: Number(recipeId),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "View recorded successfully.",
//     });
//   } catch (error) {
//     console.error("Record View Error:", error);

//     return res.status(500).json({
//       error: "Unable to record view.",
//     });
//   }
// });

// /*
// ==========================================
// GET /api/recipe-views/views/:recipeId
// Returns total unique views
// ==========================================
// */
// router.get("/views/:recipeId", async (req, res) => {
//   try {
//     const { recipeId } = req.params;

//     const result = await db
//       .select({
//         totalViews: count(),
//       })
//       .from(recipeViewsTable)
//       .where(eq(recipeViewsTable.recipeId, Number(recipeId)));

//     return res.status(200).json({
//       views: Number(result[0].totalViews),
//     });
//   } catch (error) {
//     console.error("Fetch Views Error:", error);

//     return res.status(500).json({
//       error: "Unable to fetch views.",
//     });
//   }
// });

// export default router;

import express from "express";
import { db } from "../config/db.js";
import { recipeViewsTable, usersTable } from "../db/schema.js";
import { eq, count } from "drizzle-orm";

const router = express.Router();
const MAX_FREE_VIEWS = 3;

router.post("/view", async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // 1. Check user premium status
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)));
    if (user[0]?.isPremium) {
      return res.json({ isPremium: true, limitReached: false });
    }

    // 2. Count total views for free user
    const totalViewsRes = await db
      .select({ value: count() })
      .from(recipeViewsTable)
      .where(eq(recipeViewsTable.userId, Number(userId)));

    const totalViews = totalViewsRes[0]?.value || 0;

    if (totalViews >= MAX_FREE_VIEWS) {
      return res.json({ isPremium: false, limitReached: true });
    }

    // Insert view if under limit
    await db.insert(recipeViewsTable).values({
      userId: Number(userId),
      recipeId: Number(recipeId),
    });

    res.json({ isPremium: false, limitReached: false, views: totalViews + 1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
