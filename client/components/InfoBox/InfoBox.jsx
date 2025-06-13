import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const InfoBox = ({
  label,
  children,
  disabledContentPadding = false,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
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
