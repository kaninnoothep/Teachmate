/**
 * Import Modules
 */
import { Pressable, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

/**
 * TimeSlotButton - Specify the format for time slot buttons
 *
 * @param {*} props
 * @returns JSX Element
 */
export const TimeSlotButton = ({
  timeSlot,
  isSelected,
  onPress,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <Pressable
      style={[
        styles.timeSlotButton,
        isSelected && styles.selectedButton,
        disabled && styles.disabledButton,
      ]}
      onPress={() => onPress(timeSlot)}
      disabled={disabled}
    >
      <Text
        variant="bodyLarge"
        style={[
          styles.text,
          isSelected && styles.selectedText,
          disabled && styles.disabledText,
        ]}
      >
        {timeSlot.startTime} - {timeSlot.endTime}
      </Text>
    </Pressable>
  );
};

/**
 * useStyles - Specify styles to use
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    timeSlotButton: {
      width: "48%",
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 50,
      borderWidth: 1,
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    text: {
      color: theme.colors.text,
      fontWeight: "400",
    },
    selectedText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    selectedButton: {
      backgroundColor: theme.colors.onSurfacePrimary,
      borderColor: theme.colors.primary,
    },
    disabledButton: {
      backgroundColor: theme.colors.inverseOnSurface,
      opacity: 0.9,
    },
    disabledText: {
      opacity: 0.5,
    },
  });
