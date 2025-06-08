import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { useEditProfileForm } from "./hooks/useEditProfileForm";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { Button } from "@/components/Button/Button";
import { Text, useTheme } from "react-native-paper";
import { useUser } from "@/context/UserProvider/UserProvider";
import { Pressable, View } from "react-native";
import { TextInput } from "@/components/TextInput/TextInput";
import { Divider } from "@/components/Divider/Divider";
import { useEffect, useState } from "react";
import { useStyles } from "./AccountPage.styles";
import { CountrySelector } from "@/components/CountrySelector/CountrySelector";

export const AccountPage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const { control, handleSubmit, setValue, watch } = useEditProfileForm();

  const watchedCountry = watch("country");

  const [countryCode, setCountryCode] = useState(watchedCountry?.cca2 || "");

  // Initialize country state from form values
  useEffect(() => {
    if (watchedCountry) {
      setCountryCode(watchedCountry.cca2);
    }
  }, [watchedCountry]);

  const onCountrySelect = (selectedCountry) => {
    setCountryCode(selectedCountry.cca2);

    // Update the form with the selected country
    setValue("country", selectedCountry);
  };

  return (
    <SafeKeyboardScrollView ignoreSafeArea>
      <Pressable style={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            Personal Info
          </Text>
          {/* <View style={styles.avatarWrapper}>
            <TouchableOpacity onPress={() => {}} style={styles.avatarContainer}>
              <Avatar.Text
                size={96}
                label={`${user.firstName[0]}${user.lastName[0]}`}
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              />

              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={theme.colors.primary}
                style={styles.iconContainer}
              />
            </TouchableOpacity>
          </View> */}

          <FormTextInput
            name="firstName"
            label="First Name *"
            placeholder="e.g., John"
            fullWidth
            {...{ control }}
          />

          <FormTextInput
            name="lastName"
            label="Last Name *"
            placeholder="e.g., Smith"
            fullWidth
            {...{ control }}
          />

          <TextInput
            name="email"
            label="Email *"
            value={user.email}
            placeholder="email@mail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            fullWidth
            disabled
          />

          <FormTextInput
            name="phone"
            label="Phone"
            placeholder="e.g., 306 123 1234"
            keyboardType="phone-pad"
            fullWidth
            {...{ control }}
          />
        </View>

        {/* Location */}
        <Divider />
        <View style={styles.container}>
          <Text variant="titleLarge" style={{ marginBottom: 14 }}>
            Location
          </Text>

          <CountrySelector
            onSelect={onCountrySelect}
            countryCode={countryCode}
          />

          <FormTextInput
            name="postalCode"
            label="Postal Code"
            placeholder="Enter postal code"
            fullWidth
            style={{ marginTop: 20 }}
            {...{ control }}
          />

          <FormTextInput
            name="city"
            label="City"
            placeholder="e.g., Regina, Saskatchewan"
            fullWidth
            {...{ control }}
          />
        </View>

        {/* About */}
        <Divider />

        <View style={styles.container}>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            About
          </Text>

          <FormTextInput
            name="hourlyRate"
            label="Hourly Rate"
            placeholder="e.g., 25"
            keyboardType="numeric"
            fullWidth
            {...{ control }}
          />

          <FormTextInput
            name="about"
            multiline
            label="Description"
            placeholder="Write some information about yourself..."
            fullWidth
            style={{ minHeight: 100, maxHeight: 300 }}
            {...{ control }}
          />

          <Button onPress={handleSubmit}>Save</Button>
        </View>
      </Pressable>
    </SafeKeyboardScrollView>
  );
};
