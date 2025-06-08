import { Button } from "@/components/Button/Button";

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LocationOption } from "./units/LocationOption";

const LOCATION_OPTIONS = [
  { value: "public", label: "In a Public Place" },
  { value: "tutor", label: "At Tutor's Place" },
  { value: "online", label: "Online" },
];

export const PreferredLocationPage = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);

  const handleToggleLocation = (locationValue) => {
    setSelectedLocations((prev) => {
      if (prev.includes(locationValue)) {
        return prev.filter((value) => value !== locationValue);
      } else {
        return [...prev, locationValue];
      }
    });
  };

  const handleSave = () => {
    console.log("Selected locations:", selectedLocations);
    // Handle save logic here
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
