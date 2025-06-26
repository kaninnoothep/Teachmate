/**
 * Import Modules
 */
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import { useStyles } from "./SessionsPage.styles";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { SessionItem } from "./components/SessionItem";
import { useState } from "react";

/**
 * SessionsPage - Displays a list of sessions
 *
 * @param {object} props
 * @returns JSX Element
 */
export const SessionsPage = ({
  sessions,
  headerTitle = "Sessions",
  isFetching = false,
  refetch = () => {},
  externalView = false,
  onSessionPress = () => {},
}) => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  // Renders title
  const renderHeaderComponent = () => (
    <Pressable style={{ paddingVertical: 20 }}>
      <Text variant="headlineSmall">
        {headerTitle} {sessions.length > 0 && `(${sessions.length})`}
      </Text>
    </Pressable>
  );
  const renderFooterComponent = () => <Pressable style={{ height: 90 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;

  return (
    <>
      <Pressable style={styles.container}>
        <FlatList
          ListHeaderComponent={renderHeaderComponent}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={renderSeparatorComponent}
          data={sessions}
          showsVerticalScrollIndicator={false}
          refreshControl={
            !externalView && (
              <RefreshControl
                refreshing={isManualRefreshing}
                onRefresh={handleRefresh}
              />
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSessionPress(item)}>
              <SessionItem
                subject={item.subject}
                description={item.description}
                estimatedDuration={item.estimatedDuration}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          removeClippedSubviews
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyList
              iconName="book-open-page-variant"
              message="No sessions found"
              containerStyle={{ marginTop: 100 }}
              isLoading={isFetching}
            />
          }
        />
      </Pressable>
      {!externalView && (
        <FAB
          icon="plus"
          customSize={56}
          color={theme.colors.inverseOnSurface}
          style={styles.fab}
          onPress={() => router.push("/sessions/addSession")}
        />
      )}
    </>
  );
};
