import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const parseDateToPickerFormat = (isoDateString) => {
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
