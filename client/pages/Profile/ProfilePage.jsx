import { useUser } from "@/context/UserProvider/UserProvider";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { useStyles } from "./ProfilePage.styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { InfoItem } from "./units/InfoItem";
import { Chip } from "@/components/Chip/Chip";
import { BackgroundItem } from "./units/BackgroundItem";
import { Divider } from "@/components/Divider/Divider";
import { useMemo } from "react";

export const ProfilePage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();

  // Helper function to format location string
  const formatLocation = () => {
    const locationParts = [];

    if (user.city) {
      locationParts.push(user.city);
    }

    if (user.postalCode) {
      locationParts.push(user.postalCode);
    }

    if (user.country?.name) {
      locationParts.push(user.country.name);
    }

    return locationParts.join(", ");
  };

  // Check if user has any location data
  const hasLocationData = useMemo(
    () => user.city || user.postalCode || user.country?.name,
    [user.city, user.postalCode, user.country?.name]
  );

  const showAboutSection = useMemo(
    () => user.about || user.hourlyRate,
    [user.about, user.hourlyRate]
  );

  const { publicPlace, tutorPlace, online } = user.preferredLocations;

  const showPreferredLocations = useMemo(
    () => publicPlace || tutorPlace || online,
    [publicPlace, tutorPlace, online]
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable>
        {/* User avatar and Name */}
        <View style={styles.mainList}>
          <View style={styles.listContainer}>
            <View style={styles.leftWrapper}>
              <TouchableOpacity
                onPress={() => {}}
                style={styles.avatarContainer}
              >
                <Avatar.Text
                  size={100}
                  label={`${user.firstName[0]}${user.lastName[0]}`}
                  style={{ backgroundColor: theme.colors.primary }}
                />

                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color={theme.colors.textSecondary}
                  style={styles.iconContainer}
                />
              </TouchableOpacity>

              <Text variant="headlineSmall" style={{ fontWeight: 700 }}>
                {user.firstName} {user.lastName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/profile/account")}
              style={{ padding: 4 }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Info */}
        <View
          style={[
            styles.container,
            styles.contactContainer,
            { paddingBottom: 24 },
          ]}
        >
          <InfoItem icon="email" value={user.email} />
          {user.phone && <InfoItem icon="phone" value={user.phone} />}
          {hasLocationData && (
            <InfoItem icon="map-marker" value={formatLocation()} />
          )}
        </View>

        {/* About */}
        {showAboutSection && (
          <View
            style={[
              styles.container,
              { paddingVertical: 0, paddingBottom: 24 },
            ]}
          >
            <Text variant="titleLarge">About {user.firstName}</Text>

            {user.hourlyRate && <Chip value={`$${user.hourlyRate}/hour`} />}
            {user.about && <Text variant="bodyMedium">{user.about}</Text>}
          </View>
        )}

        {/* Availability */}
        {user.role === "tutor" && (
          <>
            <Divider />
            <TouchableOpacity
              onPress={() => router.push("/profile/availability")}
            >
              <View style={[styles.container, styles.availability]}>
                <Text variant="titleLarge">Availability</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={theme.colors.text}
                />
              </View>
            </TouchableOpacity>

            {/* Preferred Location */}
            <Divider />
            <View style={styles.container}>
              <View style={styles.titleWrapper}>
                <Text variant="titleLarge">Preferred Location</Text>
                <TouchableOpacity
                  onPress={() => router.push("/profile/preferredLocation")}
                  style={{ padding: 4 }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>

              {showPreferredLocations && (
                <View style={styles.preferredLocation}>
                  {publicPlace && (
                    <InfoItem
                      icon="map"
                      value="In a Public Place"
                      containerStyles={{ padding: 16 }}
                    />
                  )}

                  {tutorPlace && (
                    <InfoItem
                      icon="home"
                      value="At Tutor's Place"
                      containerStyles={{ padding: 16 }}
                    />
                  )}

                  {online && (
                    <InfoItem
                      icon="video-outline"
                      value="Online"
                      containerStyles={{ padding: 16 }}
                    />
                  )}
                </View>
              )}
            </View>
          </>
        )}

        {/* Education */}
        <Divider />
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text variant="titleLarge">Education</Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/education")}
              style={{ padding: 4 }}
            >
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Education Item */}
          <BackgroundItem
            title={"University of Regina"}
            subtitle={`Master of Science (MS), Mathematics`}
            durationText={`Jan 2021 - Oct 2023`}
            onPressEdit={() => router.push("/profile/education/1234")}
          />
        </View>

        {/* Experience */}
        {user.role === "tutor" && (
          <>
            <Divider />
            <View style={styles.container}>
              <View style={styles.titleWrapper}>
                <Text variant="titleLarge">Experience</Text>
                <TouchableOpacity
                  onPress={() => router.push("/profile/experience")}
                  style={{ padding: 4 }}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>

              {/* Experience Item */}
              <BackgroundItem
                title={"University of Regina"}
                subtitle={`Master of Science (MS), Mathematics`}
                durationText={`Jan 2021 - Oct 2023`}
                onPressEdit={() => router.push("/profile/experience/1234")}
              />
            </View>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
};
