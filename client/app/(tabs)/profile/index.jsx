import { useUser } from "@/context/UserProvider/UserProvider";
import { ProfilePage } from "@/pages/Profile/ProfilePage";

export default function ProfileScreen() {
  const { user } = useUser();

  return <ProfilePage user={user} />;
}
