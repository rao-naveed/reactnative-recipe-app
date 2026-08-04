import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { COLORS } from "../constants/colors";
import { createRecipeStyles as styles } from "../assets/styles/create-recipe.styles";
import { addUserRecipe } from "../services/userRecipesStore";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const CreateRecipeScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !image.trim() || !cookTime.trim() || !ingredients.trim() ||
      !instructions.trim() || !category.trim() || !servings.trim()) {
      Alert.alert("Missing information", "Please fill in every field before saving.");
      return;
    }

    setSaving(true);
    try {
      const newRecipe = {
        id: `user-${Date.now()}`,
        title: title.trim(),
        image: image.trim(),
        description: instructions.trim().slice(0, 120) + "...",
        cookTime: cookTime.trim(),
        servings: servings.trim(),
        category: category.trim(),
        difficulty,
        ingredients: ingredients
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        instructions: instructions
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        isUserCreated: true,
        createdAt: Date.now(),
      };

      await addUserRecipe(newRecipe);

      Alert.alert("Recipe added", "Your recipe was saved and now appears on the Home screen.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving recipe:", error);
      Alert.alert("Error", "Something went wrong while saving your recipe.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Recipe</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* IMAGE */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Image</Text>
          <View style={styles.imagePickerBox}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} contentFit="cover" />
            ) : (
              <>
                <Ionicons name="image-outline" size={36} color={COLORS.textLight} />
                <Text style={styles.imagePickerText}>Paste an image URL below</Text>
              </>
            )}
          </View>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/photo.jpg"
            placeholderTextColor={COLORS.textLight}
            value={image}
            onChangeText={setImage}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        {/* NAME */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Recipe Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Creamy Garlic Pasta"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* COOK TIME + SERVINGS */}
        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Cooking Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30 minutes"
              placeholderTextColor={COLORS.textLight}
              value={cookTime}
              onChangeText={setCookTime}
            />
          </View>
          <View style={[styles.fieldGroup, styles.rowItem]}>
            <Text style={styles.label}>Servings</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4"
              placeholderTextColor={COLORS.textLight}
              value={servings}
              onChangeText={setServings}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* CATEGORY */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chicken, Dessert, Vegan"
            placeholderTextColor={COLORS.textLight}
            value={category}
            onChangeText={setCategory}
          />
        </View>

        {/* DIFFICULTY */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.difficultyRow}>
            {DIFFICULTIES.map((level) => {
              const selected = difficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.difficultyChip, selected && styles.difficultyChipSelected]}
                  onPress={() => setDifficulty(level)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.difficultyChipText,
                      selected && styles.difficultyChipTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* INGREDIENTS */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ingredients</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={"One ingredient per line, e.g.\n2 cups flour\n1 tsp salt"}
            placeholderTextColor={COLORS.textLight}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
          />
          <Text style={styles.helperText}>Enter each ingredient on its own line.</Text>
        </View>

        {/* INSTRUCTIONS */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={"One step per line, e.g.\nPreheat oven to 200°C\nMix dry ingredients"}
            placeholderTextColor={COLORS.textLight}
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
          <Text style={styles.helperText}>Enter each step on its own line.</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.submitButtonText}>{saving ? "Saving..." : "Save Recipe"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateRecipeScreen;
