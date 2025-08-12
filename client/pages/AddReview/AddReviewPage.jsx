/**
 * Import Modules
 */
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { InfoBox } from "@/components/InfoBox/InfoBox";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { useAddReviewForm } from "./hooks/useAddReviewForm";
import { Button } from "@/components/Button/Button";
import { FormStarRating } from "@/components/Form/FormStarRating/FormStarRating";

/**
 * AddReviewPage - Page for writing and submitting a review for a user (tutor or student).
 *
 * @returns JSX Element
 */
export const AddReviewPage = () => {
  const theme = useTheme();
  const styles = useStyles();
  const { reviewing } = useLocalSearchParams();
  const [reviewingState] = useState(JSON.parse(reviewing));
  const [loadImageError, setLoadImageError] = useState(false);

  // Hook to handle form state and validation
  const { control, handleSubmit } = useAddReviewForm(reviewingState._id);

  return (
    <SafeKeyboardScrollView ignoreSafeArea>
      <Pressable style={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Reviewing */}
          <InfoBox label="Reviewing" disabledContentPadding>
            <View style={styles.userRow}>
              {reviewingState?.image && !loadImageError ? (
                <Avatar.Image
                  size={40}
                  source={{ uri: reviewingState.image }}
                  onError={() => setLoadImageError(true)}
                />
              ) : (
                <Avatar.Text
                  size={40}
                  label={`${reviewingState.firstName[0]}${reviewingState.lastName[0]}`}
                  style={{ backgroundColor: theme.colors.primary }}
                />
              )}
              <Text variant="titleMedium" style={styles.userName}>
                {reviewingState.firstName} {reviewingState.lastName}
              </Text>
            </View>
          </InfoBox>

          {/* Rating input */}
          <FormStarRating
            name="rating"
            label="Overall Rating *"
            starSize={48}
            enableSwiping={false}
            enableHalfStar={false}
            containerStyle={{ marginTop: 12 }}
            {...{ control }}
          />

          {/* Title input */}
          <FormTextInput
            name="title"
            label="Title *"
            placeholder="e.g., Perfect"
            fullWidth
            {...{ control }}
          />

          {/* Review message input */}
          <FormTextInput
            name="reviewMessage"
            multiline
            label="Write a review *"
            placeholder="Write your review..."
            fullWidth
            style={styles.textarea}
            containerStyle={styles.textareaContainer}
            {...{ control }}
          />

          {/* Submit button */}
          <Button onPress={handleSubmit}>Submit Review</Button>
        </View>
      </Pressable>
    </SafeKeyboardScrollView>
  );
};

/**
 * useStyles - Specify styles to use for adding review page
 *
 * @returns StyleSheet object
 */
const useStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 12,
    },
    userRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 16,
    },
    textareaContainer: {
      marginBottom: 8,
    },
    textarea: {
      minHeight: 100,
      maxHeight: 300,
    },
  });
