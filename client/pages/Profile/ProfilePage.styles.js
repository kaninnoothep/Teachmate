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
    avatarContainer: {
      position: "relative",
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
    buttonContainer: {
      paddingHorizontal: 16,
      paddingBottom: 40,
      paddingTop: 11,
    },
  });
