import React from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  Pressable,
  Image,
  StyleSheet,
} from "react-native";
import { COLORS } from "../constant/color";

const { width } = Dimensions.get("screen");

type SliderProps = {
  data: {
    video_thumbnail: string;
    duration: string;
  }[];
};

export const Slider = ({ data }: SliderProps) => {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
    </View>
  );
};

type SliderItemProps = {
  item: {
    video_thumbnail: string;
    duration: string;
  };
  index: number;
};

const SliderItem = ({ item }: SliderItemProps) => {
  return (
    <Pressable style={styles.itemContainer}>
      <Image
        source={{ uri: item.video_thumbnail }}
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
  itemContainer: {
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    width: width, // Full width for each slider item
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
});
