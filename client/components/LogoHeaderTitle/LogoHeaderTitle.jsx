/**
 * Import Modules
 */
import { Image } from "react-native";

/**
 * LogoHeaderTitle - Specify LogoHeaderTitle
 *
 * @returns JSX Element
 */
export const LogoHeaderTitle = () => {
  return (
    <Image
      source={require("@/assets/images/logo-white.png")}
      style={{ width: 124, height: 40, resizeMode: "contain" }}
    />
  );
};
