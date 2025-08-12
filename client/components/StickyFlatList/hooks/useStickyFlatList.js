/**
 * Import Modules
 */
import { useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";

const window = Dimensions.get("window");

/**
 * useStickyFlatList - Hook to manage sticky header behavior for FlatList.
 * Tracks scroll position and layout heights of header and sticky elements to
 * apply animated positioning for sticky effect.
 *
 * @returns [
 *   scrollY: Animated.Value - animated scroll position value,
 *   styles: object - styles for header margin and sticky element positioning,
 *   onLayoutHeaderElement: function - callback to capture header layout height,
 *   onLayoutTopListElement: function - callback to capture optional top list height,
 *   onLayoutTopStickyElement: function - callback to capture sticky element height
 * ]
 */
export const useStickyFlatList = () => {
  // Animated value to track vertical scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // State to store heights of header, sticky element, and optional top list element
  const [heights, setHeights] = useState({
    header: 0,
    sticky: 0,
    topList: 0,
  });

  // Styles applied to header and sticky element to manage spacing and positioning
  const styles = {
    // Header bottom margin ensures content is spaced below sticky elements
    header: {
      marginBottom: heights.sticky + heights.topList,
    },
    // Sticky element is positioned absolutely and moves vertically with scroll
    stickyElement: {
      left: 0,
      marginTop: heights.header, // Positions sticky element below header
      position: "absolute",
      right: 0,
      transform: [
        {
          translateY: scrollY.interpolate({
            extrapolate: "clamp", // Clamp values outside range
            inputRange: [-window.height, heights.header], // Scroll range
            outputRange: [window.height, -heights.header], // Translate range
          }),
        },
      ],
      zIndex: 2, // Ensures sticky element appears above other content
    },
  };

  // Layout callback to update header height when measured
  const onLayoutHeaderElement = (event) => {
    setHeights({ ...heights, header: event.nativeEvent.layout.height });
  };

  // Layout callback to update optional top list element height
  const onLayoutTopListElement = (event) => {
    setHeights({ ...heights, topList: event.nativeEvent.layout.height });
  };

  // Layout callback to update sticky element height
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
