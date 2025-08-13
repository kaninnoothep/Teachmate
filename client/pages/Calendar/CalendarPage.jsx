/**
 * Import Modules
 */
import { useRef, useState } from "react";
import {
  CalendarProvider,
  ExpandableCalendar,
  calendarTheme,
} from "react-native-calendars";
import { StyleSheet, Pressable, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { CalendarItem } from "./components/CalendarItem";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { useBookingsCalendarQuery } from "@/services/api/bookings/useBookingsCalendarQuery";
import { useUser } from "@/context/UserProvider/UserProvider";
import dayjs from "dayjs";

/**
 * CalendarPage - Displays a calendar view and a list of bookings/events for the selected date.
 *
 * @returns JSX.Element rendering the calendar page
 */
export const CalendarPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const calendarRef = useRef(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  // Fetch bookings and marked dates for calendar based on selectedDate
  const { bookings, markedDates, isFetching, refetch } =
    useBookingsCalendarQuery(selectedDate);

  // Sort bookings for selected date by start time for timeline order
  const itemsForDate = (bookings[selectedDate] || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  // Handle update selected date
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const renderFooterComponent = () => <Pressable style={{ height: 50 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;
  return (
    <Pressable style={styles.container}>
      <CalendarProvider
        date={selectedDate}
        showTodayButton
        todayBottomMargin={20}
        onDateChanged={handleDateChange}
        theme={{ ...calendarTheme, todayButtonTextColor: theme.colors.primary }}
      >
        {/* Calendar */}
        <ExpandableCalendar
          ref={calendarRef}
          disablePan
          initialPosition="open"
          hideKnob
          disableWeekScroll
          closeOnDayPress={false}
          markedDates={markedDates}
          style={styles.calendar}
          theme={{
            ...calendarTheme,
            dayTextColor: theme.colors.text,
            monthTextColor: theme.colors.text,
            arrowColor: theme.colors.textSecondary,
            dotColor: theme.colors.primary,
            todayTextColor: theme.colors.text,
            todayDotColor: theme.colors.primary,
            textMonthFontWeight: 600,
            textDayFontWeight: 400,
            textDayStyle: {
              fontSize: 14,
            },
            selectedDotColor: theme.colors.primary,
            "stylesheet.day.basic": {
              base: {
                width: 32,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
              },
              selected: {
                backgroundColor: theme.colors.onSurfacePrimary,
                borderWidth: 1,
                borderColor: theme.colors.primary,
                borderRadius: 8,
              },
              selectedText: {
                fontWeight: "600",
                color: theme.colors.primary,
              },
              today: {
                borderRadius: 8,
                backgroundColor: theme.colors.infoBackground,
              },
            },
          }}
        />

        {/* List of bookings/events for the selected date */}
        <FlatList
          data={itemsForDate}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={renderSeparatorComponent}
          style={styles.list}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={handleRefresh}
            />
          }
          renderItem={({ item }) => (
            <CalendarItem
              subject={item.session.subject}
              description={item.note}
              status={item.status}
              startTime={item.startTime}
              endTime={item.endTime}
              user={user.role === "tutor" ? item.student : item.tutor}
              onPress={() => router.push(`/calendar/${item._id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyList
              iconName="calendar"
              iconSize={100}
              message="No events on this day"
              containerStyle={{ flex: 1, marginTop: 60 }}
              isLoading={isFetching}
            />
          }
        />
      </CalendarProvider>
    </Pressable>
  );
};

/**
 * useStyles - Specify styles for calendar page
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    calendar: {
      marginTop: -4,
      paddingBottom: 2,
    },
    listContainer: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    list: {
      backgroundColor: theme.colors.onSurfaceGrey,
    },
  });
