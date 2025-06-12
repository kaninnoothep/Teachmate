import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const PickerButton = ({
  label,
  value,
  iconName = "unfold-more-horizontal",
  iconColor,
  onPress,
  containerStyles,
  helperText = "",
  isError = false,
  hideHelperTextSpace = false,
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
        disabled={disabled}
        {...props}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.label,
              hasValue && styles.labelShrunk,
              disabled && styles.disabled,
            ]}
          >
            {label}
          </Text>
          {hasValue && <Text style={styles.valueText}>{value}</Text>}
        </View>

        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={iconColor || theme.colors.textSecondary}
          style={disabled && styles.disabled}
        />
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
