import { StyleSheet } from "react-native";

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
