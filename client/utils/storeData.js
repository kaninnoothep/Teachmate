/**
 * Import Modules
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * storeData - Save a key-value pair to AsyncStorage
 *
 * @param {string} key - The key to store the value under
 * @param {string} value - The value to store
 * @returns {Promise<void>}
 */
export const storeData = async (key, value) => {
  try {
    // Save the key-value pair in AsyncStorage
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Log error if saving fails
    console.log("Store data error: " + error);
  }
};
