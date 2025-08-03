/**
 * Import Modules
 */
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

/**
 * Chip - A small pill-style component for displaying text with an optional icon
 *
 * @param {*} props
 * @returns JSX Element
 */
export const Chip = ({
  textVariant = "titleSmall",
  value,
  icon,
  iconSize = 24,
  iconColor,
  containerStyle,
  textStyle,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={iconColor || theme.colors.primary}
        />
      )}
      <Text variant={textVariant} style={[styles.text, textStyle]}>
        {value}
      </Text>
    </View>
  );
};

/**
 * useStyles - Specify styles for Chip
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      alignSelf: "baseline",
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.onSurfacePrimary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 50,
    },
    text: {
      color: theme.colors.primary,
    },
  });
