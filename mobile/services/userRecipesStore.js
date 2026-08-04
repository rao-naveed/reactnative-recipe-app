import { getJSON, setJSON } from "./localStorage";

const KEY = "userCreatedRecipes";

export async function getUserRecipes() {
  return getJSON(KEY, []);
}

export async function addUserRecipe(recipe) {
  const recipes = await getUserRecipes();
  const nextRecipes = [recipe, ...recipes];
  await setJSON(KEY, nextRecipes);
  return nextRecipes;
}

export async function getUserRecipeById(id) {
  const recipes = await getUserRecipes();
  return recipes.find((recipe) => String(recipe.id) === String(id)) || null;
}

export function isUserRecipeId(id) {
  return typeof id === "string" && id.startsWith("user-");
}
