import { useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const window = Dimensions.get("window");

export const useStickyFlatList = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
    topList: 0,
  });

  const styles = {
    header: {
      marginBottom: heights.sticky + heights.topList, // <-- In order for the list to be under other elements
    },
    stickyElement: {
      left: 0,
      marginTop: heights.header, // <-- In order for the list to be under Header
      position: "absolute",
      right: 0,
      transform: [
        {
          translateY: scrollY.interpolate({
            // <-- To move an element according to the scroll position
            extrapolate: "clamp",
            inputRange: [-window.height, heights.header],
            outputRange: [window.height, -heights.header],
          }),
        },
      ],
      zIndex: 2,
    },
  };

  const onLayoutHeaderElement = (event) => {
    setHeights({ ...heights, header: event.nativeEvent.layout.height });
  };

  const onLayoutTopListElement = (event) => {
    setHeights({ ...heights, topList: event.nativeEvent.layout.height });
  };

  const onLayoutTopStickyElement = (event) => {
    setHeights({ ...heights, sticky: event.nativeEvent.layout.height });
  };

  return [
    scrollY,
    styles,
    onLayoutHeaderElement,
    onLayoutTopListElement,
    onLayoutTopStickyElement,
  ];
};
