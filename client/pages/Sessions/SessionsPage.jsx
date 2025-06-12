import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import { useStyles } from "./SessionsPage.styles";
import { useSessionsQuery } from "@/services/api/sessions/useSessionsQuery";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { SessionItem } from "./components/SessionItem";

export const SessionsPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const { sessions, isFetching, refetch, isRefetching } = useSessionsQuery();

  return (
    <>
      <Pressable style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <Text variant="headlineSmall" style={{ marginBottom: 10 }}>
              Sessions {sessions.length > 0 && `(${sessions.length})`}
            </Text>
          }
          data={sessions}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
            />
          }
          scrollEnabled
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/sessions/${item._id}`,
                  params: { session: JSON.stringify(item) },
                })
              }
            >
              <SessionItem
                subject={item.subject}
                description={item.description}
                estimatedDuration={item.estimatedDuration}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyList
              iconName="book-open-page-variant"
              message="No Sessions Found"
              containerStyle={{ marginTop: 100 }}
              isLoading={isFetching}
            />
          }
        />
      </Pressable>
      <FAB
        icon="plus"
        customSize={56}
        color={theme.colors.inverseOnSurface}
        style={styles.fab}
        onPress={() => router.push("/sessions/addSession")}
      />
    </>
  );
};
