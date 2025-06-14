import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useStyles } from "./BookingsPage.styles";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { useState } from "react";
import { useBookingsQuery } from "@/services/api/bookings/useBookingsQuery";
import { useUser } from "@/context/UserProvider/UserProvider";
import { BookingItem } from "./components/BookingItem";

export const BookingsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const { bookings, isFetching, refetch } = useBookingsQuery("active");

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const renderHeaderComponent = () => (
    <View style={styles.listHeaderContainer}>
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
    </View>
  );

  return (
    <Pressable style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeaderComponent}
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
              subject={item.session.subject}
              description={item.note}
              user={user.role === "tutor" ? item.student : item.tutor}
              date={item.date}
              time={item.startTime}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
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
  );
};
