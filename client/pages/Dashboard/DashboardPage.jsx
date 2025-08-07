/**
 * Import Modules
 */
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Text, useTheme } from "react-native-paper";
import { ChartSection } from "./components/ChartSection";
import { ViewWithDimensions } from "@/components/ViewWithDimensions/ViewWithDimensions";

export const DashboardPage = () => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const weekBarData = [
    { value: 25, label: "Sun" },
    { value: 0, label: "Mon" },
    { value: 0, label: "Tue" },
    { value: 0, label: "Wed" },
    { value: 0, label: "Thu" },
    { value: 0, label: "Fri" },
    { value: 19, label: "Sat" },
  ];

  const monthBarData = [
    { value: 120, label: "Jun 29" },
    { value: 20, label: "Jul 6" },
    { value: 0, label: "Jul 13" },
    { value: 0, label: "Jul 20" },
    { value: 50, label: "Jul 27" },
    { value: 40, label: "Jul 6" },
  ];

  const getSpacing = (width, padding = 40, barWidth, data) =>
    (width - padding - barWidth * data.length) / data.length - 1;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <Pressable>
        <View style={styles.container}>
          <Text variant="headlineSmall">Dashboard</Text>

          <ChartSection
            title="Week Overview"
            subtitle={"Jul 13, 2025 - Jul 19, 2025"}
            legend="Finished Bookings (hrs)"
          >
            <ViewWithDimensions style={styles.chartWrapper}>
              {({ width }) => (
                <BarChart
                  data={weekBarData}
                  barWidth={24}
                  barBorderRadius={4}
                  frontColor={theme.colors.primary}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  noOfSections={5}
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
              )}
            </ViewWithDimensions>
          </ChartSection>

          <ChartSection
            title="Month Overview"
            subtitle={"July 2025"}
            legend="Finished Bookings (hrs)"
          >
            <ViewWithDimensions style={styles.chartWrapper}>
              {({ width }) => (
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
              )}
            </ViewWithDimensions>
          </ChartSection>
        </View>
      </Pressable>
    </ScrollView>
  );
};

/**
 * useStyles - Specify styles for Dashboard page
 *
 * @returns StyleSheet object
 */
const useStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      gap: 20,
    },
    chartWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
