import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const HeaderProfile = () => {
  return (
    <View className="flex flex-row mt-4 justify-between items-center">
      <View className="flex-col gap-2">
        <Text className="font-poppins">Welcome</Text>
        <Text className="text-4xl font-poppins-medium">Wan Hasib</Text>
      </View>
      <Link href={""}>
        <View className="relative">
          <Ionicons name="notifications" size={24} />
          <View className="absolute bg-red-500 rounded-full w-4 h-4 flex items-center justify-center -top-1 -right-1">
            <Text className=" text-sm  text-white ">2</Text>
          </View>
        </View>
      </Link>
    </View>
  );
};

export default HeaderProfile;
