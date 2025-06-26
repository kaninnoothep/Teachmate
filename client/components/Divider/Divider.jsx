/**
 * Import Modules
 */
import { Divider as PaperDivider, useTheme } from "react-native-paper";

/**
 * Divider - A custom divider component
 *
 * @param {*} props
 * @returns JSX Element
 */
export const Divider = ({ style }) => {
  const theme = useTheme();

  return (
    <PaperDivider
      style={{
        height: 2,
        backgroundColor: theme.colors.divider,
        ...style,
      }}
    />
  );
};
