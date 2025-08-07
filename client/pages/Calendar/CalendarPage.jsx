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

export const CalendarPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const calendarRef = useRef(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );
  const { bookings, markedDates, isFetching, refetch } =
    useBookingsCalendarQuery(selectedDate);

  // Sort items by start time for proper timeline order
  const itemsForDate = (bookings[selectedDate] || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

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
    <Pressable style={{ flex: 1 }}>
      <CalendarProvider
        date={selectedDate}
        showTodayButton
        todayBottomMargin={20}
        onDateChanged={handleDateChange}
        theme={{ ...calendarTheme, todayButtonTextColor: theme.colors.primary }}
      >
        <ExpandableCalendar
          ref={calendarRef}
          disablePan={true}
          initialPosition="open"
          hideKnob
          disableWeekScroll
          closeOnDayPress={false}
          markedDates={markedDates}
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
            textDayStyle: { fontSize: 14, paddingTop: 2 },
            "stylesheet.day.basic": {
              selected: {
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
              },
              today: {
                borderRadius: 8,
                backgroundColor: theme.colors.infoBackground,
              },
            },
          }}
        />

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
              user={item.student}
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

const useStyles = (theme) =>
  StyleSheet.create({
    listContainer: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    list: {
      backgroundColor: theme.colors.onSurfaceGrey,
    },
  });
