import { View, Text } from "react-native";
import React from "react";

const HeaderProfile = () => {
  return (
    <View className="flex flex-row mt-4  justify-between items-center">
      <View className="flex-col gap-2">
        <Text className="">Welcome</Text>
        <Text className="text-4xl font-medium">Wan Hasib</Text>
      </View>
      <Text></Text>
    </View>
  );
};

export default HeaderProfile;
