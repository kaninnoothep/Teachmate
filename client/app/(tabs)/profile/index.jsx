/**
 * Import Modules
 */
import { useUser } from "@/context/UserProvider/UserProvider";
import { ProfilePage } from "@/pages/Profile/ProfilePage";

/**
 * ProfileScreen - Displays the profile page with user data
 *
 * @returns JSX Element rendering the user's profile
 */
export default function ProfileScreen() {
  const { user } = useUser();

  return <ProfilePage user={user} />;
}
