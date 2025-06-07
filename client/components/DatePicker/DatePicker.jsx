import { useTheme } from "react-native-paper";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

export const DatePicker = ({ styles, ...props }) => {
  const theme = useTheme();
  const defaultStyles = useDefaultStyles("light");

  return (
    <DateTimePicker
      {...{ ...props }}
      showOutsideDays
      weekdaysFormat="short"
      styles={{
        ...defaultStyles,
        day: { borderRadius: 10 },
        today: {
          backgroundColor: theme.colors.surfaceVariant,
        },
        today_label: {
          color: theme.colors.text,
        },
        selected: { backgroundColor: theme.colors.primary },
        selected_label: { color: theme.colors.white, fontWeight: "600" },
        selected_month: { backgroundColor: theme.colors.primary },
        selected_year: { backgroundColor: theme.colors.primary },
        button_next: { padding: 10 },
        button_next_image: { tintColor: theme.colors.textDarkGrey },
        button_prev: { padding: 10 },
        button_prev_image: { tintColor: theme.colors.textDarkGrey },
        ...styles,
      }}
    />
  );
};
