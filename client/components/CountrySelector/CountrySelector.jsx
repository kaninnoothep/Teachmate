import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { Text, useTheme } from "react-native-paper";

export const CountrySelector = ({
  onSelect,
  onClose,
  countryCode,
  ...props
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [countryVisible, setCountryVisible] = useState(false);
  const handleOnClose = () => {
    setCountryVisible(false);
    onClose && onClose();
  };

  return (
    <TouchableOpacity
      style={styles.countrySelectorWrapper}
      onPress={() => setCountryVisible(true)}
    >
      {countryCode && <Text style={styles.countryLabel}>Country</Text>}

      <View style={[styles.countrySelectorButton, styles.countrySelectorLabel]}>
        <View
          style={[
            styles.labelWrapper,
            {
              opacity: countryCode ? 0 : 1,
            },
          ]}
        >
          <Text variant="bodyLarge" style={styles.countrySelectorText}>
            Country
          </Text>
        </View>
        <CountryPicker
          withFilter
          withFlag
          withCountryNameButton
          withEmoji
          closeButtonImageStyle={{ width: 44, height: 44 }}
          flatListProps={{
            contentContainerStyle: { paddingLeft: 16 },
          }}
          containerButtonStyle={{
            opacity: countryCode ? 1 : 0,
          }}
          onSelect={onSelect}
          visible={countryVisible}
          onClose={handleOnClose}
          {...{
            countryCode,
            ...props,
          }}
        />

        <MaterialCommunityIcons
          name="unfold-more-horizontal"
          size={24}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const useStyles = (theme) =>
  StyleSheet.create({
    countrySelectorWrapper: {
      alignSelf: "stretch",
      position: "relative",
      minHeight: 50,
    },
    countrySelectorText: {
      color: theme.colors.onSurfaceVariant,
    },
    countrySelectorLabel: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    labelWrapper: {
      position: "absolute",
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    countrySelectorButton: {
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 16,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.outline,
      minHeight: 50,
    },
    countryLabel: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 6,
      fontSize: 12,
      position: "absolute",
      top: -8,
      left: 8,
      zIndex: 2,
    },
  });
