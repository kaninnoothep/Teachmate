/**
 * Import Modules
 */
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * PickerButton - Specify the format for picker buttons
 *
 * @param {*} props
 * @returns JSX Element
 */
export const PickerButton = ({
  label,
  value,
  iconName = "unfold-more-horizontal",
  iconSize = 24,
  iconColor,
  onPress,
  containerStyles,
  helperText = "",
  isError = false,
  hideHelperTextSpace = false,
  hideIcon = false,
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme, isError);
  const hasValue = !!value;

  return (
    <View style={[styles.container, containerStyles]}>
      <TouchableOpacity
        style={[
          styles.button,
          disabled && {
            opacity: 0.9,
            backgroundColor: theme.colors.inverseOnSurface,
          },
        ]}
        onPress={onPress}
        disabled={disabled || !onPress}
        {...props}
      >
        <View style={styles.content}>
          {label && (
            <Text
              style={[
                styles.label,
                hasValue && styles.labelShrink,
                disabled && styles.disabled,
              ]}
            >
              {label}
            </Text>
          )}
          {hasValue && <Text style={styles.valueText}>{value}</Text>}
        </View>

        {!hideIcon && (
          <MaterialCommunityIcons
            name={iconName}
            size={iconSize}
            color={iconColor || theme.colors.textSecondary}
            style={disabled && styles.disabled}
          />
        )}
      </TouchableOpacity>

      {!hideHelperTextSpace && (
        <Text
          variant="bodySmall"
          style={[styles.errorText, { opacity: helperText ? 1 : 0 }]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

/**
 * useStyles - Specify styles to use
 *
 * @param {*} theme
 * @param {boolean} isError - Indicates if input is in error state
 * @returns StyleSheet object
 */
const useStyles = (theme, isError) =>
  StyleSheet.create({
    container: {
      position: "relative",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderWidth: isError ? 2 : 1,
      borderColor: isError ? theme.colors.error : theme.colors.outline,
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
      color: isError ? theme.colors.error : theme.colors.onSurfaceVariant,
    },
    labelShrink: {
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
    disabled: {
      opacity: 0.5,
    },
    errorText: {
      color: theme.colors.error,
      marginTop: 5,
      letterSpacing: 0.2,
      marginLeft: 12,
    },
  });
