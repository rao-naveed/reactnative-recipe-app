// import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { getItem } from "../../utils/storage";
// import { API_URL } from "../../constants/api";
// import { MealAPI } from "../../services/mealAPI";
// import LoadingSpinner from "../../components/LoadingSpinner";
// import { Image } from "expo-image";

// import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
// import { LinearGradient } from "expo-linear-gradient";
// import { COLORS } from "../../constants/colors";

// import { Ionicons } from "@expo/vector-icons";
// import { WebView } from "react-native-webview";

// const RecipeDetailScreen = () => {
//   const { id: recipeId } = useLocalSearchParams();
//   const router = useRouter();

//   const [recipe, setRecipe] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSaved, setIsSaved] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [localUserId, setLocalUserId] = useState(null);
//   const userId = localUserId;
//   const [views, setViews] = useState(0);

//   useEffect(() => {
//     const loadUserId = async () => {
//       try {
//         const storedId = await getItem("userId");
//         if (storedId) setLocalUserId(storedId);
//       } catch (error) {
//         console.error("Error loading userId:", error);
//       }
//     };
//     loadUserId();
//   }, []);

//   useEffect(() => {
//     const checkIfSaved = async () => {
//       if (!userId) return;

//       try {
//         const response = await fetch(`${API_URL}/favorites/${userId}`);
//         const favorites = await response.json();
//         const isRecipeSaved = favorites.some(
//           (fav) => fav.recipeId === parseInt(recipeId),
//         );
//         setIsSaved(isRecipeSaved);
//       } catch (error) {
//         console.error("Error checking if recipe is saved:", error);
//       }
//     };

//     const loadRecipeDetail = async () => {
//       setLoading(true);
//       try {
//         const mealData = await MealAPI.getMealById(recipeId);
//         if (mealData) {
//           const transformedRecipe = MealAPI.transformMealData(mealData);

//           const recipeWithVideo = {
//             ...transformedRecipe,
//             youtubeUrl: mealData.strYoutube || null,
//           };

//           setRecipe(recipeWithVideo);
//         }
//       } catch (error) {
//         console.error("Error loading recipe detail:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkIfSaved();
//     loadRecipeDetail();
//     recordRecipeView();
//   }, [recipeId, userId]);

//   const recordRecipeView = async () => {
//     if (!userId) return;

//     try {
//       // Record the view (only once per user)
//       await fetch(`${API_URL}/recipe-views/view`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: Number(userId),
//           recipeId: Number(recipeId),
//         }),
//       });

//       // Fetch total views
//       const response = await fetch(`${API_URL}/recipe-views/views/${recipeId}`);

//       const data = await response.json();

//       setViews(data.views || 0);
//     } catch (error) {
//       console.log("View Error:", error);
//     }
//   };

//   const getYouTubeEmbedUrl = (url) => {
//     // example url: https://www.youtube.com/watch?v=mTvlmY4vCug
//     const videoId = url.split("v=")[1];
//     return `https://www.youtube.com/embed/${videoId}`;
//   };

//   const handleToggleSave = async () => {
//     if (!userId) {
//       Alert.alert("Authentication Required", "Please sign in to save recipes.");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       if (isSaved) {
//         // remove from favorites
//         const response = await fetch(
//           `${API_URL}/favorites/${userId}/${recipeId}`,
//           {
//             method: "DELETE",
//           },
//         );
//         if (!response.ok) throw new Error("Failed to remove recipe");

//         setIsSaved(false);
//       } else {
//         // add to favorites
//         const response = await fetch(`${API_URL}/favorites`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userId,
//             recipeId: parseInt(recipeId),
//             title: recipe.title,
//             image: recipe.image,
//             cookTime: parseInt(recipe.cookTime) || 0,
//             servings: recipe.servings,
//           }),
//         });

//         if (!response.ok) throw new Error("Failed to save recipe");

//         const recipeTrackResponse = await fetch(`${API_URL}/recipes`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userId: Number(userId),
//             recipeId: parseInt(recipeId),
//             title: recipe.title,
//             ingredients: recipe.ingredients.join("\n"),
//             instructions: recipe.instructions.join("\n"),
//             image: recipe.image,
//             category: recipe.category,
//             area: recipe.area,
//             cookTime: parseInt(recipe.cookTime) || 0,
//             servings: recipe.servings,
//           }),
//         });

