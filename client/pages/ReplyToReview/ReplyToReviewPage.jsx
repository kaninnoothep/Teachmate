import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useReplyToReviewForm } from "./hooks/useReplyToReviewForm";
import { ReviewReplyItem } from "../Reviews/components/ReviewReplyItem";
import { Button } from "@/components/Button/Button";
import { useState } from "react";
import { Text } from "react-native-paper";

export const ReplyToReviewPage = () => {
  const styles = useStyles();
  const { review } = useLocalSearchParams();
  const [reviewState] = useState(JSON.parse(review));
  const { control, handleSubmit } = useReplyToReviewForm(reviewState.reviewId);

  return (
    <SafeKeyboardScrollView ignoreSafeArea>
      <Pressable style={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {/* Reply to */}
          <View style={styles.replyToContainer}>
            <Text variant="titleMedium">Reply to</Text>
            <ReviewReplyItem
              reviewId={reviewState.reviewId}
              author={reviewState.author}
              rating={reviewState.rating}
              title={reviewState.title}
              message={reviewState.message}
              createdAt={reviewState.createdAt}
              readonly
            />
          </View>

          {/* Reply message input */}
          <FormTextInput
            name="replyMessage"
            multiline
            label="Write a reply *"
            placeholder="Write your reply..."
            fullWidth
            style={styles.textarea}
            containerStyle={styles.textareaContainer}
            {...{ control }}
          />

          {/* Submit button */}
          <Button onPress={handleSubmit}>Submit Reply</Button>
        </View>
      </Pressable>
    </SafeKeyboardScrollView>
  );
};

const useStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      gap: 24,
    },
    replyToContainer: {
      gap: 8,
    },
    textareaContainer: {
      marginTop: 8,
    },
    textarea: {
      minHeight: 100,
      maxHeight: 300,
    },
  });
