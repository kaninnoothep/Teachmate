import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Text,
  TextInput as PaperTextInput,
  useTheme,
  Portal,
} from "react-native-paper";
import { useDebounce } from "use-debounce";
import { useStyles } from "./ExplorePage.styles";
import { useRouter } from "expo-router";
import { TutorItem } from "./components/TutorItem";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { TextInput } from "@/components/TextInput/TextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LocationFilterModal } from "./components/LocationFilterModal";
import { useTutorsQuery } from "@/services/api/explore/useTutorsQuery";

export const ExplorePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const locationFilterRef = useRef(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounce] = useDebounce(searchQuery, 600);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const { tutors, isFetching, refetch } = useTutorsQuery(
    searchDebounce,
    country?.name,
    state?.name,
    city?.name
  );

  const hasLocationFilter = useMemo(
    () => country || state || city,
    [country, state, city]
  );

  const getFilterLabel = () => {
    const label = [];

    if (city) {
      label.push(city?.name);
    }

    if (state) {
      label.push(isNaN(state?.stateCode) ? state?.stateCode : state?.name);
    }

    if (!city && country) {
      label.push(country?.name);
    }

    return label.length > 0 ? label.join(", ") : "Location";
  };

  const handleRefresh = async () => {
    setIsManualRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const renderHeaderComponent = () => (
    <Pressable style={styles.listHeaderContainer}>
      <Text variant="headlineSmall">
        Available Tutors {tutors.length > 0 && `(${tutors.length})`}
      </Text>
    </Pressable>
  );
  const renderFooterComponent = () => <Pressable style={{ height: 50 }} />;
  const renderSeparatorComponent = () => <Pressable style={{ height: 10 }} />;

  return (
    <>
      <Pressable style={styles.container}>
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchTextInputContainer}
            left={
              <PaperTextInput.Icon
                icon="magnify"
                color={theme.colors.primary}
              />
            }
            placeholder="e.g., Calculus II"
            hideHelperTextSpace
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => locationFilterRef.current?.open()}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={theme.colors.primary}
            />

            <Text
              variant="bodyLarge"
              numberOfLines={1}
              style={[
                styles.locationButtonText,
                !hasLocationFilter && { color: theme.colors.textSecondary },
              ]}
            >
              {getFilterLabel()}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ListHeaderComponent={renderHeaderComponent}
          ListFooterComponent={renderFooterComponent}
          ItemSeparatorComponent={renderSeparatorComponent}
          data={tutors}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isManualRefreshing}
              onRefresh={handleRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/(modals)/userDetails/${item._id}`,
                  params: {
                    itemName: "Tutor Details",
                  },
                })
              }
            >
              <TutorItem tutor={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
          removeClippedSubviews
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            <EmptyList
              iconName="school"
              message="No tutors found"
              containerStyle={{ marginTop: 100 }}
              isLoading={isFetching}
            />
          }
        />
      </Pressable>
      <Portal>
        <LocationFilterModal
          ref={locationFilterRef}
          {...{ country, setCountry, state, setState, city, setCity }}
        />
      </Portal>
    </>
  );
};
