import React, { useRef, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { COLORS } from "../constant/color";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");

interface SliderProps<T> {
  data: T[];
  renderItem?: ListRenderItem<T>;
  children?: React.ReactNode;
}

export function Slider<T>({ data, renderItem }: SliderProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
    }
  };

  const onViewableItemsChanged = React.useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeIndex ? COLORS.tertiary : "#D9D9D9",
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Navigation Arrows */}
      {activeIndex > 0 && (
        <Pressable
          style={[styles.navButton, styles.leftButton]}
          onPress={handlePrev}
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>
      )}
      {activeIndex < data.length - 1 && (
        <Pressable
          style={[styles.navButton, styles.rightButton]}
          onPress={handleNext}
        >
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      )}

      <FlatList<T>
        ref={flatListRef}
        data={data}
        renderItem={
          renderItem ||
          (({ item, index }) => <SliderItem item={item as any} index={index} />)
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Pagination Dots */}
      {renderDots()}
    </View>
  );
}

type SliderItemProps = {
  item: {
    video_thumbnail?: string;
    duration?: string;
    video_url?: string;
  };
  index: number;
};

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

export const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId
    ? `http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `http://img.youtube.com/vi/default/maxresdefault.jpg`;
};

const SliderItem = ({ item }: SliderItemProps) => {
  const thumbnailUrl = item.video_url
    ? getYouTubeThumbnail(item.video_url)
    : `http://img.youtube.com/vi/default/maxresdefault.jpg`;

  return (
    <Pressable style={styles.itemContainer}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.duration}>
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  itemContainer: {
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    width: width,
  },
  thumbnail: {
    width: 320,
    height: 171,
    borderRadius: 20,
    backgroundColor: "black",
  },
  duration: {
    backgroundColor: COLORS.tertiary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    bottom: 10,
    left: "15%",
    borderRadius: 99,
  },
  durationText: {
    color: "white",
    fontSize: 14,
  },
  navButton: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
