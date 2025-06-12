import { StyleSheet } from "react-native";

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    listContentContainer: {
      gap: 10,
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 90,
      // borderWidth: 1,
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
