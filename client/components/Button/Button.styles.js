/**
 * getMode - Get the mode
 *
 * @param {*} variant
 * @returns mode
 */
export const getMode = (variant) => {
  switch (variant) {
    case "primary":
      return "contained";

    case "secondary":
      return "outlined";

    case "tertiary":
      return "contained-tonal";

    case "black-outlined":
      return "outlined";

    case "red-outlined":
      return "outlined";

    case "green-outlined":
      return "outlined";

    case "text":
      return "text";

    case "link":
      return "text";

    default:
      return "contained";
  }
};

/**
 * getLabelStyle - Get the style of the label
 *
 * @param {*} variant
 * @returns label style
 */
export const getLabelStyle = (variant) => {
  switch (variant) {
    case "link":
      return { textDecorationLine: "underline" };

    default:
      return {};
  }
};

/**
 * getTheme - Get current theme
 *
 * @param {*} variant
 * @param {*} theme
 * @returns Theme colors
 */
export const getTheme = (variant, theme) => {
  switch (variant) {
    case "primary":
      return { colors: { onSurfaceDisabled: "white" } };

    case "secondary":
      return { colors: { outline: theme.colors.primary } };

    case "tertiary":
      return {
        colors: {
          secondaryContainer: theme.colors.primaryContainer,
          onSecondaryContainer: theme.colors.primary,
        },
      };

    case "black-outlined":
      return {
        colors: { primary: theme.colors.text },
      };

    case "red-outlined":
      return {
        colors: {
          primary: theme.colors.error,
          outline: theme.colors.error,
        },
      };

    case "green-outlined":
      return {
        colors: {
          primary: theme.colors.success,
          outline: theme.colors.success,
        },
      };

    default:
      return {};
  }
};
