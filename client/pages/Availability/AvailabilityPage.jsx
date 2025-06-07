import { Button } from "@/components/Button/Button";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { Divider } from "@/components/Divider/Divider";
import { TimeSlotButton } from "@/components/TimeSlotButton/TimeSlotButton";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

// Time slots data
const TIME_SLOTS = [
  "6:00 - 7:00",
  "7:00 - 8:00",
  "8:00 - 9:00",
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
];

export const AvailabilityPage = () => {
  const theme = useTheme();
  const today = new Date();
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const handleTimeSlotPress = (timeSlot) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(timeSlot)) {
        // Remove if already selected
        return prev.filter((slot) => slot !== timeSlot);
      } else {
        // Add if not selected
        return [...prev, timeSlot];
      }
    });
  };

  const handleSave = () => {
    console.log("Selected Dates:", selectedDates);
    console.log("Selected Time Slots:", selectedTimeSlots);
    // Handle save logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <DatePicker
          mode="multiple"
          dates={selectedDates}
          onChange={({ dates }) => setSelectedDates(dates)}
          minDate={today}
          style={{ padding: 16 }}
        />

        <Divider />

        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Select Time
          </Text>

          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((timeSlot) => (
              <TimeSlotButton
                key={timeSlot}
                timeSlot={timeSlot}
                isSelected={selectedTimeSlots.includes(timeSlot)}
                onPress={handleTimeSlotPress}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.container}>
          <Button onPress={handleSave}>Save</Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 32,
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
});
