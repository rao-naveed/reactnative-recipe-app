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
import { WebView } from "react-native-webview";

// Fast memory cache
const recipeCache = new Map();

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const router = useRouter();

  const cachedData = recipeCache.get(recipeId);

  const [recipe, setRecipe] = useState(cachedData?.recipe || null);
  const [loading, setLoading] = useState(!cachedData);

  const [localUserId, setLocalUserId] = useState(null);

  const [isLimitReached, setIsLimitReached] = useState(
    cachedData?.isLimitReached || false,
  );

  const [isPremium, setIsPremium] = useState(cachedData?.isPremium || false);

  const [isSaved, setIsSaved] = useState(cachedData?.isSaved || false);

  const [isSaving, setIsSaving] = useState(false);

  const isNavigatingBack = useRef(false);

  // =========================================================
  // BACK BUTTON
  // =========================================================

  const handleBack = () => {
    if (isNavigatingBack.current) return;

    isNavigatingBack.current = true;

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  // =========================================================
  // YOUTUBE URL
  // =========================================================

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (url.includes("watch?v=")) {
        const videoId = url.split("watch?v=")[1]?.split("&")[0];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (url.includes("/embed/")) {
        return url;
      }

      return url;
    } catch (error) {
      console.log("YouTube URL Error:", error);
      return null;
    }
  };

  // =========================================================
  // STRIPE CHECKOUT
  // =========================================================

  const handleUpgradeToPremium = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(localUserId || 1),
            amount: 10,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create payment session.");
      }

      if (!data.url) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      await Linking.openURL(data.url);
    } catch (error) {
      console.error("Payment Error:", error);

      Alert.alert(
        "Payment Error",
        error?.message || "Unable to start payment.",
      );
    }
  };

  // =========================================================
  // CHECK FAVORITE
  // =========================================================

  const checkIfSaved = async (userId) => {
    if (!userId || !recipeId) return;

    try {
      const response = await fetch(`${API_URL}/api//favorites/${userId}`);

      if (!response.ok) return;

      const favorites = await response.json();

      const saved = favorites.some(
        (fav) => Number(fav.recipeId) === Number(recipeId),
      );

      setIsSaved(saved);

      return saved;
    } catch (error) {
      console.error("Error checking favorite:", error);
    }

    return false;
  };

  // =========================================================
  // TOGGLE FAVORITE
  // =========================================================

  const handleToggleSave = async () => {
    if (!localUserId) {
      Alert.alert("Authentication Required", "Please sign in to save recipes.");
      return;
    }

    if (!recipe) return;

    setIsSaving(true);

    try {
      if (isSaved) {
        const response = await fetch(
          `${API_URL}/api/favorites/${localUserId}/${recipeId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to remove recipe");
        }

        setIsSaved(false);
      } else {
        const response = await fetch(`${API_URL}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: Number(localUserId),
            recipeId: Number(recipeId),
            title: recipe.title,
            image: recipe.image,
            cookTime: parseInt(recipe.cookTime) || 0,
            servings: recipe.servings,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save recipe");
        }

        setIsSaved(true);
      }

      const currentCache = recipeCache.get(recipeId);

      if (currentCache) {
        recipeCache.set(recipeId, {
          ...currentCache,
          isSaved: !isSaved,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);

      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // LOAD RECIPE + VIEW
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadDataFast = async () => {
      if (!recipeCache.has(recipeId)) {
        setLoading(true);
      }

      try {
        // ---------------------------------------------
        // USER ID
        // ---------------------------------------------

        const storedId = await getItem("userId");

        if (isMounted) {
          setLocalUserId(storedId);
        }

        // ---------------------------------------------
        // RECIPE REQUEST
        // ---------------------------------------------

        const recipePromise = recipeCache.has(recipeId)
          ? Promise.resolve(null)
          : MealAPI.getMealById(recipeId);

        // ---------------------------------------------
        // VIEW REQUEST
        // ---------------------------------------------

        const viewPromise = storedId
          ? fetch(`${API_URL}/api/recipe-views/view`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: Number(storedId),
                recipeId: Number(recipeId),
              }),
            }).then(async (res) => {
              try {
                return await res.json();
              } catch {
                return null;
              }
            })
          : Promise.resolve(null);

        // ---------------------------------------------
        // FAVORITE REQUEST
        // ---------------------------------------------

        const favoritePromise = storedId
          ? fetch(`${API_URL}/api/favorites/${storedId}`).then((res) =>
              res.json(),
            )
          : Promise.resolve([]);
        const [mealData, viewData, favoritesData] = await Promise.all([
          recipePromise,
          viewPromise,
          favoritePromise,
        ]);

        if (!isMounted) return;

        if (Array.isArray(favoritesData)) {
          const alreadySaved = favoritesData.some(
            (favorite) => Number(favorite.recipeId) === Number(recipeId),
          );

          setIsSaved(alreadySaved);
        }

        // ---------------------------------------------
        // RECIPE DATA
        // ---------------------------------------------

        let updatedRecipe = recipe;

        if (mealData) {
          const transformed = MealAPI.transformMealData(mealData);

          updatedRecipe = {
            ...transformed,
            youtubeUrl: mealData.strYoutube || null,
          };

          setRecipe(updatedRecipe);
        }

        // ---------------------------------------------
        // LIMIT / PREMIUM
        // ---------------------------------------------

        let limitReachedState = isLimitReached;
        let premiumState = isPremium;

        if (viewData) {
          if (viewData.isPremium) {
            premiumState = true;
            limitReachedState = false;
          } else if (viewData.limitReached) {
            limitReachedState = true;
          }

          if (typeof viewData.views === "number") {
            setViews(viewData.views);
          }
        }

        setIsPremium(premiumState);
        setIsLimitReached(limitReachedState);

        if (typeof savedData === "boolean") {
          setIsSaved(savedData);
        }

        // ---------------------------------------------
        // UPDATE CACHE
        // ---------------------------------------------

        if (updatedRecipe) {
          recipeCache.set(recipeId, {
            recipe: updatedRecipe,
            isLimitReached: limitReachedState,
            isPremium: premiumState,
            views: typeof viewData?.views === "number" ? viewData.views : views,
            isSaved: typeof savedData === "boolean" ? savedData : isSaved,
          });
        }
      } catch (error) {
        console.error("Fast load error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDataFast();

    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading && !recipe) {
    return <LoadingSpinner />;
  }

  if (!recipe) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Recipe could not be loaded.
        </Text>

        <TouchableOpacity
          onPress={handleBack}
          style={{
            marginTop: 20,
            backgroundColor: COLORS.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontWeight: "700",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =========================================================
  // YOUTUBE
  // =========================================================

  const youtubeEmbedUrl = getYouTubeEmbedUrl(recipe.youtubeUrl);

  return (
    <View style={{ flex: 1 }}>
      {/* =====================================================
          FLOATING HEADER BUTTONS
      ====================================================== */}

      <View
        style={[
          recipeDetailStyles.floatingButtons,
          {
            zIndex: 999,
          },
        ]}
      >
        {/* BACK BUTTON */}

        <TouchableOpacity
          style={recipeDetailStyles.floatingButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* FAVORITE BUTTON */}

        <TouchableOpacity
          style={[
            recipeDetailStyles.floatingButton,
            {
              backgroundColor: isSaving ? COLORS.gray : COLORS.primary,
            },
          ]}
          onPress={handleToggleSave}
          disabled={isSaving}
        >
          <Ionicons
            name={
              isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"
            }
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      >
        {/* =====================================================
            HEADER SECTION
        ====================================================== */}

        <View style={recipeDetailStyles.headerContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={recipeDetailStyles.headerImage}
            contentFit="cover"
            transition={200}
          />

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.titleSection}>
            {/* CATEGORY */}

            {recipe.category && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {recipe.category}
                </Text>
              </View>
            )}

            {/* TITLE */}

            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>

            {/* CUISINE */}

            {recipe.area && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={COLORS.white}
                />

                <Text
                  style={{
                    color: COLORS.white,
                    marginLeft: 6,
                    fontSize: 15,
                    fontWeight: "600",
                  }}
                >
                  {recipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* =====================================================
            PAYWALL
        ====================================================== */}

        {isLimitReached && !isPremium ? (
          <View
            style={{
              margin: 20,
              padding: 30,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.white,
              borderRadius: 20,
              elevation: 4,
              shadowOpacity: 0.12,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: 4,
              },
            }}
          >
            <Ionicons name="lock-closed" size={64} color={COLORS.primary} />

            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 12,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Free Limit Reached!
            </Text>

            <Text
              style={{
                textAlign: "center",
                color: "#666",
                marginBottom: 20,
                lineHeight: 22,
              }}
            >
              You’ve used all 5 free recipe views. Upgrade to Premium to unlock
              unlimited recipe access! Agar thod karein!
            </Text>

            <TouchableOpacity
              onPress={handleUpgradeToPremium}
              style={{
                backgroundColor: COLORS.primary,
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
                color={COLORS.white}
                style={{
                  marginRight: 8,
                }}
              />

              <Text
                style={{
                  color: COLORS.white,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Unlock All Recipes ($10)
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* =================================================
                QUICK STATS
            ================================================== */}

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingTop: 20,
                gap: 12,
              }}
            >
              {/* PREP TIME */}

              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 14,
                  alignItems: "center",
                  elevation: 2,
                }}
              >
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </LinearGradient>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: COLORS.text,
                  }}
                >
                  {recipe.cookTime || "N/A"}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textLight,
                    marginTop: 3,
                  }}
                >
                  Prep Time
                </Text>
              </View>

              {/* SERVINGS */}

              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.white,
                  borderRadius: 16,
                  padding: 14,
                  alignItems: "center",
                  elevation: 2,
                }}
              >
                <LinearGradient
                  colors={["#4ECDC4", "#44A08D"]}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </LinearGradient>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: COLORS.text,
                  }}
                >
                  {recipe.servings || "N/A"}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.textLight,
                    marginTop: 3,
                  }}
                >
                  Servings
                </Text>
              </View>
            </View>

            {/* =================================================
                YOUTUBE VIDEO
            ================================================== */}

            {youtubeEmbedUrl && (
              <View
                style={{
                  marginTop: 24,
                  paddingHorizontal: 20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <LinearGradient
                    colors={["#FF0000", "#CC0000"]}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name="logo-youtube"
                      size={22}
                      color={COLORS.white}
                    />
                  </LinearGradient>

                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "800",
                      color: COLORS.text,
                    }}
                  >
                    Video Tutorial
                  </Text>
                </View>

                <View
                  style={{
                    height: 220,
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: "#000",
                  }}
                >
                  <WebView
                    style={{
                      flex: 1,
                    }}
                    source={{
                      uri: youtubeEmbedUrl,
                    }}
                    allowsFullscreenVideo
                    mediaPlaybackRequiresUserAction={false}
                  />
                </View>
              </View>
            )}

            {/* =================================================
                INGREDIENTS
            ================================================== */}

            <View
              style={[
                recipeDetailStyles.contentSection,
                {
                  paddingTop: 24,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primary + "80"]}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </LinearGradient>

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: COLORS.text,
                  }}
                >
                  Ingredients
                </Text>

                <View
                  style={{
                    marginLeft: "auto",
                    backgroundColor: COLORS.primary + "20",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "700",
                    }}
                  >
                    {recipe.ingredients?.length || 0}
                  </Text>
                </View>
              </View>

              {recipe.ingredients?.map((ingredient, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.white,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                    elevation: 1,
                    shadowOpacity: 0.06,
                    shadowRadius: 5,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: COLORS.primary + "18",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: "800",
                        fontSize: 13,
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <Text
                    style={{
                      flex: 1,
                      color: COLORS.text,
                      fontSize: 15,
                      lineHeight: 21,
                    }}
                  >
                    {ingredient}
                  </Text>

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={COLORS.textLight}
                  />
                </View>
              ))}
            </View>

            {/* =================================================
                INSTRUCTIONS
            ================================================== */}

            <View
              style={[
                recipeDetailStyles.contentSection,
                {
                  paddingTop: 8,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <LinearGradient
                  colors={["#9C27B0", "#673AB7"]}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name="list-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </LinearGradient>

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: COLORS.text,
                  }}
                >
                  Instructions
                </Text>

                <View
                  style={{
                    marginLeft: "auto",
                    backgroundColor: "#9C27B020",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#7B1FA2",
                      fontWeight: "700",
                    }}
                  >
                    {recipe.instructions?.length || 0}
                  </Text>
                </View>
              </View>

              {recipe.instructions?.map((instruction, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    marginBottom: 16,
                  }}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontWeight: "800",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </LinearGradient>

                  <View
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.white,
                      borderRadius: 14,
                      padding: 15,
                      elevation: 1,
                      shadowOpacity: 0.06,
                      shadowRadius: 5,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.text,
                        fontSize: 15,
                        lineHeight: 23,
                      }}
                    >
                      {instruction}
                    </Text>

                    <Text
                      style={{
                        marginTop: 8,
                        color: COLORS.textLight,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Step {index + 1}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* =================================================
          FLOATING FAVORITE BUTTON
          ScrollView ke BAHAR hai
      ================================================== */}

      {!isLimitReached || isPremium ? (
        <TouchableOpacity
          onPress={handleToggleSave}
          disabled={isSaving}
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 20,
            borderRadius: 14,
            overflow: "hidden",
            opacity: isSaving ? 0.7 : 1,
            zIndex: 9999,
            elevation: 10,
          }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primary + "CC"]}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons
              name={
                isSaving
                  ? "hourglass"
                  : isSaved
                    ? "bookmark"
                    : "bookmark-outline"
              }
              size={21}
              color={COLORS.white}
              style={{
                marginRight: 8,
              }}
            />

            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontWeight: "800",
              }}
            >
              {isSaving
                ? "Please Wait..."
                : isSaved
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default RecipeDetailScreen;
