/**
 * Import Modules
 */
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button } from "@/components/Button/Button";
import { useTheme } from "react-native-paper";

const { height: screenHeight } = Dimensions.get("window");

/**
 * MonthYearPicker - A modal component for picking month and year
 *
 * @param {*} props
 * @returns JSX Element
 */
export const MonthYearPicker = ({
  isVisible,
  onClose,
  onSelect,
  initialMonth = "",
  initialYear = "",
  title = "Select Date",
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [selectedYear, setSelectedYear] = useState(initialYear);

  // List of all months
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // List of years (past 100 years)
  const years = Array.from(
    { length: 100 },
    (_, i) => currentYear - i
  ).reverse();

  // Filter out future months for current year
  const getAvailableMonths = (year) => {
    const yearNum = parseInt(year);
    if (yearNum === currentYear) {
      return months.filter((month) => parseInt(month.value) <= currentMonth);
    }
    return months;
  };

  // Create an object with formatted values for selection
  const createSelection = (month, year) => {
    if (month && year) {
      const monthLabel = months.find((m) => m.value === month)?.label;
      return {
        month,
        year,
        displayText: `${monthLabel} ${year}`,
      };
    }
    if (year) {
      return {
        month,
        year,
        displayText: year,
      };
    }
    return null;
  };

  // Reset to current month/year when picker opens if no initial values
  useEffect(() => {
    if (isVisible) {
      if (!initialMonth && !initialYear) {
        setSelectedMonth(String(currentMonth).padStart(2, "0"));
        setSelectedYear(String(currentYear));
        onSelect(
          createSelection(
            String(currentMonth).padStart(2, "0"),
            String(currentYear)
          )
        );
      } else if (selectedYear) {
        onSelect(createSelection(selectedMonth, selectedYear));
      }
    }
  }, [isVisible]);

  // Handle month change
  const handleMonthChange = (itemValue) => {
    setSelectedMonth(itemValue);
    onSelect(createSelection(itemValue, selectedYear));
  };

  // Handle year change and validate month
  const handleYearChange = (itemValue) => {
    setSelectedYear(itemValue);

    // Check if current month is still valid for the selected year
    const yearNum = parseInt(itemValue);
    let finalMonth = selectedMonth;

    if (
      yearNum === currentYear &&
      selectedMonth &&
      parseInt(selectedMonth) > currentMonth
    ) {
      finalMonth = "";
      setSelectedMonth("");
    }

    onSelect(createSelection(finalMonth, itemValue));
  };

  // Clear selection and close modal
  const handleClear = () => {
    setSelectedMonth("");
    setSelectedYear("");
    onSelect(null);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.container} activeOpacity={1}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Month and Year Pickers */}
          <View style={styles.pickersContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={handleMonthChange}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {getAvailableMonths(selectedYear).map((month) => (
                  <Picker.Item
                    key={month.value}
                    label={month.label}
                    value={month.value}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Year</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={handleYearChange}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {years.map((year) => (
                  <Picker.Item
                    key={year}
                    label={String(year)}
                    value={String(year)}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={handleClear}
              variant="black-outlined"
              style={styles.button}
            >
              Clear
            </Button>
            <Button onPress={onClose} style={styles.button}>
              Done
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

/**
 * useStyles - Specify styles for MonthYearPicker
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      paddingBottom: 52,
      maxHeight: screenHeight * 0.6,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
    },
    pickersContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    pickerWrapper: {
      flex: 1,
      marginHorizontal: 5,
    },
    pickerLabel: {
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    picker: {
      height: 200,
      color: theme.colors.text,
    },
    pickerItem: {
      color: theme.colors.text,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });
