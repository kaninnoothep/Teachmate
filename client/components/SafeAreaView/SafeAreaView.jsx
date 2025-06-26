/**
 * Import Modules
 */
import { SafeAreaView as ReactSafeAreaView } from "react-native-safe-area-context";
import { styles } from "./SafeAreaView.styles";
import PropTypes from "prop-types";

/**
 * SafeAreaView - Specify SafeAreaView
 *
 * @param {*} props
 * @returns JSX Element
 */
export const SafeAreaView = ({ children, style, ...rest }) => {
  return (
    <ReactSafeAreaView style={[styles.AndroidSafeArea, style]} {...rest}>
      {children}
    </ReactSafeAreaView>
  );
};

// Specify types of props to be received by SafeAreaView
SafeAreaView.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};
