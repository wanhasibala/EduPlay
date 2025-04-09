import { View, Text } from "react-native";
import { Image } from "expo-image";
import React from "react";

const Banner = () => {
  return (
    <View className="">
      <Image
        source={require("../../assets/images/Banner.png")}
        contentFit="cover"
        style={{ width: "100%", height:138 }}
      />
    </View>
  );
};

export default Banner;
