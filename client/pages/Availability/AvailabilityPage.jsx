import { Button } from "@/components/Button/Button";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { Divider } from "@/components/Divider/Divider";
import { TimeSlotButton } from "@/components/TimeSlotButton/TimeSlotButton";
import { useAvailabilityQuery } from "@/services/api/availability/useAvailabilityQuery";
import { useSetAvailabilityMutation } from "@/services/api/availability/useSetAvailabilityMutation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

// Time slots data
const TIME_SLOTS = [
  { startTime: "06:00", endTime: "07:00" },
  { startTime: "07:00", endTime: "08:00" },
  { startTime: "08:00", endTime: "09:00" },
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "10:00", endTime: "11:00" },
  { startTime: "11:00", endTime: "12:00" },
  { startTime: "12:00", endTime: "13:00" },
  { startTime: "13:00", endTime: "14:00" },
  { startTime: "14:00", endTime: "15:00" },
  { startTime: "15:00", endTime: "16:00" },
  { startTime: "16:00", endTime: "17:00" },
  { startTime: "17:00", endTime: "18:00" },
  { startTime: "18:00", endTime: "19:00" },
  { startTime: "19:00", endTime: "20:00" },
  { startTime: "20:00", endTime: "21:00" },
  { startTime: "21:00", endTime: "22:00" },
];
export const isSameSlot = (a, b) =>
  a.startTime === b.startTime && a.endTime === b.endTime;

export const AvailabilityPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const today = new Date();
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [showDateWarning, setShowDateWarning] = useState(false);
  const { availability } = useAvailabilityQuery();
  const { mutateAsync: setAvailability } = useSetAvailabilityMutation({});

  useEffect(() => {
    if (availability && availability.length > 0) {
      const initialMap = {};
      availability.forEach((item) => {
        const rawDate = item.date;
        const dateObj = new Date(rawDate);
        const dateKey = dateObj.toISOString().split("T")[0];

        initialMap[dateKey] = item.slots.map((s) => ({
          startTime: s.startTime,
          endTime: s.endTime,
          isBooked: s.isBooked,
        }));
      });

      setAvailabilityMap(initialMap);
    }
  }, [availability]);

  const handleChangeDate = ({ dates }) => {
    setSelectedDates(dates);
    setShowDateWarning(false);

    if (dates.length === 0) {
      setSelectedTimeSlots([]);
      return;
    }

    if (dates.length === 1) {
      const selectedDate = dates[0];
      const key = selectedDate.toISOString().split("T")[0];

      // Use functional update to get the most current availabilityMap
      setAvailabilityMap((currentAvailabilityMap) => {
        const existingSlots = currentAvailabilityMap[key] || [];

        setSelectedTimeSlots(existingSlots);

        return currentAvailabilityMap;
      });

      return;
    }

    setAvailabilityMap((currentAvailabilityMap) => {
      const dateKeys = dates.map((date) => date.toISOString().split("T")[0]);

      // Get the time slots for each selected date
      const slotsByDate = dateKeys.map(
        (key) => currentAvailabilityMap[key] || []
      );

      // Function to check if two slot arrays are the same
      const areSlotsEqual = (a, b) => {
        if (a.length !== b.length) return false;
        return a.every((slot1) => b.some((slot2) => isSameSlot(slot1, slot2)));
      };

      // Check if all selected dates have the same slots
      const allSame = slotsByDate.every((slots, i, arr) =>
        areSlotsEqual(slots, arr[0])
      );

      if (allSame) {
        setSelectedTimeSlots(slotsByDate[0]);
      } else {
        setSelectedTimeSlots([]);
        setShowDateWarning(true);
      }

      return currentAvailabilityMap;
    });
  };

  const handleTimeSlotPress = (timeSlot) => {
    setSelectedTimeSlots((prev) => {
      const exists = prev.some((slot) => isSameSlot(slot, timeSlot));
      if (exists) {
        return prev.filter((slot) => !isSameSlot(slot, timeSlot));
      } else {
        return [...prev, timeSlot];
      }
    });
  };

  const handleSave = () => {
    if (selectedDates.length === 0) {
      Toast.show({ type: "error", text1: "Please select Date" });
      return;
    }

    const formatDate = (date) => date.toISOString().split("T")[0];

    const payload = {
      availability: selectedDates.map((date) => ({
        date: formatDate(date),
        slots: selectedTimeSlots,
      })),
    };

    setAvailability(payload, {
      onSuccess: (data) => {
        Toast.show({ type: "success", text1: data.message });
        // Update local availabilityMap after successful save
        const updated = { ...availabilityMap };
        payload.availability.forEach(({ date }) => {
          updated[date] = selectedTimeSlots;
        });
        setAvailabilityMap(updated);
        setSelectedDates([]);
        setSelectedTimeSlots([]);
        setShowDateWarning(false);
        router.back();
      },
      onError: (error) => {
        Toast.show({ type: "error", text1: error.message });
      },
    });
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable>
        <DatePicker
          mode="multiple"
          dates={selectedDates}
          onChange={handleChangeDate}
          minDate={today}
          availabilityMap={availabilityMap}
          style={{ padding: 16 }}
        />

        <Divider />

        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Select Time
          </Text>

          {showDateWarning && (
            <View style={styles.warningWrapper}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={theme.colors.warning}
              />
              <Text variant="bodySmall">
                {`Different availabilities. Pick time slots to set.`}
              </Text>
            </View>
          )}

          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((timeSlot) => (
              <TimeSlotButton
                key={`${timeSlot.startTime}-${timeSlot.endTime}`}
                timeSlot={timeSlot}
                isSelected={selectedTimeSlots.some((slot) =>
                  isSameSlot(slot, timeSlot)
                )}
                onPress={handleTimeSlotPress}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.container}>
          <Button onPress={handleSave} disabled={selectedDates.length === 0}>
            Save
          </Button>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingBottom: 32,
    },
    container: {
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    warningWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.warning,
      backgroundColor: theme.colors.onSurfaceWarning,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 10,
      gap: 8,
      marginBottom: 16,
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
