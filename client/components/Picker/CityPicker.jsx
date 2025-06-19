import {
  useEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { GetCity } from "react-country-state-city";
import { TextInput } from "../TextInput/TextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./Picker.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const CityPicker = forwardRef(
  ({ onSelect, countryId, stateId, selectedId }, ref) => {
    const sheetRef = useRef(null);
    const theme = useTheme();
    const styles = useStyles(theme);
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState("");
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    const snapPoints = useMemo(() => ["100%"], []);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    useEffect(() => {
      const fetchCities = async () => {
        if (countryId && stateId) {
          setLoading(true);
          try {
            const fetched = await GetCity(countryId, stateId);
            const cityData = fetched || [];
            setCities(cityData);
          } catch (error) {
            console.error("Failed to fetch cities:", error);
            setCities([]);
          } finally {
            setLoading(false);
          }
        } else {
          setCities([]);
        }
      };
      fetchCities();
    }, [countryId, stateId]);

    const filtered = useMemo(
      () =>
        cities.filter((city) =>
          city.name.toLowerCase().includes(search.toLowerCase())
        ),
      [cities, search]
    );

    const handleSelect = (city) => {
      onSelect({
        id: city.id,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      });
      sheetRef.current?.close();
    };

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
              {item.name}
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

    const renderContent = () => {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading cities...</Text>
          </View>
        );
      }

      if (filtered.length === 0 && !loading) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? "No cities found" : "No cities available"}
            </Text>
          </View>
        );
      }

      return (
        <BottomSheetFlatList
          data={filtered}
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
          <Text style={styles.title}>Select City</Text>
          <TextInput
            placeholder="Search city..."
            value={search}
            onChangeText={setSearch}
            hideHelperTextSpace
            style={{ marginBottom: 12 }}
          />
          {renderContent()}
        </View>
      </BottomSheet>
    );
  }
);
CityPicker.displayName = "CityPicker";
