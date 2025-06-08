import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useEducationForm } from "./hooks/useEducationForm";

export const EducationPage = () => {
  const { educationId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit } = useEducationForm();

  const isAdd = useMemo(() => !educationId, [educationId]);

  const pageTitle = () => (isAdd ? "Add Education" : "Update Education");

  return (
    <ScrollView style={{ paddingBottom: 40 }}>
      <Pressable>
        <View style={styles.container}>
          <Text variant="headlineSmall">{pageTitle()}</Text>

          <FormTextInput
            name="school"
            label="School *"
            placeholder="e.g., University of Regina"
            fullWidth
            {...{ control }}
          />

          <FormTextInput
            name="degree"
            label="Degree"
            placeholder="e.g., Master of Science "
            fullWidth
            {...{ control }}
          />

          <FormTextInput
            name="fieldOfStudy"
            label="Field of Study"
            placeholder="e.g., Mathematics"
            fullWidth
            {...{ control }}
          />

          <Button onPress={handleSubmit}>{pageTitle()}</Button>
        </View>

        <Divider />

        <View style={styles.container}>
          <Button
            onPress={handleSubmit}
            variant="red-outlined"
            icon={({ color }) => (
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={color}
              />
            )}
          >
            Delete Education
          </Button>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
});