//         if (!recipeTrackResponse.ok) throw new Error("Failed to track recipe");
//         setIsSaved(true);
//       }
//     } catch (error) {
//       console.error("Error toggling recipe save:", error);
//       Alert.alert("Error", `Something went wrong. Please try again.`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) return <LoadingSpinner message="Loading recipe details..." />;

//   return (
//     <View style={recipeDetailStyles.container}>
//       <View style={recipeDetailStyles.floatingButtons}>
//         <TouchableOpacity
//           style={recipeDetailStyles.floatingButton}
//           onPress={() => {
//             if (router.canGoBack()) {
//               router.back();
//             } else {
//               router.replace("/(tabs)");
//             }
//           }}
//         >
//           <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             recipeDetailStyles.floatingButton,
//             { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
//           ]}
//           onPress={handleToggleSave}
//           disabled={isSaving}
//         >
//           <Ionicons
//             name={
//               isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"
//             }
//             size={24}
//             color={COLORS.white}
//           />
//         </TouchableOpacity>
//       </View>
//       <ScrollView>
//         {/* HEADER */}
//         <View style={recipeDetailStyles.headerContainer}>
//           <View style={recipeDetailStyles.imageContainer}>
//             <Image
//               source={{ uri: recipe.image }}
//               style={recipeDetailStyles.headerImage}
//               contentFit="cover"
//             />
//           </View>

//           <LinearGradient
//             colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
//             style={recipeDetailStyles.gradientOverlay}
//           />

//           {/* Title Section */}
//           <View style={recipeDetailStyles.titleSection}>
//             <View style={recipeDetailStyles.categoryBadge}>
//               <Text style={recipeDetailStyles.categoryText}>
//                 {recipe.category}
//               </Text>
//             </View>
//             <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
//             {recipe.area && (
//               <View style={recipeDetailStyles.locationRow}>
//                 <Ionicons name="location" size={16} color={COLORS.white} />
//                 <Text style={recipeDetailStyles.locationText}>
//                   {recipe.area} Cuisine
//                 </Text>
//               </View>
//             )}
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginTop: 8,
//               }}
//             >
//               <Ionicons name="eye-outline" size={18} color="white" />
//               <Text
//                 style={{
//                   color: "white",
//                   marginLeft: 6,
//                   fontSize: 15,
//                   fontWeight: "600",
//                 }}
//               >
//                 {views} Views
//               </Text>
//             </View>
//           </View>
//         </View>

//         <View style={recipeDetailStyles.contentSection}>
//           {/* QUICK STATS */}
//           <View style={recipeDetailStyles.statsContainer}>
//             <View style={recipeDetailStyles.statCard}>
//               <LinearGradient
//                 colors={["#FF6B6B", "#FF8E53"]}
//                 style={recipeDetailStyles.statIconContainer}
//               >
//                 <Ionicons name="time" size={20} color={COLORS.white} />
//               </LinearGradient>
//               <Text style={recipeDetailStyles.statValue}>
//                 {recipe.cookTime}
//               </Text>
//               <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
//             </View>

//             <View style={recipeDetailStyles.statCard}>
//               <LinearGradient
//                 colors={["#4ECDC4", "#44A08D"]}
//                 style={recipeDetailStyles.statIconContainer}
//               >
//                 <Ionicons name="people" size={20} color={COLORS.white} />
//               </LinearGradient>
//               <Text style={recipeDetailStyles.statValue}>
//                 {recipe.servings}
//               </Text>
//               <Text style={recipeDetailStyles.statLabel}>Servings</Text>
//             </View>
//           </View>

//           {recipe.youtubeUrl && (
//             <View style={recipeDetailStyles.sectionContainer}>
//               <View style={recipeDetailStyles.sectionTitleRow}>
//                 <LinearGradient
//                   colors={["#FF0000", "#CC0000"]}
//                   style={recipeDetailStyles.sectionIcon}
//                 >
//                   <Ionicons name="play" size={16} color={COLORS.white} />
//                 </LinearGradient>

//                 <Text style={recipeDetailStyles.sectionTitle}>
//                   Video Tutorial
//                 </Text>
//               </View>

//               <View style={recipeDetailStyles.videoCard}>
//                 <WebView
//                   style={recipeDetailStyles.webview}
//                   source={{ uri: getYouTubeEmbedUrl(recipe.youtubeUrl) }}
//                   allowsFullscreenVideo
//                   mediaPlaybackRequiresUserAction={false}
//                 />
//               </View>
//             </View>
//           )}

