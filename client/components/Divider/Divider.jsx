import { Divider as PaperDivider, useTheme } from "react-native-paper";

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
