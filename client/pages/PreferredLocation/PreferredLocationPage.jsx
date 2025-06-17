import { Button } from "@/components/Button/Button";

import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LocationOption } from "./units/LocationOption";
import { useSetPreferredLocationMutation } from "@/services/api/preferredLocation/useSetPreferredLocationMutation";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useLocalSearchParams } from "expo-router";

export const LOCATION_OPTIONS = [
  { value: "publicPlace", label: "In a Public Place" },
  { value: "tutorPlace", label: "At Tutor's Place" },
  { value: "online", label: "Online" },
];

export const PreferredLocationPage = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const { preferredLocations } = useLocalSearchParams();
  const { mutateAsync: setPreferredLocations } =
    useSetPreferredLocationMutation({});

  // Initialize selectedLocations from fetched preferredLocations
  useEffect(() => {
    if (preferredLocations) {
      try {
        const parsedPreferredLocations = JSON.parse(preferredLocations);
        const selected = Object.entries(parsedPreferredLocations)
          .filter(([, isSelected]) => isSelected)
          .map(([key]) => key);
        setSelectedLocations(selected);
      } catch (err) {
        console.warn("Failed to parse preferred locations:", err);
      }
    }
  }, [preferredLocations, setSelectedLocations]);

  const handleToggleLocation = (locationValue) => {
    setSelectedLocations((prev) => {
      if (prev.includes(locationValue)) {
        return prev.filter((value) => value !== locationValue);
      } else {
        return [...prev, locationValue];
      }
    });
  };

  const handleSave = async () => {
    const payload = {
      publicPlace: selectedLocations.includes("publicPlace"),
      tutorPlace: selectedLocations.includes("tutorPlace"),
      online: selectedLocations.includes("online"),
    };

    await setPreferredLocations(payload, {
      onSuccess: (data) => {
        handleSetUser({ data: { ...user, preferredLocations: data.data } });
        Toast.show({ type: "success", text1: data.message });
        router.back();
      },
      onError: (error) => {
        Toast.show({ type: "error", text1: error.message });
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable style={styles.container}>
        <Text variant="headlineSmall">Select your preferred location</Text>

        <View style={styles.listContainer}>
          {LOCATION_OPTIONS.map((option) => (
            <LocationOption
              key={option.value}
              option={option}
              isSelected={selectedLocations.includes(option.value)}
              onToggle={handleToggleLocation}
            />
          ))}
        </View>

        <Button onPress={handleSave} style={{ marginTop: 16 }}>
          Save
        </Button>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  container: {
    paddingHorizontal: 16,
    gap: 24,
  },
  listContainer: {
    gap: 12,
  },
});
