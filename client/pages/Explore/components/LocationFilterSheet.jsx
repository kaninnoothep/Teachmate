/**
 * Import Modules
 */
import { Button } from "@/components/Button/Button";
import { CityPicker } from "@/components/Picker/CityPicker";
import { CountryPicker } from "@/components/Picker/CountryPicker";
import { PickerButton } from "@/components/Picker/PickerButton";
import { StatePicker } from "@/components/Picker/StatePicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * LocationFilterSheet - A bottom sheet modal for selecting a location filter.
 *
 * @param {*} props
 * @param {*} ref
 * @returns JSX Element for the filter sheet
 */
export const LocationFilterSheet = forwardRef(
  (
    {
      country,
      setCountry,
      state,
      setState,
      city,
      setCity,
      currentLocationEnabled,
      setCurrentLocationEnabled,
      checkIfLocationEnabled,
      getCurrentLocation,
      isUsingCurrentLocation,
      setIsUsingCurrentLocation,
    },
    ref
  ) => {
    const sheetRef = useRef(null);
    const countryPickerRef = useRef(null);
    const statePickerRef = useRef(null);
    const cityPickerRef = useRef(null);

    const theme = useTheme();
    const styles = useStyles();
    const insets = useSafeAreaInsets();

    // Define snap points for BottomSheet
    const snapPoints = useMemo(() => ["60%"], []);

    // Expose methods to open and close the BottomSheet
    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    // Format the country label with emoji and name
    const getCountryLabel = () => {
      if (country?.emoji && country?.name) {
        return `${country?.emoji || ""} ${country?.name}`;
      }
      return "";
    };

    // Render backdrop behind BottomSheet
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <>
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          enableDynamicSizing={false}
          backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.outlineVariant,
          }}
          containerStyle={{ marginTop: insets.top }}
          onAnimate={() => Keyboard.dismiss()}
          onClose={() =>
            isUsingCurrentLocation && setCurrentLocationEnabled(true)
          }
        >
          <View style={styles.container}>
            <Text style={styles.title}>Filters</Text>

            <BottomSheetScrollView
              contentContainerStyle={styles.contentContainer}
            >
              {currentLocationEnabled && city && state && country ? (
                <>
                  {/* Show current location */}
                  <PickerButton
                    label="Current Location"
                    value={`${city?.name}, ${state?.name}, ${country?.name}`}
                    hideIcon
                  />

                  {/* Select location button */}
                  <Button
                    onPress={() => setCurrentLocationEnabled(false)}
                    variant="text"
                    icon={({ color }) => (
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={24}
                        color={color}
                      />
                    )}
                  >
                    Select location
                  </Button>
                </>
              ) : (
                <>
                  {/* Country Picker */}
                  <PickerButton
                    label="Country"
                    value={getCountryLabel()}
                    onPress={() => countryPickerRef.current?.open()}
                  />
                  {/* State Picker (if country has states) */}
                  {country && country?.hasStates && (
                    <PickerButton
                      label="State"
                      value={state?.name}
                      onPress={() => statePickerRef.current?.open()}
                    />
                  )}
                  {/* City Picker (if state has cities) */}
                  {country && state && state?.hasCities && (
                    <PickerButton
                      label="City"
                      value={city?.name}
                      onPress={() => cityPickerRef.current?.open()}
                    />
                  )}

                  {/* Use current location button */}
                  <Button
                    onPress={() => {
                      checkIfLocationEnabled();
                      getCurrentLocation();
                    }}
                    variant="text"
                    icon={({ color }) => (
                      <FontAwesome5
                        name="location-arrow"
                        size={16}
                        color={color}
                      />
                    )}
                  >
                    Use current location
                  </Button>
                </>
              )}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>

        {/* Country Picker Modal */}
        <CountryPicker
          ref={countryPickerRef}
          onSelect={(val) => {
            setCountry(val);
            setIsUsingCurrentLocation(false);

            // Reset dependent fields if country changes
            if (country?.id !== val.id) {
              setState(null);
              setCity(null);
            }
          }}
          selectedId={country?.id}
        />

        {/* State Picker Modal */}
        <StatePicker
          ref={statePickerRef}
          onSelect={(val) => {
            setState(val);
            setIsUsingCurrentLocation(false);

            // Reset city if state changes
            if (state?.id !== val.id) {
              setCity(null);
            }
          }}
          selectedId={state?.id}
          countryId={country?.id}
        />

        {/* City Picker Modal */}
        <CityPicker
          ref={cityPickerRef}
          onSelect={(val) => {
            setCity(val);
            setIsUsingCurrentLocation(false);
          }}
          selectedId={city?.id}
          countryId={country?.id}
          stateId={state?.id}
        />
      </>
    );
  }
);

// Set display name
LocationFilterSheet.displayName = "LocationFilterSheet";

/**
 * useStyles - Specify styles to use
 *
 * @returns StyleSheet object
 */
const useStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginVertical: 12,
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 100,
      height: "100%",
      gap: 20,
    },
  });
