import { StyleSheet } from "react-native";

export const useStyles = () =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    greetingText: { fontWeight: "700" },
    listHeaderContainer: {
      paddingTop: 26,
      paddingBottom: 10,
      gap: 18,
    },
    listContentContainer: {
      gap: 10,
      paddingHorizontal: 16,
      paddingBottom: 90,
    },
  });
