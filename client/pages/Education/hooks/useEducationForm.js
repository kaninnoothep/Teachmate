/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddEducationMutation } from "@/services/api/education/useAddEducationMutation";
import { useUpdateEducationMutation } from "@/services/api/education/useUpdateEducationMutation";
import { formatDate } from "@/utils/formatDate";
import { parseDateToPickerFormat } from "@/utils/parseDateToPickerFormat";
import { sortByEndDate } from "@/utils/sortByEndDate";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

// Validation for education form
const validationSchema = object({
  school: string().required("School is required"),
  degree: string(),
  fieldOfStudy: string(),
}).test(
  "date-validation",
  "End date cannot be before start date",
  function (values) {
    const { startDate, endDate } = values;

    // If end date exists but start date is missing
    if (!startDate && endDate)
      return this.createError({
        path: "startDate",
        message: "Start date is required",
      });

    // Skip validation if either date is incomplete
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

    // Ensure end date is not before start date
    if (endDateComparable < startDateComparable) {
      return this.createError({
        path: "endDate",
        message: "End date cannot be before start date",
      });
    }

    return true;
  }
);

/**
 * useEducationForm - Custom hook to manage add/update education form
 *
 * @returns Form methods and submit handler
 */
export const useEducationForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { educationId, education } = useLocalSearchParams();

  // Set default values for the form
  let defaultValues = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: null,
    endDate: null,
  };

  // If editing, prefill the form with existing data
  if (education) {
    try {
      const parsedEducation = JSON.parse(education);
      defaultValues = {
        school: parsedEducation?.school || "",
        degree: parsedEducation?.degree || "",
        fieldOfStudy: parsedEducation?.fieldOfStudy || "",
        startDate: parseDateToPickerFormat(parsedEducation?.startDate),
        endDate: parseDateToPickerFormat(parsedEducation?.endDate),
      };
    } catch {
      // Failed to parse education
    }
  }

  // Initialize the form
  const form = useForm({
    validationSchema,
    defaultValues: defaultValues,
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
  const { mutateAsync: updateEducation } = useUpdateEducationMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });

      // Replace the updated education entry in user.education
      const updatedEducationList = user.education.map((item) =>
        item._id === response.data._id ? response.data : item
      );

      handleSetUser({
        data: { ...user, education: sortByEndDate(updatedEducationList) },
      });

      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Submit handler for both add and update cases
  const onSubmit = async (data) => {
    const payload = {
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };

    if (educationId) {
      // Update the education
      await updateEducation({ educationId, ...payload });
    } else {
      // Add the education
      await addEducation(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
