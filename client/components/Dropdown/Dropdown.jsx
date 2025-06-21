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
  helperText = "",
  isError = false,
  hideHelperTextSpace = false,
  emptyOptionText = "No options available",
  ...props
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const styles = useStyles(theme, isFocus, isError);

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
        flatListProps={{
          ListEmptyComponent: () => (
            <View style={styles.emptyItem}>
              <Text variant="bodyLarge" style={styles.emptyItemText}>
                {emptyOptionText}
              </Text>
            </View>
          ),
        }}
        {...props}
      />

      {!hideHelperTextSpace && (
        <Text
          variant="bodySmall"
          style={[styles.errorText, { opacity: helperText ? 1 : 0 }]}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const useStyles = (theme, isFocus, isError) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
    },
    dropdown: {
      height: 50,
      borderColor: isError
        ? theme.colors.error
        : isFocus
        ? theme.colors.primary
        : theme.colors.outline,
      borderWidth: isFocus || isError ? 2 : 1,
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
      color: isError
        ? theme.colors.error
        : isFocus
        ? theme.colors.primary
        : theme.colors.onSurfaceVariant,
    },
    placeholderStyle: {
      fontSize: 16,
      color: isFocus
        ? theme.colors.textSecondary
        : isError
        ? theme.colors.error
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
    errorText: {
      color: theme.colors.error,
      marginTop: 5,
      letterSpacing: 0.2,
      marginLeft: 12,
    },
    emptyItem: {
      padding: 16,
    },
    emptyItemText: {
      color: theme.colors.textSecondary,
    },
  });
