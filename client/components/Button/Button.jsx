/**
 * Import Modules
 */
import { Button as PaperButton, useTheme } from "react-native-paper";
import PropTypes from "prop-types";
import { getLabelStyle, getMode, getTheme } from "./Button.styles";

/**
 * Specify the format for Button
 *
 * @param {*} props
 * @returns JSX Element
 */
export const Button = ({
  variant = "primary",
  mode = "contained",
  iconRight = false,
  labelStyle,
  contentStyle,
  style,
  theme,
  ...props
}) => {
  const themeContext = useTheme();

  return (
    <PaperButton
      mode={variant ? getMode(variant) : mode}
      labelStyle={[
        {
          fontSize: 16,
          fontWeight: "600",
        },
        getLabelStyle(variant),
        labelStyle,
      ]}
      contentStyle={[
        iconRight && { flexDirection: "row-reverse" },
        contentStyle,
      ]}
      style={[variant !== "link" && { width: "100%" }, style]}
      theme={{ roundness: 2, ...getTheme(variant, themeContext), ...theme }}
      {...props}
    />
  );
};

// Specify the types of props to be received by Button
Button.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "tertiary",
    "black-outlined",
    "red-outlined",
    "text",
    "link",
  ]),
  mode: PropTypes.oneOf([
    "text",
    "outlined",
    "contained",
    "elevated",
    "contained-tonal",
  ]),
  iconRight: PropTypes.bool,
  labelStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  style: PropTypes.object,
  theme: PropTypes.object,
};
