/**
 * Import Modules
 */
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "../SafeAreaView/SafeAreaView";
import PropTypes from "prop-types";

/**
 * SafeKeyboarScrollView - Safe Keyboard Scroll view
 *
 * @param {*} props
 * @returns JSX Element
 */
export const SafeKeyboardScrollView = ({
  children,
  showsVerticalScrollIndicator = false,
  safeAreaStyle,
  contentContainerStyle,
  style,
  ignoreSafeArea = false,
  edges = ["right", "left", "top", "bottom"],
  ...props
}) => {
  return (
    <SafeAreaView edges={ignoreSafeArea ? [] : edges} style={safeAreaStyle}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          {...{
            ...props,
            style,
            contentContainerStyle,
            showsVerticalScrollIndicator,
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Specify types of props to be received by SafeKeyboardScrollView
SafeKeyboardScrollView.propTypes = {
  children: PropTypes.node,
  showsVerticalScrollIndicator: PropTypes.bool,
  safeAreaStyle: PropTypes.object,
  contentContainerStyle: PropTypes.object,
  style: PropTypes.object,
  ignoreSafeArea: PropTypes.bool,
  edges: PropTypes.arrayOf(PropTypes.oneOf(["right", "left", "top", "bottom"])),
};
