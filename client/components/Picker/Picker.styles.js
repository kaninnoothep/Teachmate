/**
 * Import Modules
 */
import { StyleSheet } from "react-native";

/**
 * Export Styles to use for Pickers
 */
export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginVertical: 12,
    },
    item: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    selectedText: {
      fontWeight: "700",
    },
    list: {
      paddingBottom: 100,
      minHeight: "100%",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 50,
      minHeight: 200,
    },
    loadingText: {
      marginTop: 12,
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 50,
      minHeight: 200,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
      fontSize: 16,
    },
  });
