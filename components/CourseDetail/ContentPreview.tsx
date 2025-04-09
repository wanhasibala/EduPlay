import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const ContentPreview = ({
  title,
  duration,
  order,
  type,
  paid,
  id,
}: {
  title: string;
  id: string;
  duration?: string;
  order: number;
  type: string;
  paid: boolean;
}) => {
  return (
    // @ts-ignore
    <Link href={`(tab)/courseDetail/playlist/${id}`}>
      <View className="w-full relative border flex flex-row items-center gap-3 border-gray-300 p-4 rounded-lg">
        <Text className="text-2xl font-poppins-medium">{order}</Text>
        <View className="flex flex-col  ">
          <Text className="font-poppins-medium text-xl">{title}</Text>
          <Text className="font-poppins">
            {type} {duration && `- ${duration}`}
          </Text>
        </View>
        {!paid && (
          <View className="absolute right-5 p-2 bg-[#2066A0] rounded-full">
            <Ionicons name="play" color={"#FFB200"} size={16} />
          </View>
        )}
      </View>
    </Link>
  );
};

export default ContentPreview;
