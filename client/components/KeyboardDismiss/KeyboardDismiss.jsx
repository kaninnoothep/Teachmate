/**
 * Import Modules
 */
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import PropTypes from "prop-types";

/**
 * KeyboardDismiss
 *
 * @param {*} children
 * @returns JSX Element
 */
export const KeyboardDismiss = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

// Specify types of props to be received by KeyboardDismiss
KeyboardDismiss.propTypes = {
  children: PropTypes.node,
};
