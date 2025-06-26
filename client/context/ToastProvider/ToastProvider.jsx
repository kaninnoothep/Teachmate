/**
 * Import Modules
 */
import { StatusBar } from "react-native";
import Toast, { ErrorToast, SuccessToast } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./ToastProvider.styles";
import { useTheme } from "react-native-paper";

/**
 * ToastProvider
 *
 * @param {*} props
 * @returns JSX Element
 */
export const ToastProvider = ({ children }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const combinedContentContainerStyle = [
    styles.contentContainer,
    { backgroundColor: theme.colors.toastBackground },
  ];
  const combinedTextStyle = [styles.text, { color: theme.colors.text }];

  // Toast Configurations
  const toastConfig = {
    success: (props) => (
      <SuccessToast
        {...props}
        style={[styles.container, { borderLeftColor: theme.colors.success }]}
        contentContainerStyle={combinedContentContainerStyle}
        text1Style={combinedTextStyle}
        text2Style={combinedTextStyle}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={[styles.container, { borderLeftColor: theme.colors.error }]}
        contentContainerStyle={combinedContentContainerStyle}
        text1Style={combinedTextStyle}
        text2Style={combinedTextStyle}
      />
    ),
  };

  return (
    <>
      {children}
      <Toast
        visibilityTime={3000}
        topOffset={StatusBar.currentHeight || insets.top}
        config={toastConfig}
      />
    </>
  );
};
