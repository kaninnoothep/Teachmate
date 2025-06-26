/**
 * Import Modules
 */
import { Image, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Button } from "@/components/Button/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link } from "expo-router";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { useLoginForm } from "./hooks/useLoginForm";
import { useStyles } from "./LoginPage.styles";

/**
 * LoginPage - Displays the login form page
 *
 * @returns JSX Element
 */
export const LoginPage = () => {
  const { control, handleSubmit } = useLoginForm();
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <SafeKeyboardScrollView ignoreSafeArea>
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/logo-white.png")}
          style={styles.logo}
        />
        <Text variant="labelLarge" style={styles.logoCaptionText}>
          Empower Your Learning Journey
        </Text>
      </View>

      <View style={styles.container}>
        {/* Email input field */}
        <FormTextInput
          name="email"
          label="Email"
          placeholder="example@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          fullWidth
          {...{ control }}
        />

        {/* Password input field */}
        <FormTextInput
          name="password"
          label="Password"
          secureTextEntry
          fullWidth
          onSubmitEditing={handleSubmit}
          {...{ control }}
        />

        {/* Buttons */}
        <View style={styles.buttonWrapper}>
          <Button
            icon={({ color }) => (
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color={color}
              />
            )}
            iconRight
            onPress={handleSubmit}
          >
            Login
          </Button>

          <View style={styles.signUpWrapper}>
            <Text variant="bodyMedium">Doesn&apos;t have an account?</Text>
            <Button variant="link" labelStyle={styles.signUpLink}>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </View>
        </View>
      </View>
    </SafeKeyboardScrollView>
  );
};
