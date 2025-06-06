import { StyleSheet } from "react-native";

export const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      gap: 12,
    },
    logoContainer: {
      height: 380,
      backgroundColor: theme.colors.primary,
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    logo: {
      width: 360,
      height: 128,
      objectFit: "contain",
      marginTop: 60,
    },
    logoCaptionText: {
      color: theme.colors.inverseText,
    },
    buttonWrapper: {
      width: "100%",
      marginTop: 28,
      gap: 24,
    },
    signUpWrapper: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    signUpLink: {
      fontSize: 14,
    },
  });
