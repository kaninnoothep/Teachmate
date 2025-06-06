import { SafeAreaView as ReactSafeAreaView } from "react-native-safe-area-context";
import { styles } from "./SafeAreaView.styles";
import PropTypes from "prop-types";

export const SafeAreaView = ({ children, style, ...rest }) => {
  return (
    <ReactSafeAreaView style={[styles.AndroidSafeArea, style]} {...rest}>
      {children}
    </ReactSafeAreaView>
  );
};

SafeAreaView.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
};
