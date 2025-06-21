import { Button } from "@/components/Button/Button";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSessionForm } from "./hooks/useSessionForm";
import { Divider } from "@/components/Divider/Divider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@/context/UserProvider/UserProvider";
import Toast from "react-native-toast-message";
import { useDeleteSessionMutation } from "@/services/api/sessions/useDeleteSessionMutation";

export const SessionDetailPage = () => {
  const { sessionId } = useLocalSearchParams();
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { control, handleSubmit } = useSessionForm();

  const { mutateAsync: deleteSession } = useDeleteSessionMutation({
    onSuccess: (response) => {
      let newSessions = user.sessions?.filter(
        (item) => item._id !== response.data._id
      );
      handleSetUser({
        data: { ...user, sessions: newSessions },
      });
      Toast.show({ type: "success", text1: response.message });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  const isAdd = useMemo(() => !sessionId, [sessionId]);

  const pageTitle = () => (isAdd ? "Create a Session" : "Update Session");

  const handleDelete = () => {
    Alert.alert("Are you sure you want to delete this session?", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteSession(sessionId),
        style: "destructive",
      },
    ]);
  };

  return (
    <ScrollView style={{ paddingBottom: 40 }}>
      <Pressable>
        <View style={styles.container}>
          <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
            {pageTitle()}
          </Text>

          <FormTextInput
            name="subject"
            label="Subject *"
            placeholder="e.g., Calculus II, Introductory Statistics"
            fullWidth
            {...{ control }}
          />

          <FormTextInput
            name="description"
            multiline
            label="Description *"
            placeholder="e.g., Write explanation of topics to teach"
            fullWidth
            style={{ minHeight: 100, maxHeight: 300 }}
            {...{ control }}
          />

          <FormTextInput
            name="estimatedDuration"
            label="Estimated Duration (hours) *"
            placeholder="e.g., 4"
            keyboardType="numeric"
            fullWidth
            {...{ control }}
          />

          <Button onPress={handleSubmit}>{pageTitle()}</Button>
        </View>
        {!isAdd && (
          <>
            <Divider style={{ marginVertical: 20 }} />

            <View style={styles.container}>
              <Button
                onPress={handleDelete}
                variant="red-outlined"
                icon={({ color }) => (
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color={color}
                  />
                )}
              >
                Delete Session
              </Button>
            </View>
          </>
        )}
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
