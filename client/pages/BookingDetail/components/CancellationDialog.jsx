import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";
import { BlurView } from "expo-blur";
import { Keyboard, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCancelBookingMutation } from "@/services/api/bookings/useCancelBookingMutation";
import { useRejectBookingMutation } from "@/services/api/bookings/useRejectBookingMutation";

export const CancellationDialog = ({
  visible,
  setVisible,
  isCancelDialog = true,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const { bookingId } = useLocalSearchParams();

  const blurComponentIOS = (
    <BlurView intensity={100} style={StyleSheet.absoluteFill} />
  );

  const cancelLabel = isCancelDialog ? "cancel" : "reject";

  // Hook to cancel booking
  const { mutateAsync: cancelBooking } = useCancelBookingMutation({
    onSuccess: (response) => {
      handleSuccess(response);
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Hook to reject booking
  const { mutateAsync: rejectBooking } = useRejectBookingMutation({
    onSuccess: (response) => {
      handleSuccess(response);
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  const handleSuccess = (response) => {
    Toast.show({ type: "success", text1: response.message });
    setReason("");
    setVisible(false);
    router.back();
  };

  const handleSubmit = async () => {
    if (isCancelDialog) {
      // Cancel Booking
      await cancelBooking({ bookingId, cancelNote: reason });
    } else {
      // Reject Booking
      await rejectBooking({ bookingId, rejectNote: reason });
    }
  };

  // Handle search input changes
  const handleChangeText = useCallback(
    (value) => {
      setReason(value);
    },
    [setReason]
  );

  return (
    <Dialog.Container
      visible={visible}
      onBackdropPress={() => Keyboard.dismiss()}
      verticalButtons
      contentStyle={styles.container}
      blurComponentIOS={blurComponentIOS}
    >
      <Dialog.Title>
        Are you sure you want to {cancelLabel} this booking?
      </Dialog.Title>

      <Dialog.Description style={styles.description}>
        Leave a message why you want to {cancelLabel}.
      </Dialog.Description>

      <Dialog.Input
        value={reason}
        onChangeText={handleChangeText}
        placeholder="Write your reason..."
        multiline
        wrapperStyle={styles.input}
        style={styles.input}
      />

      <Dialog.Button
        label={`Yes, ${cancelLabel} booking`}
        color={theme.colors.iosError}
        onPress={handleSubmit}
      />
      <Dialog.Button
        label="Later"
        onPress={() => {
          setVisible(false);
          setReason("");
        }}
      />
    </Dialog.Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 310,
  },
  description: {
    marginTop: 16,
  },
  input: {
    minHeight: 100,
    maxHeight: 300,
    paddingBottom: 4,
  },
});
