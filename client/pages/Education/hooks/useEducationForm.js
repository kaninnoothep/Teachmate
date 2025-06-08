import { useForm } from "@/hooks/useForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

const validationSchema = object({
  school: string().required("School is required"),
  degree: string(),
  fieldOfStudy: string(),
});

export const useEducationForm = () => {
  const router = useRouter();
  const { educationId } = useLocalSearchParams();

  //   let defaultValues = {  };

  //   if (studyAlert) {
  //     try {
  //       const parsedAlert = JSON.parse(studyAlert);
  //       const { day, time } = parsedAlert;
  //       defaultValues = {
  //         day: day || ["Monday"],
  //         time: time ? new Date(time).toISOString() : new Date().toISOString(),
  //       };
  //     } catch (error) {
  //       console.error("Failed to parse studyAlert:", error);
  //     }
  //   }

  const form = useForm({
    validationSchema,
    defaultValues: {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: null,
      endDate: null,
    },
  });

  // Add education mutation
  //   const { mutateAsync: addEducation } = useAddEducationMutation({
  //     onSuccess: (reponse) => {
  //       Toast.show({ type: "success", text1: reponse.message });
  //       router.back();
  //     },
  //     onError: (error) => {
  //       Toast.show({ type: "error", text1: error.message });
  //     },
  //   });

  // Update education mutation
  //   const { mutateAsync: updateStudyAlert } = useUpdateEducationMutation({
  //     onSuccess: (response) => {
  //       Toast.show({ type: "success", text1: response.message });
  //       router.back();
  //     },
  //     onError: (error) => {
  //       Toast.show({ type: "error", text1: error.message });
  //     },
  //   });

  const onSubmit = async (payload) => {
      // let payload = { };
      console.log('education payload', payload)
    if (educationId) {
      // update the education
      //   await updateEducation({ id: educationId, ...payload });
    } else {
      // add the education
      //   await addEducation(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
