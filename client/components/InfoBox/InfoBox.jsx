/**
 * Import Modules
 */
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

/**
 * InfoBox - A container component with a label and content area
 *
 * @param {*} props
 * @returns JSX Element
 */
export const InfoBox = ({
  label,
  children,
  disabledContentPadding = false,
  containerStyle,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text variant="bodySmall" style={styles.label}>
          {label}
        </Text>
      </View>

      <View style={!disabledContentPadding && styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

/**
 * useStyles - Specify styles for InfoBox
 *
 * @param {*} theme - Current theme from react-native-paper
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      overflow: "hidden",
    },
    labelContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: theme.colors.infoBackground,
    },
    label: {
      color: theme.colors.textSecondary,
    },
    contentContainer: {
      padding: 16,
    },
  });
