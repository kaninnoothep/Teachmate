import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import dayjs from "dayjs";

const DateWithDot = ({
  day,
  availabilityMap,
  hideDisabled,
  onlyShowValidDots = false,
}) => {
  const theme = useTheme();
  const { date: rawDate, number, isCurrentMonth, isDisabled, isSelected } = day;
  const date = new Date(rawDate);
  const dateKey = date.toLocaleDateString("sv-SE");

  const timeSlots = availabilityMap[dateKey] || [];

  const availableTimeSlots = timeSlots.filter((slot) => {
    if (slot.isBooked) return false;
    if (onlyShowValidDots) {
      const now = dayjs();
      if (dayjs(date).isSame(now, "day")) {
        const endTime = dayjs(`2000-01-01T${slot.endTime}`);
        const currentTime = dayjs(`2000-01-01T${now.format("HH:mm")}`);
        return endTime.isAfter(currentTime);
      }
    }
    return true;
  });

  const hasValidSlots = availableTimeSlots.length > 0;

  const getDotOpacity = () => {
    if ((onlyShowValidDots && !hasValidSlots) || (hideDisabled && isDisabled))
      return 0;
    if (!onlyShowValidDots && timeSlots.length === 0) return 0;
    if (isDisabled && timeSlots.length > 0) return 0.7;
    return 1;
  };

  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: isSelected
            ? theme.colors.primary
            : !isCurrentMonth || isDisabled
            ? theme.colors.outline
            : theme.colors.text,
          fontWeight: isSelected ? "600" : "400",
        }}
      >
        {number}
      </Text>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 10,
          backgroundColor: isDisabled
            ? theme.colors.outline
            : theme.colors.success,
          marginTop: 2,
          opacity: getDotOpacity(),
        }}
      />
    </View>
  );
};

export const DatePicker = ({
  styles,
  availabilityMap = [],
  hideDisabled = false,
  onlyShowValidDots = false,
  ...props
}) => {
  const theme = useTheme();
  const defaultStyles = useDefaultStyles("light");

  const components = {
    Day: (day) => (
      <DateWithDot
        day={day}
        availabilityMap={availabilityMap}
        hideDisabled={hideDisabled}
        onlyShowValidDots={onlyShowValidDots}
      />
    ),
  };

  return (
    <DateTimePicker
      {...{ ...props }}
      components={components}
      showOutsideDays
      weekdaysFormat="short"
      styles={{
        ...defaultStyles,
        day: { borderRadius: 10 },
        today: {
          backgroundColor: theme.colors.infoBackground,
        },
        today_label: {
          color: theme.colors.text,
        },
        selected: {
          backgroundColor: theme.colors.onSurfacePrimary,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        },
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
