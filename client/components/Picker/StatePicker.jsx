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
import { ActivityIndicator, Text, useTheme } from "react-native-paper";
import { GetState } from "react-country-state-city";
import { TextInput } from "../TextInput/TextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStyles } from "./Picker.styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const StatePicker = forwardRef(
  ({ onSelect, countryId, selectedId }, ref) => {
    const sheetRef = useRef(null);
    const theme = useTheme();
    const styles = useStyles(theme);
    const insets = useSafeAreaInsets();

    const [search, setSearch] = useState("");
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);

    const snapPoints = useMemo(() => ["100%"], []);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.snapToIndex(0),
      close: () => sheetRef.current?.close(),
    }));

    useEffect(() => {
      const fetchStates = async () => {
        if (countryId) {
          setLoading(true);
          try {
            const fetched = await GetState(countryId);
            const stateData = fetched || [];
            setStates(stateData);
          } catch (error) {
            console.error("Failed to fetch states:", error);
            setStates([]);
          } finally {
            setLoading(false);
          }
        } else {
          setStates([]);
        }
      };
      fetchStates();
    }, [countryId]);

    const filtered = useMemo(
      () =>
        states.filter((state) =>
          state.name.toLowerCase().includes(search.toLowerCase())
        ),
      [states, search]
    );

    const handleSelect = (state) => {
      onSelect({
        id: state.id,
        name: state.name,
        stateCode: state.state_code,
        latitude: state.latitude,
        longitude: state.longitude,
        hasCities: state.hasCities,
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
            <Text style={styles.loadingText}>Loading states...</Text>
          </View>
        );
      }

      if (filtered.length === 0 && !loading) {
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? "No states found" : "No states available"}
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
          <Text style={styles.title}>Select State</Text>
          <TextInput
            placeholder="Search state..."
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

StatePicker.displayName = "StatePicker";
