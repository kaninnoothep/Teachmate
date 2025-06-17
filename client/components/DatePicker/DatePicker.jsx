import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

const DateWithDot = ({ day, availabilityMap, hideBookedDot, hideDisabled }) => {
  const theme = useTheme();
  const { date, number, isCurrentMonth, isDisabled, isSelected } = day;
  const dateKey = date.toISOString().split("T")[0];

  const timeSlots = availabilityMap[dateKey];
  const hasAvailability = timeSlots?.length > 0;

  const availableTimeSlots = timeSlots?.filter(
    (timeSlot) => !timeSlot.isBooked
  );
  const hasAvailibleTimeSlots = availableTimeSlots?.length > 0;

  const getDotOpacity = () => {
    if (
      (!hasAvailibleTimeSlots && hideBookedDot) ||
      (hideDisabled && isDisabled)
    )
      return 0;

    if (isDisabled && hasAvailability) return 0.7;

    if (hasAvailability) return 1;

    return 0;
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
  hideBookedDot = false,
  hideDisabled = false,
  ...props
}) => {
  const theme = useTheme();
  const defaultStyles = useDefaultStyles("light");

  const components = {
    Day: (day) => (
      <DateWithDot
        day={day}
        availabilityMap={availabilityMap}
        hideBookedDot={hideBookedDot}
        hideDisabled={hideDisabled}
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
