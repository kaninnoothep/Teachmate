import { useUser } from "@/context/UserProvider/UserProvider";
import { useForm } from "@/hooks/useForm";
import { useAddEducationMutation } from "@/services/api/education/useAddEducationMutation";
import { useUpdateEducationMutation } from "@/services/api/education/useUpdateEducationMutation";
import { sortByEndDate } from "@/utils/sortByEndDate";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { object, string } from "yup";

dayjs.extend(utc);

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
  if (!dateData?.year || !dateData?.month) return null;

  return dayjs.utc(`${dateData.year}-${dateData.month}-01`).toISOString();
};

const parseDateToPickerFormat = (isoDateString) => {
  if (!isoDateString) return null;

  const date = dayjs.utc(isoDateString);
  const year = date.format("YYYY");
  const month = date.format("MM");

  return {
    year,
    month,
    displayText: `${date.format("MMMM")} ${year}`,
  };
};

export const useEducationForm = () => {
  const { user, handleSetUser } = useUser();
  const router = useRouter();
  const { educationId, education } = useLocalSearchParams();

  let defaultValues = {
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: null,
    endDate: null,
  };

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
    } catch (err) {
      console.warn("Failed to parse education:", err);
    }
  }

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

  const onSubmit = async (data) => {
    // Transform the form data to match API expectations
    const payload = {
      school: data.school,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: formatDate(data.startDate),
      endDate: formatDate(data.endDate),
    };

    if (educationId) {
      // update the education
      await updateEducation({ educationId, ...payload });
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