//           {/* INGREDIENTS SECTION */}
//           <View style={recipeDetailStyles.sectionContainer}>
//             <View style={recipeDetailStyles.sectionTitleRow}>
//               <LinearGradient
//                 colors={[COLORS.primary, COLORS.primary + "80"]}
//                 style={recipeDetailStyles.sectionIcon}
//               >
//                 <Ionicons name="list" size={16} color={COLORS.white} />
//               </LinearGradient>
//               <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
//               <View style={recipeDetailStyles.countBadge}>
//                 <Text style={recipeDetailStyles.countText}>
//                   {recipe.ingredients.length}
//                 </Text>
//               </View>
//             </View>

//             <View style={recipeDetailStyles.ingredientsGrid}>
//               {recipe.ingredients.map((ingredient, index) => (
//                 <View key={index} style={recipeDetailStyles.ingredientCard}>
//                   <View style={recipeDetailStyles.ingredientNumber}>
//                     <Text style={recipeDetailStyles.ingredientNumberText}>
//                       {index + 1}
//                     </Text>
//                   </View>
//                   <Text style={recipeDetailStyles.ingredientText}>
//                     {ingredient}
//                   </Text>
//                   <View style={recipeDetailStyles.ingredientCheck}>
//                     <Ionicons
//                       name="checkmark-circle-outline"
//                       size={20}
//                       color={COLORS.textLight}
//                     />
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* INSTRUCTIONS SECTION */}
//           <View style={recipeDetailStyles.sectionContainer}>
//             <View style={recipeDetailStyles.sectionTitleRow}>
//               <LinearGradient
//                 colors={["#9C27B0", "#673AB7"]}
//                 style={recipeDetailStyles.sectionIcon}
//               >
//                 <Ionicons name="book" size={16} color={COLORS.white} />
//               </LinearGradient>
//               <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
//               <View style={recipeDetailStyles.countBadge}>
//                 <Text style={recipeDetailStyles.countText}>
//                   {recipe.instructions.length}
//                 </Text>
//               </View>
//             </View>

//             <View style={recipeDetailStyles.instructionsContainer}>
//               {recipe.instructions.map((instruction, index) => (
//                 <View key={index} style={recipeDetailStyles.instructionCard}>
//                   <LinearGradient
//                     colors={[COLORS.primary, COLORS.primary + "CC"]}
//                     style={recipeDetailStyles.stepIndicator}
//                   >
//                     <Text style={recipeDetailStyles.stepNumber}>
//                       {index + 1}
//                     </Text>
//                   </LinearGradient>
//                   <View style={recipeDetailStyles.instructionContent}>
//                     <Text style={recipeDetailStyles.instructionText}>
//                       {instruction}
//                     </Text>
//                     <View style={recipeDetailStyles.instructionFooter}>
//                       <Text style={recipeDetailStyles.stepLabel}>
//                         Step {index + 1}
//                       </Text>
//                       <TouchableOpacity
//                         style={recipeDetailStyles.completeButton}
//                       >
//                         <Ionicons
//                           name="checkmark"
//                           size={16}
//                           color={COLORS.primary}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           </View>

//           <TouchableOpacity
//             style={recipeDetailStyles.primaryButton}
//             onPress={handleToggleSave}
//             disabled={isSaving}
//           >
//             <LinearGradient
//               colors={[COLORS.primary, COLORS.primary + "CC"]}
//               style={recipeDetailStyles.buttonGradient}
//             >
//               <Ionicons name="heart" size={20} color={COLORS.white} />
//               <Text style={recipeDetailStyles.buttonText}>
//                 {isSaved ? "Remove from Favorites" : "Add to Favorites"}
//               </Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default RecipeDetailScreen;

import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { getItem } from "../../utils/storage";
import { API_URL } from "../../constants/api";
import { MealAPI } from "../../services/mealAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Image } from "expo-image";

import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

