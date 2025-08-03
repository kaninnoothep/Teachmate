/**
 * Import Modules
 */
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

/**
 * Specify back button
 *
 * @param {*} onPress
 * @returns JSX Element
 */
export const BackButton = ({ isCloseButton = false, onPress }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress ? onPress : () => router.back()}>
      <MaterialCommunityIcons
        name={!isCloseButton ? "chevron-left" : "close"}
        size={!isCloseButton ? 40 : 24}
        color={theme.colors.inverseText}
        style={!isCloseButton && { marginLeft: -14 }}
      />
    </TouchableOpacity>
  );
};

// Specify proptypes to be received by BackButton
BackButton.propTypes = {
  onPress: PropTypes.func,
};
