/**
 * Import Modules
 */
import { FormTextInput } from "@/components/Form/FormTextInput/FormTextInput";
import { useEditProfileForm } from "./hooks/useEditProfileForm";
import { SafeKeyboardScrollView } from "@/components/SafeKeyboardScrollView/SafeKeyboardScrollView";
import { Button } from "@/components/Button/Button";
import { Portal, Text, useTheme } from "react-native-paper";
import { useUser } from "@/context/UserProvider/UserProvider";
import { Pressable, View } from "react-native";
import { TextInput } from "@/components/TextInput/TextInput";
import { Divider } from "@/components/Divider/Divider";
import { useRef } from "react";
import { useStyles } from "./AccountPage.styles";
import { CountryPicker } from "@/components/Picker/CountryPicker";
import { StatePicker } from "@/components/Picker/StatePicker";
import { CityPicker } from "@/components/Picker/CityPicker";
import { PickerButton } from "@/components/Picker/PickerButton";

/**
 * AccountPage - Displays the account form page for editing user profile
 *
 * @returns JSX Element rendering the account profile form with location pickers
 */
export const AccountPage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const { control, handleSubmit, setValue, watch } = useEditProfileForm();

  const watchedCountry = watch("country");
  const watchedState = watch("state");
  const watchedCity = watch("city");

  const countryPickerRef = useRef(null);
  const statePickerRef = useRef(null);
  const cityPickerRef = useRef(null);

  const getCountryLabel = () => {
    if (watchedCountry?.emoji && watchedCountry?.name) {
      return `${watchedCountry?.emoji || ""} ${watchedCountry?.name}`;
    }
    return "";
  };

  return (
    <>
      <SafeKeyboardScrollView ignoreSafeArea>
        <Pressable style={{ paddingBottom: 40 }}>
          <View style={styles.container}>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              Personal Info
            </Text>

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

            <PickerButton
              label="Country"
              value={getCountryLabel()}
              onPress={() => countryPickerRef.current?.open()}
            />

            {/* Only show state picker if country is selected and has states */}
            {watchedCountry && watchedCountry?.hasStates && (
              <PickerButton
                label="State / Province"
                value={watchedState?.name}
                onPress={() => statePickerRef.current?.open()}
              />
            )}

            {/* Only show city picker if state is selected and has cities */}
            {watchedCountry && watchedState && watchedState?.hasCities && (
              <PickerButton
                label="City"
                value={watchedCity?.name}
                onPress={() => cityPickerRef.current?.open()}
              />
            )}

            <FormTextInput
              name="postalCode"
              label="Postal Code"
              placeholder="Enter postal code"
              fullWidth
              autoCapitalize="characters"
              style={{ marginTop: 4, marginBottom: 16 }}
              {...{ control }}
            />
          </View>

          {/* About */}
          <Divider />

          <View style={styles.container}>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              About
            </Text>

            {user.role === "tutor" && (
              <FormTextInput
                name="hourlyRate"
                label="Hourly Rate"
                placeholder="e.g., 25"
                keyboardType="numeric"
                fullWidth
                {...{ control }}
              />
            )}

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
      <Portal>
        <CountryPicker
          ref={countryPickerRef}
          onSelect={(val) => {
            setValue("country", val);

            if (watchedCountry?.id !== val.id) {
              setValue("state", null);
              setValue("city", null);
            }
          }}
          selectedId={watchedCountry?.id}
        />

        <StatePicker
          ref={statePickerRef}
          onSelect={(val) => {
            setValue("state", val);

            if (watchedState?.id !== val.id) {
              setValue("city", null);
            }
          }}
          selectedId={watchedState?.id}
          countryId={watchedCountry?.id}
        />

        <CityPicker
          ref={cityPickerRef}
          onSelect={(val) => setValue("city", val)}
          selectedId={watchedCity?.id}
          countryId={watchedCountry?.id}
          stateId={watchedState?.id}
        />
      </Portal>
    </>
  );
};
