import { View, Text, FlatList } from "react-native";
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
  lessons,
}: {
  title: string;
  id: string;
  duration?: string;
  order: number;
  type: string;
  paid: boolean;
  lessons?: any;
}) => {
  return (
    // @ts-ignore
    <View>
      <View className="flex flex-row justify-between">
        <Text className="mb-2">{title}</Text>
        <Text className="mb-2">{duration} Minutes</Text>
      </View>
      <FlatList
        data={lessons}
        renderItem={({ item }) => (
          <Link
            href={`(tab)/courseDetail/playlist/${item.id}`}
            className="mb-2"
          >
            <View className="w-full relative border flex flex-row items-center gap-3 border-gray-300 p-4 rounded-lg">
              <Text className="text-2xl font-poppins-medium">{item.order}</Text>
              <View className="flex flex-col  ">
                <Text className="font-poppins-medium text-xl">
                  {item.title}
                </Text>
                <Text className="font-poppins">
                  {item.type} {item.duration && `- ${item.duration}`}
                </Text>
              </View>
              {!paid && (
                <View className="absolute right-5 p-2 bg-[#2066A0] rounded-full">
                  <Ionicons name="play" color={"#FFB200"} size={16} />
                </View>
              )}
            </View>
          </Link>
        )}
        contentContainerStyle={{ gap: 10, marginBottom: 10 }}
      />
    </View>
  );
};

export default ContentPreview;
