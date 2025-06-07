import { Button } from "@/components/Button/Button";
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

export const ProfilePage = () => {
  const { user } = useUser();
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable>
        {/* User avatar and Name */}
        <View style={styles.mainList}>
          <View style={styles.listContainer}>
            <View style={styles.leftWrapper}>
              <Avatar.Text
                size={100}
                label={`${user.firstName[0]}${user.lastName[0]}`}
                style={{ backgroundColor: theme.colors.primary }}
              />

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
        <View style={[styles.container, styles.contactContainer]}>
          <InfoItem icon="email" value={user.email} />
          <InfoItem icon="phone" value={"user.phone"} />
          <InfoItem
            icon="map-marker"
            value={"Regina, Saskatchewan, S4S 3H1, Canada"}
          />
        </View>

        {/* About */}
        <View style={styles.container}>
          <Text variant="titleLarge">About {user.firstName}</Text>
          <Chip value={`$25/hour`} />
          <Text variant="bodyMedium">
            Lorem ipsum dolor sit amet consectetur. Pharetra egestas augue
            turpis dolor posuere rhoncus. At vulputate sagittis fames et sed
            neque facilisis et nisl. Sed facilisis lectus nunc at massa dictum
            varius. Odio scelerisque massa elit odio pulvinar feugiat justo
            quam. Aenean urna turpis eu id. Volutpat purus mattis erat rhoncus
            viverra at non sed. Et pellentesque dictumst velit vulputate sit
            nibh ullamcorper arcu aliquet.
          </Text>
        </View>

        {/* Availability */}
        <Divider />
        <TouchableOpacity onPress={() => router.push("/profile/account")}>
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
        <Divider style={styles.divider} />
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text variant="titleLarge">Preferred Location</Text>
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

          <View style={styles.preferredLocation}>
            <InfoItem
              icon="map"
              value="In a Public Place"
              containerStyles={{ padding: 16 }}
            />
            <InfoItem
              icon="home"
              value="At Tutor's Place"
              containerStyles={{ padding: 16 }}
            />
            <InfoItem
              icon="video-outline"
              value="Online"
              containerStyles={{ padding: 16 }}
            />
          </View>
        </View>

        {/* Education */}
        <Divider />
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text variant="titleLarge">Education</Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/account")}
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
            onPressEdit={() => {}}
          />
        </View>

        {/* Experience */}
        <Divider />
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text variant="titleLarge">Experience</Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/account")}
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
            onPressEdit={() => {}}
          />
        </View>
      </Pressable>
    </ScrollView>
  );
};
