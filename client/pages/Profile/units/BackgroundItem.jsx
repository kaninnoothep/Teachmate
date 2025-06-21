import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const BackgroundItem = ({
  title,
  subtitle,
  tertiaryText = "",
  onPressEdit = () => {},
  disabledEdit = false,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <Text variant="titleMedium">{title}</Text>
        {subtitle && <Text variant="bodySmall">{subtitle}</Text>}
        {tertiaryText && (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.textSecondary }}
            numberOfLines={3}
          >
            {tertiaryText}
          </Text>
        )}
      </View>

      {!disabledEdit && (
        <TouchableOpacity onPress={onPressEdit} style={{ padding: 4 }}>
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftWrapper: {
    gap: 6,
  },
});
