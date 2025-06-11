import { Button } from "@/components/Button/Button";
import { Divider } from "@/components/Divider/Divider";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useEducationForm } from "./hooks/useEducationForm";
import { MonthYearPicker } from "@/components/MonthYearPicker/MonthYearPicker";
import { DatePickerButton } from "@/components/MonthYearPicker/DatePickerButton";
import { useDeleteEducationMutation } from "@/services/api/education/useDeleteEducationMutation";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserProvider/UserProvider";
import { sortByEndDate } from "@/utils/sortByEndDate";

export const EducationPage = () => {
  const { educationId } = useLocalSearchParams();
  const { user, handleSetUser } = useUser();
  const theme = useTheme();
  const router = useRouter();

  const { mutateAsync: deleteEducation } = useDeleteEducationMutation({
    onSuccess: (response) => {
      let newEducation = user.education?.filter(
        (item) => item._id !== response.data._id
      );
      handleSetUser({
        data: { ...user, education: sortByEndDate(newEducation) },
      });
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useEducationForm();

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Watch the form values for dates
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const isAdd = useMemo(() => !educationId, [educationId]);

  const pageTitle = () => (isAdd ? "Add Education" : "Update Education");

  const handleDeleteEducation = () => {
    Alert.alert("Are you sure you want to delete this education?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteEducation(educationId),
        style: "destructive",
      },
    ]);
  };

  const handleStartDateSelect = (dateData) => {
    // Set the form value with the dateData object
    setValue("startDate", dateData);
  };

  const handleEndDateSelect = (dateData) => {
    // Set the form value with the dateData object
    setValue("endDate", dateData);
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
            placeholder="e.g., Master of Science"
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
            helperText={errors.endDate?.message}
            isError={errors.endDate?.message}
          />

          <Button onPress={handleSubmit}>{pageTitle()}</Button>
        </View>

        {!isAdd && (
          <>
            <Divider style={{ marginVertical: 20 }} />

            <View style={styles.container}>
              <Button
                onPress={handleDeleteEducation}
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
});
