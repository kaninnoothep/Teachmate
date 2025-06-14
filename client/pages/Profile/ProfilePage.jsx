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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import * as ImagePicker from "expo-image-picker";
import { useUploadImageMutation } from "@/services/api/user/useUploadImageMutation";
import Toast from "react-native-toast-message";
import { useUser } from "@/context/UserProvider/UserProvider";
import { Button } from "@/components/Button/Button";

dayjs.extend(utc);
export const ProfilePage = ({ user, externalView = false }) => {
  const { user: userContext, handleSetUser } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const { mutateAsync: uploadImage } = useUploadImageMutation({});

  // Helper function to format location string
  const formatLocation = () => {
    const locationParts = [];

    if (user.city) {
      locationParts.push(user.city.name);
    }

    if (user.state) {
      locationParts.push(user.state.name);
    }

    if (user.postalCode) {
      locationParts.push(user.postalCode);
    }

    if (user.country?.name) {
      locationParts.push(user.country.name);
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

  const showAboutSection = useMemo(
    () => user.about || user.hourlyRate,
    [user.about, user.hourlyRate]
  );

  const showPreferredLocations = useMemo(() => {
    if (!user.preferredLocations) return;

    const { publicPlace, tutorPlace, online } = user.preferredLocations;

    return publicPlace || tutorPlace || online;
  }, [user.preferredLocations]);

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

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      });

      await uploadImage(formData, {
        onSuccess: (response) => {
          Toast.show({ type: "success", text1: response.message });
          handleSetUser({ data: { ...userContext, image: response.data } });
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
          {/* User avatar and Name */}
          <View style={styles.mainList}>
            <View style={styles.listContainer}>
              <View style={styles.leftWrapper}>
                <TouchableOpacity
                  onPress={handlePickImage}
                  style={styles.avatarContainer}
                  disabled={externalView}
                >
                  {user.image ? (
                    <Avatar.Image size={100} source={{ uri: user.image }} />
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

                <Text variant="headlineSmall" style={{ fontWeight: 700 }}>
                  {user.firstName} {user.lastName}
                </Text>
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

          {user.role === "tutor" && !externalView && (
            <>
              {/* Availability */}
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

          {/* Offered Sessions */}
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
                {user.sessions.slice(0, 3).map((item) => {
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
                        subtitle={`Estimated Duration: ${estimatedDuration}`}
                        tertiaryText={description}
                        disabledEdit
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Education */}
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
                  let subtitle = "";

                  if (degree) {
                    subtitle = degree;
                  }
                  if (fieldOfStudy) {
                    subtitle += fieldOfStudy;
                  }

                  return subtitle;
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
          </View>

          {/* Experience */}
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
              </View>
            </>
          )}
        </Pressable>
      </ScrollView>
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
