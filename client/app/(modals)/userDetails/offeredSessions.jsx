import { SessionsPage } from "@/pages/Sessions/SessionsPage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function OfferredSessionsScreen() {
  const router = useRouter();
  const { sessions, userName } = useLocalSearchParams();
  const [sessionsState] = useState(JSON.parse(sessions));

  return (
    <SessionsPage
      sessions={sessionsState}
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
