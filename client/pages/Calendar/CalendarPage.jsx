import { useRef, useState } from "react";
import {
  CalendarProvider,
  ExpandableCalendar,
  calendarTheme,
} from "react-native-calendars";
import { StyleSheet, Pressable, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "react-native-paper";
import { CalendarItem } from "./components/CalendarItem";
import { EmptyList } from "@/components/EmptyList/EmptyList";

// Sample agenda data grouped by date
const agendaData = {
  "2025-08-04": [
    {
      id: "1",
      session: { subject: "Calculus II" },
      note: "Lorem ipsum bibendum pretium tincidunt integer quis adipiscing molestie scelerisque.",
      status: "confirmed",
      startTime: "13:00",
      endTime: "15:00",
      tutor: { image: "123", firstName: "Jessy", lastName: "Lee" },
      student: { image: "123", firstName: "Jessy", lastName: "Lee" },
    },
    {
      id: "2",
      session: { subject: "Physics Lab" },
      note: "Laboratory session for quantum mechanics experiments and analysis.",
      status: "finished",
      startTime: "16:00",
      endTime: "18:00",
      tutor: { image: "123", firstName: "Alex", lastName: "Smith" },
      student: { image: "123", firstName: "Alex", lastName: "Smith" },
    },
  ],
  "2025-08-05": [
    {
      id: "3",
      session: { subject: "Linear Algebra Linear Algebra Linear Algebra" },
      note: "Matrix operations and eigenvalue decomposition Matrix operations and eigenvalue decomposition review session.",
      status: "confirmed",
      startTime: "09:00",
      endTime: "11:00",
      tutor: { image: "123", firstName: "Maria", lastName: "Garcia" },
      student: { image: "123", firstName: "Maria", lastName: "Garcia" },
    },
    {
      id: "12",
      session: { subject: "Linear Algebra" },
      note: "Matrix operations and eigenvalue decomposition review session.",
      status: "confirmed",
      startTime: "12:00",
      endTime: "13:00",
      tutor: { image: "123", firstName: "Maria", lastName: "Garcia" },
      student: { image: "123", firstName: "Maria", lastName: "Garcia" },
    },
    {
      id: "11",
      session: { subject: "Linear Algebra" },
      note: "Matrix operations and eigenvalue decomposition review session.",
      status: "confirmed",
      startTime: "20:00",
      endTime: "21:00",
      tutor: { image: "123", firstName: "Maria", lastName: "Garcia" },
      student: { image: "123", firstName: "Maria", lastName: "Garcia" },
    },
    {
      id: "4",
      session: { subject: "Data Structures" },
      note: "Binary trees and graph algorithms implementation workshop.",
      status: "confirmed",
      startTime: "14:00",
      endTime: "16:00",
      tutor: { image: "123", firstName: "John", lastName: "Doe" },
      student: { image: "123", firstName: "John", lastName: "Doe" },
    },
    {
      id: "5",
      session: { subject: "Statistics" },
      note: "",
      status: "confirmed",
      startTime: "16:00",
      endTime: "21:00",
      tutor: { image: "123", firstName: "Sarah", lastName: "Wilson" },
      student: { image: "123", firstName: "Sarah", lastName: "Wilson" },
    },
  ],
  "2025-08-06": [
    {
      id: "6",
      session: { subject: "Organic Chemistry" },
      note: "Reaction mechanisms and synthesis pathways discussion.",
      status: "confirmed",
      startTime: "10:00",
      endTime: "12:00",
      tutor: { image: "123", firstName: "David", lastName: "Brown" },
      student: { image: "123", firstName: "David", lastName: "Brown" },
    },
  ],
};

export const CalendarPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const calendarRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  );

  const marked = {
    "2025-08-04": { marked: true },
    "2025-08-05": { marked: true },
    "2025-08-06": { marked: true },
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Sort items by start time for proper timeline order
  const itemsForDate = (agendaData[selectedDate] || []).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
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
          markedDates={marked}
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
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={renderSeparatorComponent}
          style={styles.list}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CalendarItem
              subject={item.session.subject}
              description={item.note}
              status={item.status}
              startTime={item.startTime}
              endTime={item.endTime}
              user={item.student}
              onPress={() => router.push(`/calendar/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <EmptyList
              iconName="calendar"
              iconSize={100}
              message="No events on this day"
              containerStyle={{ flex: 1, marginTop: 60 }}
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
