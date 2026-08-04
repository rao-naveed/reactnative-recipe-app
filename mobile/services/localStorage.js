import AsyncStorage from "@react-native-async-storage/async-storage";

// Small wrapper around AsyncStorage that always works with JSON so the
// rest of the app never has to worry about serialization or errors.

export async function getJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`localStorage.getJSON failed for key "${key}":`, error);
    return fallback;
  }
}

export async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`localStorage.setJSON failed for key "${key}":`, error);
    return false;
  }
}

export async function removeKey(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`localStorage.removeKey failed for key "${key}":`, error);
    return false;
  }
}
