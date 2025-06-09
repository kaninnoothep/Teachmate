import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export const TimeSlotButton = ({ timeSlot, isSelected, onPress, theme }) => (
  <Pressable
    style={[
      styles.timeSlotButton,
      {
        backgroundColor: isSelected
          ? theme.colors.onSurfacePrimary
          : theme.colors.surface,
        borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
      },
    ]}
    onPress={() => onPress(timeSlot)}
  >
    <Text
      variant="bodyLarge"
      style={{
        color: isSelected ? theme.colors.primary : theme.colors.text,
        fontWeight: isSelected ? "600" : "400",
      }}
    >
      {timeSlot.startTime} - {timeSlot.endTime}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  timeSlotButton: {
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
});
