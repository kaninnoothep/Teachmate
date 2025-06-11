import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
// Helper function to convert dateData to ISO date string
export const formatDate = (dateData) => {
  if (!dateData?.year || !dateData?.month) return null;

  return dayjs.utc(`${dateData.year}-${dateData.month}-01`).toISOString();
};
