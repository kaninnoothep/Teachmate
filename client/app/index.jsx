/**
 * Import Module
 */
import { Redirect } from "expo-router";

/**
 * Index - Redirects to the default route
 *
 * @returns JSX Element that triggers navigation
 */
export default function Index() {
  // Redirect to the /bookings route
  return <Redirect href="/bookings" />;
}
