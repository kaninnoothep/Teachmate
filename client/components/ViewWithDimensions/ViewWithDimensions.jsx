/**
 * Import Modules
 */
import { useState } from "react";
import { View } from "react-native";

/**
 * ViewWithDimensions - A wrapper component that measures its own width and height,
 * then passes those dimensions as an argument to its child function.
 *
 * @param {*} props
 * @returns JSX Element
 */
export const ViewWithDimensions = ({ children, ...props }) => {
  // State to keep track of the View's dimensions
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
