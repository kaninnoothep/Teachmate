/**
 * Import Module
 */
import { StyleSheet } from "react-native";

/**
 * useStyles - Specify styles to use
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    text: {
      color: theme.colors.textSecondary,
    },
  });
