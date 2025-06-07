import { StyleSheet } from "react-native";

export const useStyles = (theme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingBottom: 32,
    },
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 16,
    },
    mainList: {
      gap: 10,
      height: 182,
      backgroundColor: theme.colors.onSurfacePrimary,
    },
    listContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      marginTop: 10,
    },
    leftWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    contactContainer: {
      marginTop: -32,
      gap: 8,
      paddingVertical: 0,
    },
    availability: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    divider: {
      height: 2,
      backgroundColor: theme.colors.divider,
    },
    titleWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    preferredLocation: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
  });
