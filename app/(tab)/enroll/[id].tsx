import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import courseData2 from "@/data/courseData";
import { Stack, useLocalSearchParams } from "expo-router";
import { courses, users, videos } from "@/data/courseData.json";
import Header from "@/components/Layout/Header";

const Enroll = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const course = courses.find(
    (course) => course.course_id == Number(params.id),
  );

  const video = videos.filter((item) => item.course_id === course?.course_id);

  const instructor = users.find(
    (user) => user.user_id === course?.instructor_id,
  );

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView className="">
        <View className="absolute z-[99] left-[20px] top-4 ">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View className="text-white">
              <Ionicons name="chevron-back" size={24} color={"#ffffff"} />
            </View>
          </TouchableOpacity>
        </View>
        {/* VideoPlayer */}
        <View className="aspect-video relative">
          {/* <Image
            source={{ uri: video.video_thumbnail }}
            className="aspect-video"
          /> */}
        </View>
        {/* Description */}
        <View className="gap-5 max-h-[100px] flex-1 flex-row p-5 items-center bg-white shadow-[0_10px_10px_40px_rgba(0,0,0,0.15)] ">
          <View className="h-10 w-10 rounded-full ">
            {/* <Image
              source={{ uri: instructor.profile_image }}
              className="h-full w-full rounded-full"
            /> */}
          </View>
          <View className="w-[70%] ">
            {/* <Text numberOfLines={1} className="text-[24px] font-medium">
              {video.video_title}
            </Text> */}

            {/* <Text style={{ fontSize: 12, fontWeight: "400" }}>
              {instructor.name}
            </Text> */}
          </View>
          {/* <Text className="self-center">{video.duration}</Text> */}
        </View>

        {/* Order */}

        <View className="mt-[20px] px-[20px] flex ">
          <Text className="text-[24px] font-medium">Up Next</Text>

          {/* Card Course */}

          <View className="gap-5 flex max-h-[80px] flex-row items-center w-full py-5 border-b border-b-gray-300  ">
            <View className="h-16 w-16 rounded-[5px] bg-black"></View>
            <View className="flex-1 justify-between flex-row items-center">
              <View className="gap-2">
                <Text numberOfLines={1} className="text-[24px] font-medium">
                  Course Title
                </Text>
                <Text style={{ fontSize: 18 }}>Mentor Name</Text>
              </View>
              {/* <Text className="text-lg">{video.duration} </Text> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Enroll;
