import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const DatePickerButton = ({
  label,
  value,
  onPress,
  containerStyles,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const hasValue = !!value;

  return (
    <View style={[styles.container, containerStyles]}>
      <TouchableOpacity style={styles.button} onPress={onPress} {...props}>
        <View style={styles.content}>
          <Text style={[styles.label, hasValue && styles.labelShrunk]}>
            {label}
          </Text>
          {hasValue && (
            <Text style={styles.valueText}>{value.displayText}</Text>
          )}
        </View>
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      minHeight: 50,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    label: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
    labelShrunk: {
      position: "absolute",
      backgroundColor: theme.colors.background,
      fontSize: 12,
      top: -23,
      left: -8,
      zIndex: 2,
      paddingHorizontal: 6,
    },
    valueText: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
  });
