/**
 * Import Modules
 */
import { useStickyFlatList } from "./hooks/useStickyFlatList";
import { Animated, View } from "react-native";

/**
 * StickyFlatList - A FlatList with a sticky header element which stays fixed at the top while scrolling.
 *
 * @param {object} props
 * @returns JSX Element rendering a FlatList with sticky header behavior
 */
export const StickyFlatList = ({
  customContainerStyle = {},
  ListHeaderComponent,
  ListHeaderComponentStyle = {},
  StickyElementComponent,
  ...props
}) => {
  // Hook returns scroll position, styles for sticky effect, and layout callbacks to measure header and sticky elements
  const [scrollY, styles, onLayoutHeaderElement, onLayoutStickyElement] =
    useStickyFlatList();

  return (
    <View style={customContainerStyle}>
      {/* Sticky header element that stays fixed at the top */}
      {StickyElementComponent && (
        <Animated.View
          style={styles.stickyElement}
          onLayout={onLayoutStickyElement}
        >
          {StickyElementComponent()}
        </Animated.View>
      )}

      {/* Main scrollable list */}
      <Animated.FlatList
        {...props}
        ListHeaderComponent={
          ListHeaderComponent && (
            <Animated.View onLayout={onLayoutHeaderElement}>
              {ListHeaderComponent()}
            </Animated.View>
          )
        }
        ListHeaderComponentStyle={[ListHeaderComponentStyle, styles.header]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          }
        )}
      />
    </View>
  );
};
