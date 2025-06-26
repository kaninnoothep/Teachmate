/**
 * Import Modules
 */
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { useUserQuery } from "@/services/api/user/useUserQuery";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useBookTutorForm } from "./hooks/useBookTutorForm";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { Button } from "@/components/Button/Button";
import { Dropdown } from "@/components/Dropdown/Dropdown";
import { useMemo, useRef, useState } from "react";
import { LOCATION_OPTIONS } from "../PreferredLocation/PreferredLocationPage";
import { PickerButton } from "@/components/Picker/PickerButton";
import { DateTimePicker } from "./components/DateTimePicker";
import dayjs from "dayjs";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";

/**
 * BookTutorPage - Displays the book tutor form page
 *
 * @returns JSX Element rendering the book tutor page
 */
export const BookTutorPage = () => {
  const theme = useTheme();
  const { tutorId } = useLocalSearchParams();
  const [loadImageError, setLoadImageError] = useState(false);
  const { user, isFetching } = useUserQuery(tutorId); // Fetch tutor's user data based on tutorId
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useBookTutorForm();
  const dateTimePickerRef = useRef(null); // Date/time picker ref

  // Watch selected date and times
  const watchedDate = watch("date");
  const watchedTimeSlots = watch("timeSlots");

  // Create dropdown options from tutor's offered sessions
  const sessions = useMemo(() =>
    user?.sessions.map(
      ({ _id, subject }) => ({ label: subject, value: _id }),
      [user]
    )
  );

  // Filter tutor's preferred locations from predefined options
  const locations = useMemo(() => {
    if (!user?.preferredLocations) return [];

    return LOCATION_OPTIONS.filter(
      (option) => user.preferredLocations[option.value]
    );
  }, [user]);

  // Show loading indicator while fetching tutor data
  if (isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Format label for selected date/time
  const getDateTimeLabel = () => {
    if (watchedDate && watchedTimeSlots.length > 0) {
      let startTime = watchedTimeSlots[0].startTime;
      let endTime = watchedTimeSlots[watchedTimeSlots.length - 1].endTime;

      return `${dayjs(watchedDate).format("MMM D, YYYY")} at ${dayjs(
        `2000-01-01T${startTime}`
      ).format("H:mm")} - ${dayjs(`2000-01-01T${endTime}`).format("H:mm")}`;
    }
    return "";
  };

  // Callback when user selects date & time from the picker
  const handleSelectDateTime = ({ selectedDate, selectedTimeSlots }) => {
    setValue("date", selectedDate);
    setValue("timeSlots", selectedTimeSlots);
  };

  return (
    <>
      <SafeKeyboardScrollView ignoreSafeArea>
        <Pressable style={styles.container}>
          {/* Tutor Info */}
          <InfoBox label="Tutor" containerStyle={{ marginBottom: 22 }}>
            <View style={styles.userRow}>
              {user?.image && !loadImageError ? (
                <Avatar.Image
                  size={40}
                  source={{ uri: user.image }}
                  onError={() => setLoadImageError(true)}
                />
              ) : (
                <Avatar.Text
                  size={40}
                  label={`${user.firstName[0]}${user.lastName[0]}`}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              <Text variant="titleMedium" style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
            </View>
          </InfoBox>

          {/* Session Dropdown */}
          <Dropdown
            label="Session *"
            placeholder="Select an offered session"
            data={sessions}
            search
            onSelect={({ value }) => setValue("sessionId", value)}
            helperText={errors.sessionId?.message}
            isError={errors.sessionId?.message}
          />

          {/* Date & Time Picker Trigger */}
          <PickerButton
            label="Date & Time *"
            value={getDateTimeLabel()}
            iconName="calendar"
            iconSize={20}
            iconColor={theme.colors.primary}
            onPress={() => dateTimePickerRef.current?.open()}
            helperText={errors.date?.message || errors.timeSlots?.message}
            isError={errors.date || errors.timeSlots}
          />

          {/* Location Dropdown */}
          <Dropdown
            label="Location"
            placeholder="Select location"
            data={locations}
            onSelect={({ value }) => setValue("preferredLocation", value)}
          />

          {/* Booking Note */}
          <FormTextInput
            name="note"
            multiline
            label="Note"
            placeholder="Describe your booking..."
            fullWidth
            style={{ minHeight: 100, maxHeight: 300 }}
            {...{ control }}
          />

          {/* Submit Button */}
          <Button onPress={handleSubmit}>Book Tutor</Button>
        </Pressable>
      </SafeKeyboardScrollView>

      {/* Date & Time Picker Modal */}
      <Portal>
        <DateTimePicker
          ref={dateTimePickerRef}
          availability={user.availability}
          onPressSelect={handleSelectDateTime}
          initialDate={watchedDate}
          initialTimeSlots={watchedTimeSlots}
        />
      </Portal>
    </>
  );
};

/**
 * Specify Styles to use for book tutor page
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userName: {
    fontSize: 18,
    flex: 1,
  },
});
