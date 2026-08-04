import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

/**
 * Cross-platform key-value storage.
 * - Native (iOS/Android): uses expo-secure-store (encrypted).
 * - Web: falls back to localStorage, since expo-secure-store
 *   does not implement a native module on web and throws
 *   "ExpoSecureStore.default.getValueWithKeyAsync is not a function".
 */

export async function setItem(key, value) {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`storage.setItem failed for key "${key}":`, error);
  }
}

export async function getItem(key) {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`storage.getItem failed for key "${key}":`, error);
    return null;
  }
}

export async function deleteItem(key) {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      return;
    }
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`storage.deleteItem failed for key "${key}":`, error);
  }
}
