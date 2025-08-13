/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddExperienceMutation } from "@/services/api/experience/useAddExperienceMutation";
import { useUpdateExperienceMutation } from "@/services/api/experience/useUpdateExperienceMutation";
import { formatDate } from "@/utils/formatDate";
import { parseDateToPickerFormat } from "@/utils/parseDateToPickerFormat";
import { sortByEndDate } from "@/utils/sortByEndDate";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

// Validation for experience form
const validationSchema = object({
  title: string().required("Title is required"),
  company: string(),
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
 * useExperienceForm - Custom hook to manage add/update experience form
 *
 * @returns Form methods and submit handler
 */
export const useExperienceForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { experienceId, experience } = useLocalSearchParams();

  // Set default values for the form
  let defaultValues = {
    title: "",
    company: "",
    startDate: null,
    endDate: null,
  };

  // If editing, prefill the form with existing data
  if (experience) {
    try {
      const parsedExperience = JSON.parse(experience);
      defaultValues = {
        title: parsedExperience?.title || "",
        company: parsedExperience?.company || "",
        startDate: parseDateToPickerFormat(parsedExperience?.startDate),
        endDate: parseDateToPickerFormat(parsedExperience?.endDate),
      };
    } catch {
      // Failed to parse experience
    }
  }

  // Initialize the form
  const form = useForm({
    validationSchema,
    defaultValues,
  });

  // Add experience mutation
  const { mutateAsync: addExperience } = useAddExperienceMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });
      let newExperience = [...user.experience, response.data];

      handleSetUser({
        data: { ...user, experience: sortByEndDate(newExperience) },
      });
      router.back();
    },
    onError: (error) => {
      Toast.show({ type: "error", text1: error.message });
    },
  });

  // Update experience mutation
  const { mutateAsync: updateExperience } = useUpdateExperienceMutation({
    onSuccess: (response) => {
      Toast.show({ type: "success", text1: response.message });

      // Replace the updated experience entry in user.experience
      const updatedExperienceList = user.experience.map((item) =>
        item._id === response.data._id ? response.data : item
      );

      handleSetUser({
        data: { ...user, experience: sortByEndDate(updatedExperienceList) },
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
      title: data.title,
      company: data.company,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };
    if (experienceId) {
      // Update the experience
      await updateExperience({ experienceId, ...payload });
    } else {
      // Add the experience
      await addExperience(payload);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
