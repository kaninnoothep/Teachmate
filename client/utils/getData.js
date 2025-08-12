/**
 * Import Module
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * getData - Retrieve a value from AsyncStorage by key
 *
 * @param {string} key - The key to retrieve the value for
 * @returns {Promise<string|null>} - Returns the stored value or null if not found
 */
export const getData = async (key) => {
  try {
    // Attempt to get the value associated with the key
    const value = await AsyncStorage.getItem(key);
    // Return the value if it exists, otherwise return null
    return value !== null ? value : null;
  } catch (error) {
    // Log error if retrieval fails
    console.log("Get data error: " + error);
  }
};
