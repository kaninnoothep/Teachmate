/**
 * Import Modules
 */
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, TouchableOpacity, Keyboard } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { GetCountries } from "react-country-state-city";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { TextInput } from "../TextInput/TextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStyles } from "./Picker.styles";

/**
 * CountryPicker - A bottom sheet component for selecting a country
 *
 * @param {*} props
 * @param {*} ref
 * @returns JSX Element
 */
export const CountryPicker = forwardRef(({ onSelect, selectedId }, ref) => {
  const sheetRef = useRef(null); // Ref to control BottomSheet
  const theme = useTheme();
  const styles = useStyles(theme);
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define snap points for BottomSheet
  const snapPoints = useMemo(() => ["100%"], []);

  // Expose methods to open and close the BottomSheet
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
    close: () => sheetRef.current?.close(),
  }));

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = await GetCountries();
        setCountries(data || []);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Filter countries by search text
  const filteredCountries = useMemo(
    () =>
      countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [countries, search]
  );

  // Handle country selection
  const handleSelect = (country) => {
    onSelect({
      id: country.id,
      name: country.name,
      emoji: country.emoji,
      latitude: country.latitude,
      longitude: country.longitude,
      hasStates: country.hasStates,
    });
    sheetRef.current?.close();
  };

  // Render each item in the list
  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = item.id === selectedId;
      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleSelect(item)}
        >
          <Text
            variant="bodyLarge"
            style={isSelected ? styles.selectedText : undefined}
          >
            {item.emoji} {item.name}
          </Text>

          {isSelected && (
            <MaterialCommunityIcons
              name="check"
              size={24}
              color={theme.colors.primary}
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedId]
  );

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

  // Render content inside BottomSheet
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading countries...</Text>
        </View>
      );
    }

    if (filteredCountries.length === 0 && !loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {search ? "No countries found" : "No countries available"}
          </Text>
        </View>
      );
    }

    return (
      <BottomSheetFlatList
        data={filteredCountries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.outlineVariant }}
      containerStyle={{ marginTop: insets.top }}
      onAnimate={() => Keyboard.dismiss()}
      onClose={() => setSearch("")}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Select Country</Text>
        <TextInput
          placeholder="Search country..."
          value={search}
          onChangeText={setSearch}
          hideHelperTextSpace
          style={{ marginBottom: 12 }}
        />
        {renderContent()}
      </View>
    </BottomSheet>
  );
});

// Set display name
CountryPicker.displayName = "CountryPicker";
