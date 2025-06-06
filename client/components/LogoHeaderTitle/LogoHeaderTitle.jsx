import { Image } from "react-native";

export const LogoHeaderTitle = () => {
  return (
    <Image
      source={require("@/assets/images/logo-white.png")}
      style={{ width: 124, height: 40, resizeMode: "contain" }}
    />
  );
};
