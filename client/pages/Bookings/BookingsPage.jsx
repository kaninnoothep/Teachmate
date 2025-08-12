/**
 * Import Modules
 */
import { useRouter } from "expo-router";
import {
  Alert,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Portal, Text, useTheme } from "react-native-paper";
import { useStyles } from "./BookingsPage.styles";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { useEffect, useRef, useState } from "react";
import { useBookingsQuery } from "@/services/api/bookings/useBookingsQuery";
import { useUser } from "@/context/UserProvider/UserProvider";
import { BookingItem } from "./components/BookingItem";
import { StickyFlatList } from "@/components/StickyFlatList/StickyFlatList";
import { PickerButton } from "@/components/Picker/PickerButton";
import { STATUS, StatusPickerSheet } from "./components/StatusPickerSheet";

/**
 * BookingsPage - Displays a list of bookings for the current user
 *
 * @returns JSX Element
 */
export const BookingsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles();
  const statusSheetRef = useRef(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [status, setStatus] = useState(STATUS[0]);
  const { bookings, isFetching, refetch } = useBookingsQuery(status.value);

  // Show alert if user hasn't completed their profile
  useEffect(() => {
    if (!user?.isProfileCompleted) {
      Alert.alert(
        "Set up your profile?",
        "You haven't completed setting up the profile yet",
        [
          { text: "Later" },
          {
            text: "Go to Profile",
            onPress: () => router.push("/profile"),
          },
        ]
      );
    }
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // Handle set status
  const handleStatusSelect = (value) => {
    setStatus(value);
  };

  // Renders greeting and title
  const renderHeaderComponent = () => (
    <Pressable style={styles.listHeaderContainer}>
      <Text variant="headlineMedium" style={styles.greetingText}>
        Hello,{" "}
        <Text
          variant="headlineMedium"
          style={[styles.greetingText, { color: theme.colors.primary }]}
        >
          {user.firstName}
        </Text>{" "}
        👋
      </Text>
      <Text variant="titleLarge" style={{ fontSize: 20 }}>
        Your bookings {user.role === "tutor" && "from students"}
      </Text>
    </Pressable>
  );

  // Renders sticky status picker button
  const renderStickyComponent = () => (
    <Pressable
      style={{
        width: "100%",
        padding: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <PickerButton
        value={status.label}
        onPress={() => statusSheetRef.current?.open()}
        hideHelperTextSpace
      />
    </Pressable>
  );
  const renderFooterComponent = () => <Pressable style={{ height: 50 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;

  return (
    <>
      <Pressable style={styles.container}>
        {/* Booking List */}
        <StickyFlatList
          customContainerStyle={{
            flex: 1,
          }}
          ListHeaderComponent={renderHeaderComponent}
          StickyElementComponent={renderStickyComponent}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={renderSeparatorComponent}
          data={bookings}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={handleRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/bookings/${item._id}`,
                  params: { booking: JSON.stringify(item) },
                })
              }
            >
              <BookingItem
                status={item.status}
                subject={item.session.subject}
                description={item.note}
                user={user.role === "tutor" ? item.student : item.tutor}
                date={item.date}
                time={item.startTime}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          removeClippedSubviews
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyList
              iconName="notebook"
              message="No bookings"
              containerStyle={{ marginTop: 100 }}
              isLoading={isFetching}
            />
          }
        />
      </Pressable>

      {/* Select Status Modal */}
      <Portal>
        <StatusPickerSheet ref={statusSheetRef} onSelect={handleStatusSelect} />
      </Portal>
    </>
  );
};
