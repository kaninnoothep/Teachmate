import { Button } from "@/components/Button/Button";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { Divider } from "@/components/Divider/Divider";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { TimeSlotButton } from "@/components/TimeSlotButton/TimeSlotButton";
import { isSameSlot } from "@/pages/Availability/AvailabilityPage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const DateTimePicker = forwardRef(
  ({ availability, onPressSelect, initialDate, initialTimeSlots }, ref) => {
    const sheetRef = useRef(null);
    const initialDateRef = useRef(null);
    const initialTimeSlotsRef = useRef([]);
    const theme = useTheme();
    const styles = useStyles(theme);
    const today = new Date();
    const insets = useSafeAreaInsets();

    const [availabilityMap, setAvailabilityMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [isInvalidSelection, setIsInvalidSelection] = useState(false);

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

    const snapPoints = useMemo(() => ["100%"], []);

    useImperativeHandle(ref, () => ({
      open: () => {
        initialDateRef.current = initialDate;
        initialTimeSlotsRef.current = initialTimeSlots;

        if (initialDate) {
          setSelectedDate(initialDate);
        } else {
          setSelectedDate(today);
        }

        if (initialTimeSlots?.length > 0) {
          setSelectedTimeSlots(initialTimeSlots);
          setIsInvalidSelection(!areAllSlotsContinuous(initialTimeSlots));
        } else {
          setSelectedTimeSlots([]);
          setIsInvalidSelection(false);
        }

        sheetRef.current?.snapToIndex(0);
      },
      close: () => sheetRef.current?.close(),
    }));

    const renderTimeSlots = () => {
      let timeSlots =
        availabilityMap[selectedDate?.toISOString().split("T")[0]];

      const now = dayjs();

      const availableTimeSlots = timeSlots
        ?.filter((timeSlot) => !timeSlot.isBooked)
        .filter((timeSlot) => {
          if (dayjs(selectedDate).isSame(now, "day")) {
            // Keep slots whose endTime is in the future
            const endTime = dayjs(`2000-01-01T${timeSlot.endTime}`);
            const currentTime = dayjs(`2000-01-01T${now.format("HH:mm")}`);
            return endTime.isAfter(currentTime);
          }
          return true; // future dates: show all
        });

      if (availableTimeSlots?.length > 0) {
        return availableTimeSlots.map((timeSlot) => (
          <TimeSlotButton
            key={`${timeSlot.startTime}-${timeSlot.endTime}`}
            timeSlot={timeSlot}
            isSelected={selectedTimeSlots.some((slot) =>
              isSameSlot(slot, timeSlot)
            )}
            onPress={handleTimeSlotPress}
          />
        ));
      }

      return (
        <EmptyList
          iconName="calendar"
          iconSize={100}
          message="No availability left on this date"
          containerStyle={{ flex: 1, marginTop: 20 }}
        />
      );
    };

    const parseTime = (timeStr) => dayjs(`2000-01-01T${timeStr}`);

    const areAllSlotsContinuous = (slots) => {
      if (slots.length <= 1) return true;

      const sorted = [...slots].sort(
        (a, b) => parseTime(a.startTime) - parseTime(b.startTime)
      );

      for (let i = 1; i < sorted.length; i++) {
        const prev = parseTime(sorted[i - 1].endTime);
        const curr = parseTime(sorted[i].startTime);
        if (!prev.isSame(curr)) return false;
      }

      return true;
    };

    const handleCloseSheet = useCallback(() => {
      if (sheetRef.current) {
        sheetRef.current.close();
      }
    }, []);

    const handleChangeDate = ({ date }) => {
      setSelectedDate(date);

      const isSameAsInitial = dayjs(date).isSame(
        dayjs(initialDateRef.current),
        "day"
      );

      if (isSameAsInitial && initialTimeSlotsRef.current?.length > 0) {
        setSelectedTimeSlots(initialTimeSlotsRef.current);
        setIsInvalidSelection(
          !areAllSlotsContinuous(initialTimeSlotsRef.current)
        );
      } else {
        setSelectedTimeSlots([]);
        setIsInvalidSelection(false);
      }
    };

    const handleTimeSlotPress = (timeSlot) => {
      setSelectedTimeSlots((prev) => {
        const exists = prev.some((slot) => isSameSlot(slot, timeSlot));
        const newSlots = exists
          ? prev.filter((slot) => !isSameSlot(slot, timeSlot))
          : [...prev, timeSlot];

        setIsInvalidSelection(!areAllSlotsContinuous(newSlots));
        return newSlots;
      });
    };

    const handleSelect = () => {
      const sortedSlots = [...selectedTimeSlots].sort(
        (a, b) =>
          dayjs(`2000-01-01T${a.startTime}`).valueOf() -
          dayjs(`2000-01-01T${b.startTime}`).valueOf()
      );

      onPressSelect({ selectedDate, selectedTimeSlots: sortedSlots });
      sheetRef.current?.close();
    };

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleComponent={null}
      >
        <View style={[styles.headerContainer, { paddingTop: insets.top - 5 }]}>
          <TouchableOpacity onPress={handleCloseSheet} style={styles.closeIcon}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={theme.colors.inverseText}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Select Date & Time</Text>
        </View>

        <BottomSheetScrollView>
          <DatePicker
            mode="single"
            date={selectedDate}
            onChange={handleChangeDate}
            minDate={today}
            availabilityMap={availabilityMap}
            hideBookedDot
            hideDisabled
            style={{ padding: 16 }}
          />

          <Divider />

          <View style={styles.container}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Time
            </Text>

            <View style={styles.timeSlotsGrid}>{renderTimeSlots()}</View>
          </View>
        </BottomSheetScrollView>

        <View style={styles.buttonContainer}>
          {isInvalidSelection && (
            <View style={styles.warningWrapper}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={theme.colors.error}
              />
              <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                Selected time slots must be continuous.
              </Text>
            </View>
          )}
          <Button
            onPress={handleSelect}
            disabled={
              !selectedDate ||
              selectedTimeSlots.length === 0 ||
              isInvalidSelection
            }
          >
            Select
          </Button>
        </View>
      </BottomSheet>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    headerContainer: {
      position: "relative",
      backgroundColor: theme.colors.primary,
    },
    closeIcon: {
      position: "absolute",
      padding: 8,
      left: 8,
      bottom: 2,
      zIndex: 10,
    },
    title: {
      fontSize: 17,
      fontWeight: "500",
      textAlign: "center",
      marginVertical: 12,
      color: theme.colors.inverseText,
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
    warningWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.onSurfaceError,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 10,
      gap: 6,
      marginBottom: 16,
    },
    buttonContainer: {
      paddingHorizontal: 16,
      paddingBottom: 40,
      paddingTop: 11,
    },
  });
