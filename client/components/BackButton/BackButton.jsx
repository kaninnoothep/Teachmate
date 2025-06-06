import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

export const BackButton = ({ onPress }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress ? onPress : () => router.back()}>
      <MaterialCommunityIcons
        name="chevron-left"
        size={40}
        color={theme.colors.text}
        style={{ marginLeft: -14 }}
      />
    </TouchableOpacity>
  );
};

BackButton.propTypes = {
  onPress: PropTypes.func,
};
