import { StyleSheet } from "react-native";

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 12,
    },
    avatarWrapper: {
      width: "100%",
      alignItems: "center",
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 24,
    },
    iconContainer: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
    },
  });
