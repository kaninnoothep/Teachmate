/**
 * Import Modules
 */
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useStyles as useLoginStyles } from "../Login/LoginPage.styles";
import { Button } from "@/components/Button/Button";
import { Link } from "expo-router";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { ROLES } from "@/constants/role";
import { useMemo } from "react";

/**
 * SignUpPage - Displays the sign up form page for creating a student or tutor account
 *
 * @returns JSX Element
 */
export const SignUpPage = () => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const loginStyles = useLoginStyles(theme);

  const { control, handleSubmit, watch, setValue } = useSignUpForm(); // Initialize form control and helpers from custom hook

  // Watch the selected role from form state
  const role = watch("role");

  // Check for whether the selected role is "Tutor"
  const isTutor = useMemo(() => role === ROLES.tutor, [role]);

  // Handle role change (Student/Tutor)
  const handleRole = (role) => {
    setValue("role", role);
  };

  return (
    <SafeKeyboardScrollView ignoreSafeArea>
      <View style={loginStyles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Create an account for
        </Text>

        {/* Role selection buttons */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            onPress={() => handleRole(ROLES.student)}
            style={[
              styles.roleOptionBase,
              isTutor ? styles.roleOption : styles.roleOptionActive,
            ]}
          >
            <Text
              variant="titleMedium"
              style={[
                styles.roleText,
                {
                  color: isTutor
                    ? theme.colors.primary
                    : theme.colors.inverseText,
                },
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRole(ROLES.tutor)}
            style={[
              styles.roleOptionBase,
              !isTutor ? styles.roleOption : styles.roleOptionActive,
            ]}
          >
            <Text
              variant="titleMedium"
              style={[
                styles.roleText,
                {
                  color: !isTutor
                    ? theme.colors.primary
                    : theme.colors.inverseText,
                },
              ]}
            >
              Tutor
            </Text>
          </TouchableOpacity>
        </View>

        {/* First name input */}
        <FormTextInput
          name="firstName"
          label="First Name *"
          placeholder="e.g., John"
          fullWidth
          {...{ control }}
        />

        {/* Last name input */}
        <FormTextInput
          name="lastName"
          label="Last Name *"
          placeholder="e.g., Smith"
          fullWidth
          {...{ control }}
        />

        {/* Email input */}
        <FormTextInput
          name="email"
          label="Email *"
          placeholder="example@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          fullWidth
          {...{ control }}
        />

        {/* Password input */}
        <FormTextInput
          name="password"
          label="Password *"
          placeholder="At least 8 characters"
          secureTextEntry
          fullWidth
          {...{ control }}
        />

        {/* Confirm password input */}
        <FormTextInput
          name="confirmPassword"
          label="Confirm Password *"
          placeholder="Re-enter your password"
          secureTextEntry
          fullWidth
          {...{ control }}
        />

        {/* Submit and navigation buttons */}
        <View style={loginStyles.buttonWrapper}>
          <Button onPress={handleSubmit} style={loginStyles.button}>
            Sign Up
          </Button>

          <View style={loginStyles.signUpWrapper}>
            <Text variant="bodyMedium">Already have an account?</Text>
            <Button variant="link" labelStyle={loginStyles.signUpLink}>
              <Link dismissTo href="/login">
                Login
              </Link>
            </Button>
          </View>
        </View>
      </View>
    </SafeKeyboardScrollView>
  );
};

/**
 * useStyles - Specify styles to use for sign up page
 *
 * @param {*} theme
 * @returns StyleSheet object
 */
const useStyles = (theme) =>
  StyleSheet.create({
    title: {
      alignSelf: "flex-start",
      marginTop: 20,
    },
    roleContainer: {
      flex: 2,
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
      marginBottom: 20,
    },
    roleOptionBase: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 10,
    },
    roleOptionActive: {
      backgroundColor: theme.colors.primary,
    },
    roleOption: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    roleText: {
      textAlign: "center",
    },
  });
