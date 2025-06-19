import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useStyles } from "./ExplorePage.styles";
import { useRouter } from "expo-router";
import { TutorItem } from "./components/TutorItem";
import { EmptyList } from "@/components/EmptyList/EmptyList";
import { TextInput } from "@/components/TextInput/TextInput";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LocationFilterModal } from "./components/LocationFilterModal";

const tutors = [
  {
    _id: "6842e328b69189b73efab179",
    image:
      "https://res.cloudinary.com/dq1gdgetx/image/upload/v1749722055/asl6krflyjyiwvuo1gd8.jpg",
    firstName: "Tony",
    lastName: "Ja",
    about:
      "Lorem ipsum bibendum pretium tincidunt integer quis adipiscing molestie scelerisque.",
    preferredLocations: {
      publicPlace: true,
      tutorPlace: false,
      online: true,
    },
    hourlyRate: "25",
  },
];
export const ExplorePage = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = useStyles(theme);
  const locationFilterRef = useRef(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    // console.log("country", country);
    console.log("state", state);
    console.log("stateCode", state?.stateCode);
    console.log("stateCode isNaN", isNaN(state?.stateCode));
    // console.log("city", city);
  }, [country, state, city]);
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
      //   await refetch();
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
                    itemName: "tutor Details",
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
              // isLoading={isFetching}
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
