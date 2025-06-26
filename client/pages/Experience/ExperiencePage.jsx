/**
 * Import Modules
 */
import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useExperienceForm } from "./hooks/useExperienceForm";
import { MonthYearPicker } from "@/components/MonthYearPicker/MonthYearPicker";
import { DatePickerButton } from "@/components/MonthYearPicker/DatePickerButton";
import { useUser } from "@/context/UserProvider/UserProvider";
import { useDeleteExperienceMutation } from "@/services/api/experience/useDeleteExperienceMutation";
import { sortByEndDate } from "@/utils/sortByEndDate";
import Toast from "react-native-toast-message";

/**
 * ExperiencePage - Displays the experience form page for adding or updating a user's experience entry.
 *
 * @returns JSX Element rendering the experience form
 */
export const ExperiencePage = () => {
  const { experienceId } = useLocalSearchParams();
  const { user, handleSetUser } = useUser();
  const router = useRouter();

  // Hook to handle form state and validation
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useExperienceForm();

  // Delete mutation for experience entry
  const { mutateAsync: deleteExperience } = useDeleteExperienceMutation({
    onSuccess: (response) => {
      // Remove deleted experience entry from user and update state
      let newExperience = user.experience?.filter(
        (item) => item._id !== response.data._id
      );
      handleSetUser({
        data: { ...user, experience: sortByEndDate(newExperience) },
      });
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // State for date picker visibility
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Watch start and end date values from the form
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Check if this is an add or update operation
  const isAdd = useMemo(() => !experienceId, [experienceId]);

  const pageTitle = () => (isAdd ? "Add Experience" : "Update Experience");

  // Handle delete experience with alert confirmation
  const handleDeleteExperience = () => {
    Alert.alert("Are you sure you want to delete this experience?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteExperience(experienceId),
        style: "destructive",
      },
    ]);
  };

  // Handle set start date on the form value with the dateData object
  const handleStartDateSelect = (dateData) => {
    setValue("startDate", dateData);
  };

  // Handle set end date on the form value with the dateData object
  const handleEndDateSelect = (dateData) => {
    setValue("endDate", dateData);
  };

  return (
    <ScrollView style={{ paddingBottom: 40 }}>
      <Pressable>
        <View style={styles.container}>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            {pageTitle()}
          </Text>

          {/* Title input */}
          <FormTextInput
            name="title"
            label="Title *"
            placeholder="e.g., Software Developer"
            fullWidth
            {...{ control }}
          />

          {/* Company or Organization input */}
          <FormTextInput
            name="company"
            label="Company or Organization"
            placeholder="e.g., Microsoft"
            fullWidth
            {...{ control }}
          />

          {/* Start Date picker */}
          <DatePickerButton
            label="Start Date"
            value={startDate}
            onPress={() => setShowStartDatePicker(true)}
            containerStyles={{ marginBottom: 10, marginTop: 6 }}
            helperText={errors.startDate?.message}
            isError={errors.startDate?.message}
          />

          {/* End Date picker */}
          <DatePickerButton
            label="End Date"
            value={endDate}
            onPress={() => setShowEndDatePicker(true)}
            containerStyles={{ marginBottom: 18 }}
            helperText={errors.endDate?.message}
            isError={errors.endDate?.message}
          />

          {/* Submit button */}
          <Button onPress={handleSubmit}>{pageTitle()}</Button>
        </View>

        {/* Show delete button only in update mode */}
        {!isAdd && (
          <>
            <Divider style={{ marginVertical: 20 }} />

            <View style={styles.container}>
              <Button
                onPress={handleDeleteExperience}
                variant="red-outlined"
                icon={({ color }) => (
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color={color}
                  />
                )}
              >
                Delete Experience
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
});
