import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useEducationForm } from "./hooks/useEducationForm";
import { MonthYearPicker } from "@/components/MonthYearPicker/MonthYearPicker";
import { DatePickerButton } from "@/components/MonthYearPicker/DatePickerButton";

export const EducationPage = () => {
  const { educationId } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit } = useEducationForm();

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const isAdd = useMemo(() => !educationId, [educationId]);

  const pageTitle = () => (isAdd ? "Add Education" : "Update Education");

  const handleStartDateSelect = (dateData) => {
    setStartDate(dateData);
  };

  const handleEndDateSelect = (dateData) => {
    setEndDate(dateData);
  };

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

          {/* Start Date */}
          <DatePickerButton
            label="Start Date"
            value={startDate}
            onPress={() => setShowStartDatePicker(true)}
            containerStyles={{ marginBottom: 26, marginTop: 6 }}
          />

          {/* End Date */}
          <DatePickerButton
            label="End Date"
            value={endDate}
            onPress={() => setShowEndDatePicker(true)}
            containerStyles={{ marginBottom: 28 }}
          />

          <Button onPress={handleSubmit}>{pageTitle()}</Button>
        </View>

        {!isAdd && (
          <>
            <Divider style={{ marginVertical: 20 }} />

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
          </>
        )}
      </Pressable>

      {/* Start Date Picker Modal */}
      <MonthYearPicker
        isVisible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelect={handleStartDateSelect}
        initialMonth={startDate?.month || ""}
        initialYear={startDate?.year || ""}
        title="Select Start Date"
      />

      {/* End Date Picker Modal */}
      <MonthYearPicker
        isVisible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onSelect={handleEndDateSelect}
        initialMonth={endDate?.month || ""}
        initialYear={endDate?.year || ""}
        title="Select End Date"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
  },
  dateInputContainer: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
});
