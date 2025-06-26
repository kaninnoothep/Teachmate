/**
 * Import Modules
 */
import { SessionsPage } from "@/pages/Sessions/SessionsPage";
import { useSessionsQuery } from "@/services/api/sessions/useSessionsQuery";
import { useRouter } from "expo-router";

/**
 * SessionsScreen - Screen to display list of sessions
 *
 * @returns JSX Element rendering the sessions page with data
 */
export default function SessionsScreen() {
  const { sessions, isFetching, refetch } = useSessionsQuery();
  const router = useRouter();

  return (
    <SessionsPage
      sessions={sessions}
      isFetching={isFetching}
      refetch={refetch}
      onSessionPress={(item) =>
        router.push({
          pathname: `/sessions/${item._id}`,
          params: { session: JSON.stringify(item) },
        })
      }
    />
  );
}
