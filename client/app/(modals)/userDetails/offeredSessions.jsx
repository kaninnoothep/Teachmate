/**
 * Import Modules
 */
import { SessionsPage } from "@/pages/Sessions/SessionsPage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

/**
 * OfferedSessionsScreen - Displays sessions offered by a tutor in read-only view.
 *
 * @returns JSX Element
 */
export default function OfferredSessionsScreen() {
  const router = useRouter();
  const { sessions, userName } = useLocalSearchParams();

  // Parse the sessions from query parameters
  const parsedSessions = useMemo(() => {
    try {
      return JSON.parse(sessions);
    } catch {
      return [];
    }
  }, [sessions]);

  return (
    <SessionsPage
      sessions={parsedSessions}
      headerTitle={`${userName}'s Sessions`}
      onSessionPress={(item) =>
        router.push({
          pathname: `/(modals)/userDetails/sessionDetails`,
          params: { session: JSON.stringify(item) },
        })
      }
      externalView
    />
  );
}
