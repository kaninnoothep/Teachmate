import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const LocationOption = ({ option, isSelected, onToggle }) => {
  const theme = useTheme();

  return (
    <Pressable
      style={[
        styles.optionContainer,
        {
          backgroundColor: isSelected
            ? theme.colors.onSurfacePrimary
            : theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
        },
      ]}
      onPress={() => onToggle(option.value)}
    >
      <MaterialCommunityIcons
        name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
        size={24}
        color={theme.colors.primary}
      />
      <Text variant="bodyMedium" style={styles.optionLabel}>
        {option.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionLabel: {
    marginLeft: 12,
  },
});
