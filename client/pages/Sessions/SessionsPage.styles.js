/**
 * Import Module
 */
import { StyleSheet } from "react-native";

/**
 * useStyles - Specify styles to use for sessions page
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    listContentContainer: {
      paddingHorizontal: 16,
    },
    fab: {
      width: "auto",
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
    },
  });
