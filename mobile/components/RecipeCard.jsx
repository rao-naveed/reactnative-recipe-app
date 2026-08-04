import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { recipeCardStyles, CARD_ACCENT } from "../assets/styles/home.styles";
import { getCardWidth, getNumColumns } from "../constants/responsive";

export default function RecipeCard({ recipe }) {
  const router = useRouter();
  // Recomputed on every render using the live window width, so the card
  // actually resizes when the browser window is resized or the device
  // is rotated — a value baked into StyleSheet.create() at import time
  // can't do that.
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);
  const cardWidth = getCardWidth(width, numColumns);

  return (
    <View style={[recipeCardStyles.shadowLayer, { width: cardWidth }]}>
      <TouchableOpacity
        style={recipeCardStyles.container}
        onPress={() => router.push(`/recipe/${recipe.id}`)}
        activeOpacity={0.85}
      >
        <View style={recipeCardStyles.imageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={recipeCardStyles.image}
            contentFit="cover"
            transition={300}
          />

          {recipe.category && (
            <View
              style={[
                recipeCardStyles.flavorTag,
                { backgroundColor: CARD_ACCENT.base },
              ]}
            >
              <Text style={recipeCardStyles.flavorTagText}>
                {recipe.category}
              </Text>
            </View>
          )}
        </View>

        <View style={recipeCardStyles.content}>
          <Text style={recipeCardStyles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          {recipe.description && (
            <Text style={recipeCardStyles.description} numberOfLines={2}>
              {recipe.description || " "}
            </Text>
          )}

          <View style={recipeCardStyles.footer}>
            {recipe.cookTime && (
              <View
                style={[recipeCardStyles.pill, { backgroundColor: CARD_ACCENT.soft }]}
              >
                <Ionicons name="time-outline" size={12} color={CARD_ACCENT.base} />
                <Text style={[recipeCardStyles.pillText, { color: CARD_ACCENT.base }]}>
                  {recipe.cookTime}
                </Text>
              </View>
            )}
            {recipe.servings && (
              <View
                style={[recipeCardStyles.pill, { backgroundColor: CARD_ACCENT.soft }]}
              >
                <Ionicons name="people-outline" size={12} color={CARD_ACCENT.base} />
                <Text style={[recipeCardStyles.pillText, { color: CARD_ACCENT.base }]}>
                  {recipe.servings}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}