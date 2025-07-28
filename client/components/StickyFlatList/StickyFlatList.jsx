import { useStickyFlatList } from "./hooks/useStickyFlatList";
import { Animated, View } from "react-native";

export const StickyFlatList = ({
  customContainerStyle = {},
  ListHeaderComponent,
  ListHeaderComponentStyle = {},
  StickyElementComponent,
  ...props
}) => {
  const [scrollY, styles, onLayoutHeaderElement, onLayoutStickyElement] =
    useStickyFlatList();

  return (
    <View style={customContainerStyle}>
      {StickyElementComponent && (
        <Animated.View // <-- Sticky Component
          style={styles.stickyElement}
          onLayout={onLayoutStickyElement}
        >
          {StickyElementComponent()}
        </Animated.View>
      )}

      <Animated.FlatList
        {...props}
        ListHeaderComponent={
          // <-- Header Component
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
