import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

const ContentPreview = ({
  title,
  duration,
  order,
  type,
  paid,
  id,
  lessons,
  quiz,
}: {
  title: string;
  id: string;
  duration?: string;
  order: number;
  type: string;
  paid: boolean;
  lessons?: any;
  quiz?: any;
}) => {
  const router = useRouter();
  return (
    // @ts-ignore
    <View>
      <View className="flex flex-row justify-between">
        <Text className="mb-2">{title}</Text>
        <Text className="mb-2">{duration} Minutes</Text>
      </View>
      <FlatList
        data={lessons}
        renderItem={({ item }) => {
          return (
            <Link href={`../courseDetail/playlist/${item.id}`} className="mb-2">
              <View className="w-full relative border flex flex-row items-center gap-3 border-gray-300 p-4 rounded-lg">
                <Text className="text-2xl font-poppins-medium">
                  {item.order}
                </Text>
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
          );
        }}
        contentContainerStyle={{ gap: 10, marginBottom: 10 }}
      />
      <Pressable
        onPress={() => {
          router.push({
            pathname: "../quiz",
            params: { quizId: quiz.id, moduleId: id },
          });
        }}
        className="mb-2"
      >
        <View className="w-full relative border flex flex-row items-center gap-3 border-gray-300 p-4 rounded-lg">
          <Text className="text-2xl font-poppins-medium">
            {lessons.length + 1}
          </Text>
          <View className="flex flex-col  ">
            <Text className="font-poppins-medium text-xl">{quiz.title}</Text>
            {/* <Text className="font-poppins">
              {quiz.type} {quiz.duration && `- ${quiz.duration}`}
            </Text> */}
          </View>
          <View className="absolute right-5 p-2 bg-[#2066A0] rounded-full">
            <Ionicons name="book" size={16} color="#FFB200" />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ContentPreview;
