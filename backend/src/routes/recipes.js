import express from "express";
import { db } from "../config/db.js";
import { recipesTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      recipeId,
      title,
      ingredients,
      instructions,
      image,
      category,
      area,
      cookTime,
      servings,
    } = req.body;

    if (!userId || !recipeId || !title || !ingredients || !instructions) {
      return res.status(400).json({ error: "Missing required fields for recipe tracking." });
    }

    const [newRecipe] = await db
      .insert(recipesTable)
      .values({
        userId,
        recipeId,
        title,
        ingredients,
        instructions,
        image,
        category,
        area,
        cookTime,
        servings,
      })
      .returning();

    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Recipe tracking error:", error);
    return res.status(500).json({ error: "Unable to track recipe." });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const trackedRecipes = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.userId, Number(userId)));

    return res.status(200).json(trackedRecipes);
  } catch (error) {
    console.error("Fetch tracked recipes error:", error);
    return res.status(500).json({ error: "Unable to fetch tracked recipes." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [recipe] = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.id, Number(id)));

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Fetch recipe error:", error);
    return res.status(500).json({ error: "Unable to fetch recipe." });
  }
});

export default router;
