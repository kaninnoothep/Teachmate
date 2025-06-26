/**
 * Import Modules
 */
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

/**
 * ExternalSessionDetailPage - Displays an external view for a list of sessions
 *
 * @returns JSX Element
 */
export const ExternalSessionDetailPage = () => {
  const { session } = useLocalSearchParams();
  const [sessionState] = useState(JSON.parse(session));

  return (
    <ScrollView style={styles.scrollContainer}>
      <Pressable style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          {sessionState.subject}
        </Text>

        <InfoBox label="Estimated Duration">
          <Text variant="bodyLarge">
            {sessionState.estimatedDuration} hour
            {+sessionState.estimatedDuration > 1 ? "s" : ""}
          </Text>
        </InfoBox>

        <InfoBox label="Description">
          <Text variant="bodyLarge">{sessionState.description}</Text>
        </InfoBox>
      </Pressable>
    </ScrollView>
  );
};

/**
 * Specify Styles to use
 */
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
});
