/**
 * Import Modules
 */
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import StarRating from "react-native-star-rating-widget";
import { HelperText, Text, useTheme } from "react-native-paper";
import { StyleSheet, View } from "react-native";

/**
 * FormStarRating - Specify format for Form star rating
 *
 * @param {*} props
 * @returns JSX Element
 */
export const FormStarRating = ({
  control,
  name,
  label = "",
  error: hasError,
  helperText,
  hideHelperTextSpace = false,
  color,
  emptyColor,
  containerStyle,
  labelStyle,
  helperTextStyle,
  starStyle,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Controller
      {...{ name, control }}
      render={({
        field: { onChange, value },
        fieldState: { invalid, error },
      }) => (
        <View style={[styles.container, containerStyle]}>
          {label && (
            <Text
              variant="titleMedium"
              style={[
                styles.label,
                (invalid || hasError) && { color: theme.colors.error },
                labelStyle,
              ]}
            >
              {label}
            </Text>
          )}

          <StarRating
            {...{ ...props, onChange }}
            rating={value}
            color={theme.colors.star || color}
            emptyColor={
              (invalid || hasError ? theme.colors.error : theme.colors.star) ||
              emptyColor
            }
            starStyle={[styles.star, starStyle]}
          />

          {(!hideHelperTextSpace || helperText || invalid || hasError) && (
            <HelperText
              type={error ? "error" : "info"}
              visible={helperText}
              style={[styles.helperText, helperTextStyle]}
            >
              {helperText || error?.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
};

// Specify types of props to be received by FormStarRating
FormStarRating.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  hideHelperTextSpace: PropTypes.bool,
  color: PropTypes.string,
  emptyColor: PropTypes.string,
  containerStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  helperTextStyle: PropTypes.object,
  starStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 2,
  },
  star: {
    marginLeft: 0,
    marginRight: 10,
  },
  helperText: {
    paddingVertical: 0,
  },
});
