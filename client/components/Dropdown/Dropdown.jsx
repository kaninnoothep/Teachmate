import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown as RNDropdown } from "react-native-element-dropdown";
import { Text, useTheme } from "react-native-paper";

export const Dropdown = ({
  label = "Select",
  placeholder = "",
  data,
  search = false,
  onSelect = () => {},
  ...props
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const styles = useStyles(theme, isFocus);

  const renderLabel = () => {
    if (value || isFocus) {
      return <Text style={styles.label}>{label}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <RNDropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        searchPlaceholderTextColor={theme.colors.textSecondary}
        containerStyle={{
          borderRadius: 8,
          shadowRadius: 10,
          shadowOpacity: 0.06,
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.outline,
          overflow: "scroll",
        }}
        iconStyle={styles.iconStyle}
        data={data}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? label : placeholder}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          onSelect(item);
        }}
        renderRightIcon={() => (
          <MaterialCommunityIcons
            name="unfold-more-horizontal"
            size={24}
            color={theme.colors.textSecondary}
          />
        )}
        {...props}
      />
    </View>
  );
};

const useStyles = (theme, isFocus) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    dropdown: {
      height: 50,
      borderColor: isFocus ? theme.colors.primary : theme.colors.outline,
      borderWidth: isFocus ? 2 : 1,
      borderRadius: 10,
      paddingHorizontal: 15,
    },
    label: {
      position: "absolute",
      backgroundColor: theme.colors.background,
      left: 9,
      top: -7,
      zIndex: 999,
      paddingHorizontal: 6,
      fontSize: 12,
      color: isFocus ? theme.colors.primary : theme.colors.onSurfaceVariant,
    },
    placeholderStyle: {
      fontSize: 16,
      color: isFocus
        ? theme.colors.textSecondary
        : theme.colors.onSurfaceVariant,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 24,
      height: 24,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color: theme.colors.text,
      borderRadius: 6,
    },
  });
