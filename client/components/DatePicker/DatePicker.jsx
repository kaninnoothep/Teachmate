import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

const DateWithDot = ({ day, availabilityMap }) => {
  const theme = useTheme();
  const { date, number, isCurrentMonth, isDisabled, isSelected } = day;
  const dateKey = date.toISOString().split("T")[0];
  const hasAvailability = availabilityMap[dateKey]?.length > 0;

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
          backgroundColor: theme.colors.success,
          marginTop: 2,
          opacity: hasAvailability ? 1 : 0,
        }}
      />
    </View>
  );
};

export const DatePicker = ({ styles, availabilityMap, ...props }) => {
  const theme = useTheme();
  const defaultStyles = useDefaultStyles("light");

  const components = {
    Day: (day) => <DateWithDot day={day} availabilityMap={availabilityMap} />,
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
          backgroundColor: theme.colors.surfaceVariant,
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
