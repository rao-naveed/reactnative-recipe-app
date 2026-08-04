import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { moderateScale } from "../../constants/responsive";

// Single accent tied to the app's primary theme color, used for the
// recipe card's tag + info pills. Keeps every card visually consistent
// instead of a rotating multicolor palette.
export const CARD_ACCENT = { base: COLORS.primary, soft: `${COLORS.primary}1A` };

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  welcomeSection: { 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  // 🍔 Navbar replacing the old animal icons row
  navbar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navbarSide: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuredCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  featuredImageContainer: {
    height: 240,
    backgroundColor: COLORS.primary,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
    padding: 20,
  },
  featuredBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  featuredBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  featuredContent: {
    justifyContent: "flex-end",
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
  },
  recipesSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  recipesGrid: {
    gap: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
  },
  categoryFilterContainer: {
    marginVertical: 16,
  },
  categoryFilterScrollContent: {
    paddingHorizontal: 16,
    gap: 2,
  },

  categoryButton: {
  width: 84,
  height: 108,
  backgroundColor: COLORS.card,
  borderRadius: 10,      // was 20
  overflow: "hidden",
  borderWidth: 1,
  borderColor: COLORS.border,
  marginRight: 10,

  shadowColor: COLORS.shadow,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},

  selectedCategory: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.15,
  },

  categoryImage: {
    width: "100%",
    height: 74,
    backgroundColor: COLORS.border,
},
  categoryLabel: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},

  selectedCategoryLabel: {
    backgroundColor: COLORS.primary,
},

  selectedCategoryImage: {
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
});

// 🃏 Card styles — clean, single-tone card with a soft neutral shadow.
// No per-card rotation or rainbow accent blocks; every card lines up
// evenly in the grid and uses the app's primary theme color as its one
// accent, so the whole screen reads as one consistent design.
export const recipeCardStyles = StyleSheet.create({
  shadowLayer: {
    marginBottom: 20,
    borderRadius: 12,
  },
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    height: 140,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.border,
  },
  // Category tag, aligned neatly inside the image corner rather than
  // rotated/overlapping the edge.
  flavorTag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  flavorTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.2,
  },
  content: {
    padding: 14,
  },
 title: {
  fontSize: 16,
  fontWeight: "800",
  color: COLORS.text,
  marginBottom: 4,
  lineHeight: 21,
  letterSpacing: -0.3,
  minHeight: 42, // reserves space for 2 lines (21 * 2), even if title is 1 line
},
description: {
  fontSize: 12,
  color: COLORS.text,
  marginBottom: 10,
  lineHeight: 16,
  minHeight: 32, // reserves space for 2 lines (16 * 2), even if description is missing/short
},
footer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  marginTop: 2,
  minHeight: 26, // reserves space even if no pills render
},

  // Neutral pills tinted with the single theme accent color
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
});