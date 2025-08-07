import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const ChartSection = ({ title, subtitle, legend, children }) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartTitleWrapper}>
        {title && (
          <Text variant="titleMedium" style={styles.chartTitle}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text variant="bodyMedium" style={styles.chartSubtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      {children}

      {legend && (
        <View style={styles.legendContainer}>
          <View style={styles.legendIndicator} />
          <Text variant="bodySmall">{legend}</Text>
        </View>
      )}
    </View>
  );
};

/**
 * useStyles - Specify styles for ChartSection
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    chartContainer: {
      overflow: "hidden",
      padding: 20,
      gap: 24,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: theme.colors.outline,
    },
    chartTitle: {
      fontSize: 18,
    },
    chartSubtitle: {
      color: theme.colors.textSecondary,
    },
    chartTitleWrapper: {
      gap: 6,
    },
    legendContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    legendIndicator: {
      width: 10,
      height: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
  });
