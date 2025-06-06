import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import PropTypes from "prop-types";

export const KeyboardDismiss = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

KeyboardDismiss.propTypes = {
  children: PropTypes.node,
};