// 🚀 Fast Memory Cache (Screen level se bahar declare kiya hai taake persists rahe)
const recipeCache = new Map();

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState(
    () => recipeCache.get(recipeId)?.recipe || null,
  );
  const [loading, setLoading] = useState(!recipeCache.has(recipeId));
  const [localUserId, setLocalUserId] = useState(null);

  const [isLimitReached, setIsLimitReached] = useState(
    () => recipeCache.get(recipeId)?.isLimitReached || false,
  );
  const [isPremium, setIsPremium] = useState(
    () => recipeCache.get(recipeId)?.isPremium || false,
  );

  const isNavigatingBack = useRef(false);

  // Instant Fast Back Navigation
  const handleBack = () => {
    if (isNavigatingBack.current) return;
    isNavigatingBack.current = true;

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  // Stripe Pay Wall Handler
  const handleUpgradeToPremium = async () => {
    try {
      const response = await fetch(
        `${API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: localUserId || 1,
            amount: 10,
          }),
        },
      );

      const data = await response.json();

      if (data.url) {
        if (
          typeof window !== "undefined" &&
          window.location &&
          window.location.href
        ) {
          window.location.href = data.url;
        } else {
          await Linking.openURL(data.url);
        }
      } else {
        Alert.alert("Error", "Payment session failed.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadDataFast = async () => {
      // Agar recipe cache mein already mojood hai toh API calls wait mat karein
      if (!recipeCache.has(recipeId)) {
        setLoading(true);
      }

      try {
        const storedId = await getItem("userId");
        if (isMounted) setLocalUserId(storedId);

        // Fetch Data Parallelly
        const recipePromise = recipeCache.has(recipeId)
          ? Promise.resolve(null)
          : MealAPI.getMealById(recipeId);

        const limitPromise = storedId
          ? fetch(`${API_URL}/recipe-views/view`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: Number(storedId),
                recipeId: Number(recipeId),
              }),
            }).then((res) => res.json())
          : Promise.resolve(null);

        const [mealData, viewData] = await Promise.all([
          recipePromise,
          limitPromise,
        ]);

        if (!isMounted) return;

        let updatedRecipe = recipe;
        if (mealData) {
          const transformed = MealAPI.transformMealData(mealData);
          updatedRecipe = {
            ...transformed,
            youtubeUrl: mealData.strYoutube || null,
          };
          setRecipe(updatedRecipe);
        }

        let limitReachedState = isLimitReached;
        let premiumState = isPremium;

        if (viewData) {
          if (viewData.isPremium) {
            premiumState = true;
            limitReachedState = false;
          } else if (viewData.limitReached) {
            limitReachedState = true;
          }
          setIsPremium(premiumState);
          setIsLimitReached(limitReachedState);
        }

        // Cache update for sub-second future loads
        if (updatedRecipe) {
          recipeCache.set(recipeId, {
            recipe: updatedRecipe,
            isLimitReached: limitReachedState,
            isPremium: premiumState,
          });
        }
      } catch (error) {
        console.error("Fast load error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDataFast();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  // Screen Loader only when no cache exists
  if (loading && !recipe) {
    return <LoadingSpinner message="Opening Recipe..." />;
  }

  return (
    <View style={recipeDetailStyles.container}>
      {/* FLOATING HEADER */}
      <View style={[recipeDetailStyles.floatingButtons, { zIndex: 999 }]}>
        <TouchableOpacity
          style={recipeDetailStyles.floatingButton}
          onPress={handleBack}
          activeOpacity={0.6}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView removeClippedSubviews={true}>
        {/* HEADER SECTION */}
        <View style={recipeDetailStyles.headerContainer}>
          <Image
            source={{ uri: recipe?.image }}
            style={recipeDetailStyles.headerImage}
            contentFit="cover"
            transition={200}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />
          <View style={recipeDetailStyles.titleSection}>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe?.title}</Text>
          </View>
        </View>

        {/* 🔒 PAYWALL (IF LIMIT REACHED & NOT PREMIUM) */}
        {isLimitReached && !isPremium ? (
          <View
            style={{
              padding: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="lock-closed" size={64} color={COLORS.primary} />
            <Text
              style={{ fontSize: 22, fontWeight: "bold", marginVertical: 10 }}
            >
              Free Limit Reached!
            </Text>
            <Text
              style={{ textAlign: "center", color: "#666", marginBottom: 20 }}
            >
              Aapne 3 free recipes dekh li hain. Unlimited recipe access unlock
              karne ke liye Premium upgrade karein!
            </Text>
            <TouchableOpacity
              onPress={handleUpgradeToPremium}
              style={{
                backgroundColor: "#22c55e",
                paddingVertical: 14,
                paddingHorizontal: 28,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="card-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Unlock All Recipes ($10)
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* FULL RECIPE DETAILS */
          <View style={recipeDetailStyles.contentSection}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Ingredients ({recipe?.ingredients?.length})
            </Text>
            {recipe?.ingredients?.map((ing, i) => (
              <Text key={i} style={{ paddingVertical: 4 }}>
                • {ing}
              </Text>
            ))}

            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              Instructions
            </Text>
            {recipe?.instructions?.map((inst, i) => (
              <Text key={i} style={{ paddingVertical: 4 }}>
                {i + 1}. {inst}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
