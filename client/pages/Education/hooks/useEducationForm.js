import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddEducationMutation } from "@/services/api/education/useAddEducationMutation";
import { sortByEndDate } from "@/utils/sortByEndDate";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

const validationSchema = object({
  school: string().required("School is required"),
  degree: string(),
  fieldOfStudy: string(),
}).test(
  "date-validation",
  "End date cannot be before start date",
  function (values) {
    const { startDate, endDate } = values;

    // If either date is missing, skip validation
    if (
      !startDate ||
      !endDate ||
      !startDate.year ||
      !startDate.month ||
      !endDate.year ||
      !endDate.month
    ) {
      return true;
    }

    // Convert to comparable format (YYYY-MM)
    const startDateComparable = `${startDate.year}-${startDate.month.padStart(
      2,
      "0"
    )}`;
    const endDateComparable = `${endDate.year}-${endDate.month.padStart(
      2,
      "0"
    )}`;

    if (endDateComparable < startDateComparable) {
      return this.createError({
        path: "endDate",
        message: "End date cannot be before start date",
      });
    }

    return true;
  }
);

// Helper function to convert dateData to ISO date string
const formatDate = (dateData) => {
  if (!dateData || !dateData.year || !dateData.month) return null;

  // Create date string in format YYYY-MM-DD (assuming first day of month)
  const year = dateData.year;
  const month = dateData.month.padStart(2, "0");
  return `${year}-${month}-01`;
};

export const useEducationForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { educationId } = useLocalSearchParams();

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
  const { mutateAsync: addEducation } = useAddEducationMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      let newEducation = [...user.education, response.data];

      handleSetUser({
        data: { ...user, education: sortByEndDate(newEducation) },
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Update education mutation
  //   const { mutateAsync: updateEducation } = useUpdateEducationMutation({
  //     onSuccess: (response) => {
  //       Toast.show({ type: "success", text1: response.message });
  //       router.back();
  //     },
  //     onError: (error) => {
  //       Toast.show({ type: "error", text1: error.message });
  //     },
  //   });

  const onSubmit = async (data) => {
    // Transform the form data to match API expectations
    const payload = {
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };

    console.log("education payload", payload);

    if (educationId) {
      // update the education
      // await updateEducation({ id: educationId, ...payload });
    } else {
      // add the education
      await addEducation(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
