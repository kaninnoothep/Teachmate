import { useUser } from "@/context/UserProvider/UserProvider";
import Feather from "@expo/vector-icons/Feather";
import { Alert, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

export const LogoutButton = () => {
  const { logout } = useUser();
  const theme = useTheme();

  const handleLogout = () => {
    Alert.alert("Confirm log out?", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", onPress: logout, style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        marginRight: -16,
        width: 48,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Feather
        name="log-out"
        size={24}
        color={theme.colors.inverseText}
      />
    </TouchableOpacity>
  );
};
