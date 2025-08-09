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

export const DashboardPage = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    data: weekBarData,
    range,
    isFetching: isWeekFetching,
  } = useWeeklyBookingHoursQuery(selectedDate);
  const {
    data: monthBarData,
    monthLabel,
    isFetching: isMonthFetching,
  } = useMonthlyBookingHoursQuery(selectedDate);

  const getSpacing = (width, padding = 40, barWidth, data) =>
    (width - padding - barWidth * data.length) / data.length - 1;

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
        <Text variant="headlineSmall" style={styles.titleContainer}>
          Dashboard
        </Text>

        <View style={styles.picker}>
          <PickerButton
            value={dayjs(selectedDate).format("MMMM D, YYYY")}
            iconName="calendar"
            iconSize={20}
            iconColor={theme.colors.primary}
            hideHelperTextSpace
            onPress={() => datePickerRef.current?.open()}
          />
        </View>

        <Pressable style={styles.chartContainer}>
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
                    noOfSections={4}
                    stepValue={5}
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

          <ChartSection
            title="Month Overview"
            subtitle={monthLabel}
            legend="Finished Bookings (hrs)"
          >
            <ViewWithDimensions style={styles.chartWrapper}>
              {({ width, height }) =>
                isMonthFetching ? (
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
                    noOfSections={6}
                    stepValue={20}
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
                )
              }
            </ViewWithDimensions>
          </ChartSection>
        </Pressable>
      </ScrollView>

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
