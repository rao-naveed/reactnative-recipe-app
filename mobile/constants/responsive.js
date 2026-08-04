import { Dimensions } from "react-native";

// Baseline design size (standard small/medium phone in portrait).
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export function getScreenWidth() {
  return Dimensions.get("window").width;
}

export function getScreenHeight() {
  return Dimensions.get("window").height;
}

// Scales a size relative to screen width.
export function scaleWidth(size, width = getScreenWidth()) {
  return (width / BASE_WIDTH) * size;
}

// Scales a size relative to screen height.
export function scaleHeight(size, height = getScreenHeight()) {
  return (height / BASE_HEIGHT) * size;
}

// "Moderate" scaling - grows/shrinks less aggressively than a linear
// scale, which keeps text and spacing readable on very small or very
// large screens instead of becoming tiny or huge.
export function moderateScale(size, factor = 0.5, width = getScreenWidth()) {
  return size + (scaleWidth(size, width) - size) * factor;
}

// Decide how many grid columns to use based on the available width, so
// phones get 2 columns, small tablets get 3, and large tablets get 4.
export function getNumColumns(width = getScreenWidth()) {
  if (width >= 900) return 4;
  if (width >= 600) return 3;
  return 2;
}

const GRID_GAP = 16;
const GRID_HORIZONTAL_PADDING = 32;

// Computes a recipe-card width that fits evenly into the grid for the
// current screen width and column count.
export function getCardWidth(
  width = getScreenWidth(),
  numColumns = getNumColumns(width),
  horizontalPadding = GRID_HORIZONTAL_PADDING,
  gap = GRID_GAP
) {
  const totalGap = gap * (numColumns - 1);
  return (width - horizontalPadding - totalGap) / numColumns;
}

// Returns true when running on a tablet-sized viewport.
export function isTablet(width = getScreenWidth()) {
  return width >= 600;
}
