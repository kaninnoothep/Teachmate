/**
 * Import Modules
 */
import { Chip } from "@/components/Chip/Chip";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

/**
 * SessionItem - Displays session card with brief information
 *
 * @param {object} props
 * @returns JSX Element
 */
export const SessionItem = ({ subject, description, estimatedDuration }) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
        {subject}
      </Text>
      <Text variant="bodyMedium" numberOfLines={2} style={styles.subtitle}>
        {description}
      </Text>
      <Chip
        icon="clock-time-three-outline"
        iconSize={20}
        textVariant="bodySmall"
        value={`${estimatedDuration} hour${+estimatedDuration > 1 ? "s" : ""}`}
        containerStyle={styles.chip}
      />
    </View>
  );
};

/**
 * useStyles - Specify styles to use for session item
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      gap: 14,
      borderColor: theme.colors.outline,
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    title: { fontSize: 20 },
    subtitle: { color: theme.colors.textSecondary },
    descriptionText: {
      color: theme.colors.textSecondary,
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      gap: 6,
    },
  });
