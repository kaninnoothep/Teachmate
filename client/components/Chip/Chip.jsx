import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const Chip = ({
  textVariant = "titleSmall",
  value,
  icon,
  containerStyle,
  textStyle,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={[styles.container, containerStyle]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={theme.colors.primary}
        />
      )}
      <Text variant={textVariant} style={[styles.text, textStyle]}>
        {value}
      </Text>
    </View>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      alignSelf: "baseline",
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.onSurfacePrimary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 50,
    },
    text: {
      color: theme.colors.primary,
    },
  });
