import { StyleSheet } from "react-native";

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      height: "100%",
    },
    filterContainer: {
      padding: 16,
      height: 82,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      gap: 8,
    },
    searchTextInputContainer: {
      height: 50,
    },
    locationButton: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      padding: 12,
      gap: 8,
      width: 144,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 10,
    },
    locationButtonText: { flex: 1 },
    listHeaderContainer: {
      paddingTop: 8,
      paddingBottom: 20,
    },
    listContentContainer: {
      paddingHorizontal: 16,
    },
  });
