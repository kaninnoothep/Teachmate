/**
 * Import Modules
 */
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

/**
 * Define interface for page not found
 *
 * @returns JSX Element
 */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text type="title">This screen doesn&apos;t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text type="link">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

/**
 * Specify Styles to use
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
