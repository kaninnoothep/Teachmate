import { useState } from "react";
import { View } from "react-native";

export const ViewWithDimensions = ({ children, ...props }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  return (
    <View
      onLayout={(event) =>
        setDimensions({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }
      {...props}
    >
      {children(dimensions)}
    </View>
  );
};
