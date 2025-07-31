/**
 * Import Modules
 */
import {
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { useStyles } from "./ProfilePage.styles";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { InfoItem } from "./units/InfoItem";
import { Chip } from "@/components/Chip/Chip";
import { BackgroundItem } from "./units/BackgroundItem";
import { Divider } from "@/components/Divider/Divider";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as ImagePicker from "expo-image-picker";
import { useUploadImageMutation } from "@/services/api/user/useUploadImageMutation";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserProvider/UserProvider";
import { Button } from "@/components/Button/Button";
import { StarRatingDisplay } from "react-native-star-rating-widget";

dayjs.extend(utc); // Enable UTC support in dayjs

/**
 * ProfilePage - Displays the profile information for a user.
 *
 * @param {object} props
 * @returns JSX Element rendering the profile page
 */
export const ProfilePage = ({ user, externalView = false }) => {
  const { user: userContext, handleSetUser } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const [loadImageError, setLoadImageError] = useState(false);
  const { mutateAsync: uploadImage } = useUploadImageMutation({}); // Upload image mutation

  const [rating, setRating] = useState(5);

  // Helper function to format location string from user data
  const formatLocation = () => {
    const locationParts = [];
    const { country, state, city, postalCode } = user;

    if (city) {
      locationParts.push(city?.name);
    }

    if (state) {
      locationParts.push(
        isNaN(state?.stateCode) && state.stateCode
          ? state?.stateCode
          : state?.name
      );
    }

    if (postalCode) {
      locationParts.push(postalCode);
    }

    if (country?.name) {
      locationParts.push(country?.name);
    }

    return locationParts.length === 1
      ? locationParts.join("")
      : locationParts.join(", ");
  };

  // Check if user has any location data
  const hasLocationData = useMemo(
    () => user.city || user.postalCode || user.country?.name,
    [user.city, user.postalCode, user.country?.name]
  );

  // Show about section only if either about or hourly rate exists
  const showAboutSection = useMemo(
    () => user.about || user.hourlyRate,
    [user.about, user.hourlyRate]
  );

  // Determine if any preferred location is selected
  const showPreferredLocations = useMemo(() => {
    if (!user.preferredLocations) return;

    const { publicPlace, tutorPlace, online } = user.preferredLocations;

    return publicPlace || tutorPlace || online;
  }, [user.preferredLocations]);

  // Format duration range between start and end date
  const getDurationText = (startDate, endDate) => {
    if (!startDate && !endDate) return "";

    const formattedStartDate = dayjs.utc(startDate).format("MMM YYYY");
    const formattedEndDate = endDate
      ? dayjs.utc(endDate).format("MMM YYYY")
      : "Present";
    let dateText = `${formattedStartDate} - ${formattedEndDate}`;

    if (startDate === endDate) {
      dateText = formattedStartDate;
    }

    return dateText;
  };

  // Handle image picking and upload to server
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      // Upload profile image
      await uploadImage(formData, {
        onSuccess: (response) => {
          Toast.show({ type: "success", text1: response.message });
          handleSetUser({ data: { ...userContext, image: response.data } });
          setLoadImageError(false);
        },
        onError: (error) => {
          Toast.show({ type: "error", text1: error.message });
        },
      });
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Pressable>
          {/* User avatar and Name section */}
          <View style={styles.mainList}>
            <View style={styles.listContainer}>
              <View style={styles.leftWrapper}>
                <TouchableOpacity
                  onPress={handlePickImage}
                  style={styles.avatarContainer}
                  disabled={externalView}
                >
                  {user.image && !loadImageError ? (
                    <Avatar.Image
                      size={100}
                      source={{ uri: user.image }}
                      onError={() => setLoadImageError(true)}
                    />
                  ) : (
                    <Avatar.Text
                      size={100}
                      label={`${user.firstName[0]}${user.lastName[0]}`}
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  )}

                  {!externalView && (
                    <MaterialCommunityIcons
                      name="plus-circle"
                      size={24}
                      color={theme.colors.textSecondary}
                      style={styles.iconContainer}
                    />
                  )}
                </TouchableOpacity>

                <View style={styles.nameContainer}>
                  <Text variant="headlineSmall" style={{ fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </Text>

                  {/* Rating */}
                  <TouchableOpacity
                    onPress={() => router.push(`/(modals)/reviews/${user._id}`)}
                    style={styles.rating}
                  >
                    <StarRatingDisplay
                      rating={rating}
                      starSize={18}
                      starStyle={styles.star}
                      style={styles.starContainer}
                    />
                    <Text variant="bodyMedium">5.0</Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={18}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {!externalView && (
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
              )}
            </View>
          </View>

          {/* Contact Info section */}
          <View
            style={[
              styles.container,
              styles.contactContainer,
              { paddingBottom: 24 },
            ]}
          >
            <TouchableOpacity
              onPress={() => Linking.openURL(`mailto:${user.email}`)}
              disabled={!externalView}
            >
              <InfoItem icon="email" value={user.email} />
            </TouchableOpacity>

            {user.phone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${user.phone}`)}
                disabled={!externalView}
              >
                <InfoItem icon="phone" value={user.phone} />
              </TouchableOpacity>
            )}

            {hasLocationData && (
              <InfoItem icon="map-marker" value={formatLocation()} />
            )}
          </View>

          {/* About section */}
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

          {user.role === "tutor" && !externalView && (
            <>
              {/* Availability section */}
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

              {/* Preferred Location section */}
              <Divider />
              <View style={styles.container}>
                <View style={styles.titleWrapper}>
                  <Text variant="titleLarge">Preferred Location</Text>

                  {!externalView && (
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/profile/preferredLocation",
                          params: {
                            preferredLocations: JSON.stringify(
                              user.preferredLocations
                            ),
                          },
                        })
                      }
                      style={{ padding: 4 }}
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={20}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {showPreferredLocations && (
                  <View style={styles.preferredLocation}>
                    {user.preferredLocations.publicPlace && (
                      <InfoItem
                        icon="map"
                        value="In a Public Place"
                        containerStyles={{ padding: 16 }}
                      />
                    )}

                    {user.preferredLocations.tutorPlace && (
                      <InfoItem
                        icon="home"
                        value="At Tutor's Place"
                        containerStyles={{ padding: 16 }}
                      />
                    )}

                    {user.preferredLocations.online && (
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

          {/* Offered Sessions section */}
          {user.role === "tutor" && externalView && (
            <>
              <Divider />
              <View style={styles.container}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(modals)/userDetails/offeredSessions",
                      params: {
                        sessions: JSON.stringify(user?.sessions),
                        userName: user.firstName,
                      },
                    })
                  }
                >
                  <View style={[styles.availability]}>
                    <Text variant="titleLarge">
                      Offered Sessions{" "}
                      {user.sessions.length > 0 && `(${user.sessions.length})`}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={theme.colors.text}
                    />
                  </View>
                </TouchableOpacity>
                {user.sessions?.slice(0, 3).map((item) => {
                  const { _id, subject, description, estimatedDuration } = item;

                  return (
                    <TouchableOpacity
                      key={_id}
                      onPress={() => {
                        router.push({
                          pathname: "/(modals)/userDetails/sessionDetails",
                          params: { session: JSON.stringify(item) },
                        });
                      }}
                    >
                      <BackgroundItem
                        title={subject}
                        subtitle={`Estimated Duration: ${estimatedDuration} hour${
                          +estimatedDuration > 1 ? "s" : ""
                        }`}
                        tertiaryText={description}
                        disabledEdit
                      />
                    </TouchableOpacity>
                  );
                })}

                {user.sessions?.length === 0 && (
                  <Text style={{ color: theme.colors.textSecondary }}>
                    No sessions found
                  </Text>
                )}
              </View>
            </>
          )}

          {/* Education section */}
          <Divider />
          <View style={styles.container}>
            <View style={styles.titleWrapper}>
              <Text variant="titleLarge">Education</Text>
              {!externalView && (
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
              )}
            </View>

            {/* Education Item */}
            {user.education?.length > 0 &&
              user.education.map((item) => {
                const {
                  _id,
                  school,
                  degree,
                  fieldOfStudy,
                  startDate,
                  endDate,
                } = item;

                const getSubtitle = () => {
                  let subtitle = [];

                  if (degree) {
                    subtitle.push(degree);
                  }
                  if (fieldOfStudy) {
                    subtitle.push(fieldOfStudy);
                  }

                  return subtitle.length === 1
                    ? subtitle.join("")
                    : subtitle.join(", ");
                };
                return (
                  <BackgroundItem
                    key={_id}
                    title={school}
                    subtitle={getSubtitle()}
                    tertiaryText={getDurationText(startDate, endDate)}
                    onPressEdit={() =>
                      router.push({
                        pathname: `/profile/education/${_id}`,
                        params: { education: JSON.stringify(item) },
                      })
                    }
                    disabledEdit={externalView}
                  />
                );
              })}

            {user.education?.length === 0 && externalView && (
              <Text style={{ color: theme.colors.textSecondary }}>
                No education found
              </Text>
            )}
          </View>

          {/* Experience section */}
          {user.role === "tutor" && (
            <>
              <Divider />
              <View style={styles.container}>
                <View style={styles.titleWrapper}>
                  <Text variant="titleLarge">Experience</Text>
                  {!externalView && (
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
                  )}
                </View>

                {/* Experience Item */}
                {user.experience?.length > 0 &&
                  user.experience.map((item) => {
                    const { _id, title, company, startDate, endDate } = item;

                    return (
                      <BackgroundItem
                        key={_id}
                        title={title}
                        subtitle={company}
                        tertiaryText={getDurationText(startDate, endDate)}
                        onPressEdit={() =>
                          router.push({
                            pathname: `/profile/experience/${_id}`,
                            params: { experience: JSON.stringify(item) },
                          })
                        }
                        disabledEdit={externalView}
                      />
                    );
                  })}

                {user.experience?.length === 0 && externalView && (
                  <Text style={{ color: theme.colors.textSecondary }}>
                    No experience found
                  </Text>
                )}
              </View>
            </>
          )}
        </Pressable>
      </ScrollView>

      {/* Book Tutor Button */}
      {user.role === "tutor" && externalView && (
        <View style={styles.buttonContainer}>
          <Button
            onPress={() =>
              router.push({ pathname: `/(modals)/bookTutor/${user._id}` })
            }
          >
            Book Tutor
          </Button>
        </View>
      )}
    </>
  );
};
