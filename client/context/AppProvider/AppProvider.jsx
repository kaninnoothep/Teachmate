/**
 * Import Modules
 */
import { KeyboardDismiss } from "@/components/KeyboardDismiss/KeyboardDismiss";
import { ThemeProvider } from "../ThemeProvider/ThemeProvider";
import { ToastProvider } from "../ToastProvider/ToastProvider";
import { UserProvider } from "../UserProvider/UserProvider";
import { QueryClientProvider } from "../QueryClientProvider/QueryClientProvider";

/**
 * AppProvider
 *
 * @param {*} props
 * @returns JSX Element
 */
export const AppProvider = ({ children }) => {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <UserProvider>
          <KeyboardDismiss>
            <ToastProvider>{children}</ToastProvider>
          </KeyboardDismiss>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
