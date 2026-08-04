import { getJSON, setJSON } from "./localStorage";

const keyFor = (userId) => `favorites:${userId}`;

export async function getFavorites(userId) {
  if (!userId) return [];
  return getJSON(keyFor(userId), []);
}

export async function isFavorite(userId, recipeId) {
  if (!userId) return false;
  const favorites = await getFavorites(userId);
  return favorites.some((recipe) => String(recipe.id) === String(recipeId));
}

export async function addFavorite(userId, recipe) {
  if (!userId || !recipe) return [];
  const favorites = await getFavorites(userId);
  const alreadySaved = favorites.some((item) => String(item.id) === String(recipe.id));
  const nextFavorites = alreadySaved ? favorites : [recipe, ...favorites];
  await setJSON(keyFor(userId), nextFavorites);
  return nextFavorites;
}

export async function removeFavorite(userId, recipeId) {
  if (!userId) return [];
  const favorites = await getFavorites(userId);
  const nextFavorites = favorites.filter((item) => String(item.id) !== String(recipeId));
  await setJSON(keyFor(userId), nextFavorites);
  return nextFavorites;
}
