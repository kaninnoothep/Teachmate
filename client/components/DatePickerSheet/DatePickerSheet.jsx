/**
 * Import Modules
 */
import { Button } from "@/components/Button/Button";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Divider } from "../Divider/Divider";

export const DatePickerSheet = forwardRef(
  ({ onPressSelect, initialDate }, ref) => {
    const sheetRef = useRef(null);
    const initialDateRef = useRef(null);
    const theme = useTheme();
    const styles = useStyles(theme);
    const today = new Date();
    const insets = useSafeAreaInsets();
    const [datePickerKey, setDatePickerKey] = useState(0);
    const [selectedDate, setSelectedDate] = useState(today);

    // Bottom sheet snap point
    const snapPoints = useMemo(() => ["72%"], []);

    // Expose open/close methods to parent
    useImperativeHandle(ref, () => ({
      open: () => {
        initialDateRef.current = initialDate;

        const dateToSet = initialDate ?? today;
        setSelectedDate(dateToSet);

        setDatePickerKey((prev) => prev + 1);

        sheetRef.current?.snapToIndex(0);
      },
      close: () => sheetRef.current?.close(),
    }));

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    // Handle date change and restore any previously selected time slots
    const handleChangeDate = ({ date }) => {
      setSelectedDate(date);
    };

    // Finalize selection and call callback
    const handleSelect = () => {
      onPressSelect(selectedDate);
      sheetRef.current?.close();
    };

    const handleTodayPress = () => {
      const today = new Date();
      setSelectedDate(today);
      setDatePickerKey((prev) => prev + 1); // To update month view
    };

    // Render backdrop behind BottomSheet
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
        containerStyle={{ marginTop: insets.top }}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Select Date</Text>

          <TouchableOpacity
            onPress={handleTodayPress}
            style={styles.todayButton}
            disabled={isSameDay(selectedDate, new Date())}
          >
            <Text
              style={[
                styles.todayButtonText,
                isSameDay(selectedDate, new Date()) && {
                  color: theme.colors.textSecondary,
                  opacity: 0.5,
                },
              ]}
              variant="titleMedium"
            >
              Today
            </Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Body */}
        <View style={styles.container}>
          <DatePicker
            key={datePickerKey}
            mode="single"
            date={selectedDate}
            onChange={handleChangeDate}
          />

          <Button onPress={handleSelect} disabled={!selectedDate}>
            Select
          </Button>
        </View>
      </BottomSheet>
    );
  }
);

// Set display name
DatePickerSheet.displayName = "DatePickerSheet";

/**
 * useStyles - Specify styles to use for date picker sheet
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      paddingBottom: 6,
      paddingHorizontal: 16,
      gap: 32,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      flex: 1,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      position: "relative",
    },
    todayButton: {
      position: "absolute",
      right: 24,
    },
    todayButtonText: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });
