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

    case "text":
      return "text";

    case "link":
      return "text";

    default:
      return "contained";
  }
};

export const getLabelStyle = (variant) => {
  switch (variant) {
    case "link":
      return { textDecorationLine: "underline" };

    default:
      return {};
  }
};

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

    default:
      return {};
  }
};
