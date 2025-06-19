import { Button } from "@/components/Button/Button";
import { CityPicker } from "@/components/Picker/CityPicker";
// import { Dropdown } from "@/components/Dropdown/Dropdown";
import { CountryPicker } from "@/components/Picker/CountryPicker";
import { PickerButton } from "@/components/Picker/PickerButton";
import { StatePicker } from "@/components/Picker/StatePicker";
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
import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const LocationFilterModal = forwardRef(
  ({ country, setCountry, state, setState, city, setCity }, ref) => {
    const sheetRef = useRef(null);
    const countryPickerRef = useRef(null);
    const statePickerRef = useRef(null);
    const cityPickerRef = useRef(null);

    const theme = useTheme();
    const styles = useStyles(theme);
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ["60%"], []);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    const getCountryLabel = () => {
      if (country?.emoji && country?.name) {
        return `${country?.emoji || ""} ${country?.name}`;
      }
      return "";
    };

    const handleClear = () => {
      setCountry(null);
      setState(null);
      setCity(null);
    };

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
        >
          <View style={styles.container}>
            <View style={styles.headerWrapper}>
              <Text style={styles.title}>Filters</Text>
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
              >
                <Text variant="bodyLarge" style={styles.clearButtonText}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>

            <BottomSheetScrollView
              contentContainerStyle={styles.contentContainer}
            >
              <PickerButton
                label="Country"
                value={getCountryLabel()}
                onPress={() => countryPickerRef.current?.open()}
              />

              {country && country?.hasStates && (
                <PickerButton
                  label="State"
                  value={state?.name}
                  onPress={() => statePickerRef.current?.open()}
                />
              )}

              {country && state && state?.hasCities && (
                <PickerButton
                  label="City"
                  value={city?.name}
                  onPress={() => cityPickerRef.current?.open()}
                />
              )}

              {/* <Button>Apply</Button> */}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>

        <CountryPicker
          ref={countryPickerRef}
          onSelect={(val) => {
            setCountry(val);

            if (country?.id !== val.id) {
              setState(null);
              setCity(null);
            }
          }}
          selectedId={country?.id}
        />

        <StatePicker
          ref={statePickerRef}
          onSelect={(val) => {
            setState(val);

            if (state?.id !== val.id) {
              setCity(null);
            }
          }}
          selectedId={state?.id}
          countryId={country?.id}
        />

        <CityPicker
          ref={cityPickerRef}
          onSelect={(val) => setCity(val)}
          selectedId={city?.id}
          countryId={country?.id}
          stateId={state?.id}
        />
      </>
    );
  }
);

LocationFilterModal.displayName = "LocationFilterModal";

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingBottom: 60,
    },
    headerWrapper: {
      position: "relative",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginVertical: 12,
    },
    clearButton: {
      position: "absolute",
      alignSelf: "flex-end",
      right: 0,
      bottom: 10,
    },
    clearButtonText: {
      color: theme.colors.error,
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 100,
      height: "100%",
      gap: 20,
    },
  });
