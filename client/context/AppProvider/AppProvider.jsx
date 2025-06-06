import { KeyboardDismiss } from "@/components/KeyboardDismiss/KeyboardDismiss";
import { ThemeProvider } from "../ThemeProvider/ThemeProvider";
import { ToastProvider } from "../ToastProvider/ToastProvider";

export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <KeyboardDismiss>
        <ToastProvider>{children}</ToastProvider>
      </KeyboardDismiss>
    </ThemeProvider>
  );
};
