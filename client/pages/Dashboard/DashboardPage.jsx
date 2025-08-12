/**
 * Import Modules
 */
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { ActivityIndicator, Portal, Text, useTheme } from "react-native-paper";
import { ChartSection } from "./components/ChartSection";
import { ViewWithDimensions } from "@/components/ViewWithDimensions/ViewWithDimensions";
import { useWeeklyBookingHoursQuery } from "@/services/api/dashboard/useWeeklyBookingHoursQuery";
import { useMonthlyBookingHoursQuery } from "@/services/api/dashboard/useMonthlyBookingHoursQuery";
import { useRef, useState } from "react";
import { PickerButton } from "@/components/Picker/PickerButton";
import { DatePickerSheet } from "@/components/DatePickerSheet/DatePickerSheet";
import dayjs from "dayjs";

/**
 * DashboardPage - Displays dashboard with weekly and monthly booking hour charts,
 * and allows date selection to filter the displayed data.
 *
 * @returns JSX.Element rendering the dashboard page
 */
export const DashboardPage = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch weekly booking hour data and range string based on selectedDate
  const {
    data: weekBarData,
    range,
    isFetching: isWeekFetching,
  } = useWeeklyBookingHoursQuery(selectedDate);

  // Fetch monthly booking hour data and label based on selectedDate
  const {
    data: monthBarData,
    monthLabel,
    isFetching: isMonthFetching,
  } = useMonthlyBookingHoursQuery(selectedDate);

  // Calculate spacing between bars in the bar chart
  const getSpacing = (width, padding = 40, barWidth, data) =>
    (width - padding - barWidth * data.length) / data.length - 1;

  // Determine the number of Y-axis sections on the chart
  const getNoOfSections = (data, stepValue, defaultNoOfSections) => {
    if (!Array.isArray(data) || data.length === 0) return defaultNoOfSections;

    const maxVal = Math.max(...data.map((item) => item.value || 0));

    // If no data or all values are small, use default sections
    if (maxVal === 0 || maxVal < stepValue * defaultNoOfSections) {
      return defaultNoOfSections;
    }

    return Math.ceil(maxVal / stepValue);
  };

  // Determine stepValue and noOfSections for the monthly chart
  const getMonthlyChartScale = (data, defaultNoOfSections) => {
    if (!Array.isArray(data) || data.length === 0) {
      return { stepValue: 10, noOfSections: defaultNoOfSections };
    }

    const maxVal = Math.max(...data.map((item) => item.value || 0));

    if (maxVal === 0) {
      return { stepValue: 10, noOfSections: defaultNoOfSections };
    }

    // Smaller value get 10 steps, bigger value 20 steps
    const stepValue = maxVal <= 60 ? 10 : 20;

    // Adjust sections dynamically, but don’t go below default
    let noOfSections = Math.ceil(maxVal / stepValue);
    if (maxVal < stepValue * defaultNoOfSections) {
      noOfSections = defaultNoOfSections;
    }

    return { stepValue, noOfSections };
  };

  // Handle update selected date
  const handleSelectDateTime = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text variant="headlineSmall" style={styles.titleContainer}>
          Dashboard
        </Text>

        {/* Date picker trigger button */}
        <View style={styles.picker}>
          <PickerButton
            value={dayjs(selectedDate).format("dddd,  MMMM D, YYYY")}
            iconName="calendar"
            iconSize={20}
            iconColor={theme.colors.primary}
            hideHelperTextSpace
            onPress={() => datePickerRef.current?.open()}
          />
        </View>

        <Pressable style={styles.chartContainer}>
          {/* Weekly booking hours chart section */}
          <ChartSection
            title="Week Overview"
            subtitle={range}
            legend="Finished Bookings (hrs)"
          >
            <ViewWithDimensions style={styles.chartWrapper}>
              {({ width, height }) =>
                isWeekFetching ? (
                  <View
                    style={[
                      styles.loadingContainer,
                      {
                        minHeight: height,
                      },
                    ]}
                  >
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                  </View>
                ) : (
                  <BarChart
                    data={weekBarData}
                    barWidth={24}
                    barBorderRadius={4}
                    frontColor={theme.colors.primary}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    stepValue={5}
                    noOfSections={getNoOfSections(weekBarData, 5, 4)}
                    xAxisColor={theme.colors.grey}
                    showValuesAsTopLabel
                    topLabelTextStyle={{
                      color: theme.colors.textSecondary,
                      marginBottom: 2,
                    }}
                    showFractionalValues={false}
                    initialSpacing={12}
                    endSpacing={8}
                    adjustToWidth
                    highlightEnabled
                    width={width - 44}
                    spacing={getSpacing(width, 40, 24, weekBarData)}
                    yAxisExtraHeight={20}
                    disableScroll
                  />
                )
              }
            </ViewWithDimensions>
          </ChartSection>

          {/* Monthly booking hours chart section */}
          <ChartSection
            title="Month Overview"
            subtitle={monthLabel}
            legend="Finished Bookings (hrs)"
          >
            <ViewWithDimensions style={styles.chartWrapper}>
              {({ width, height }) => {
                const monthScale = getMonthlyChartScale(monthBarData, 4);
                return isMonthFetching ? (
                  <View
                    style={[
                      styles.loadingContainer,
                      {
                        minHeight: height,
                      },
                    ]}
                  >
                    <ActivityIndicator
                      size="large"
                      color={theme.colors.primary}
                    />
                  </View>
                ) : (
                  <BarChart
                    data={monthBarData}
                    barWidth={26}
                    barBorderRadius={4}
                    frontColor={theme.colors.primary}
                    yAxisThickness={0}
                    xAxisThickness={1}
                    topLabelContainerStyle={{
                      width: 26,
                      alignSelf: "center",
                    }}
                    stepValue={monthScale.stepValue}
                    noOfSections={monthScale.noOfSections}
                    xAxisColor={theme.colors.grey}
                    showValuesAsTopLabel
                    topLabelTextStyle={{
                      color: theme.colors.textSecondary,
                      marginBottom: 2,
                    }}
                    showFractionalValues={false}
                    initialSpacing={16}
                    endSpacing={10}
                    adjustToWidth
                    highlightEnabled
                    rotateLabel
                    width={width - 46}
                    spacing={getSpacing(width, 40, 26, monthBarData)}
                    labelsExtraHeight={32}
                    yAxisExtraHeight={20}
                    disableScroll
                  />
                );
              }}
            </ViewWithDimensions>
          </ChartSection>
        </Pressable>
      </ScrollView>

      {/* Date picker modal */}
      <Portal>
        <DatePickerSheet
          ref={datePickerRef}
          onPressSelect={handleSelectDateTime}
          initialDate={selectedDate}
        />
      </Portal>
    </>
  );
};

/**
 * useStyles - Specify styles for Dashboard page
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    titleContainer: {
      paddingHorizontal: 16,
      marginTop: 20,
      marginBottom: 4,
    },
    picker: {
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    chartContainer: {
      paddingHorizontal: 16,
      gap: 16,
    },
    chartWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });
