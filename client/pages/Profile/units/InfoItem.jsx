/**
 * Import Modules
 */
import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, useTheme } from "react-native-paper";

/**
 * InfoItem - Displays an icon alongside a single line of text
 *
 * @param {object} props
 * @returns JSX Element
 */
export const InfoItem = ({ icon, value, containerStyles }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={[styles.container, containerStyles]}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={theme.colors.primary}
      />
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
};

/**
 * useStyles - Specify styles to use for info item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.background,
    },
  });
