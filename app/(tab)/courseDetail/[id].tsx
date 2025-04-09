import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import data from "@/data/data.json";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Layout/Header";
import { Slider } from "@/components/CourseDetail/Slider";
import ContentPreview from "@/components/CourseDetail/ContentPreview";
import { navigate } from "expo-router/build/global-state/routing";

const CourseDetail = () => {
  const navigate = useNavigation();
  const params = useLocalSearchParams();
  // const id = params.id ? Number(params.id) : null;

  const course = data.courses.find(
    (item) => item.id_course === Number(params.id)
  );
  const video = data.lessons.filter(
    (item) => item.course_id === course?.id_course
  );
  const slider = data.lessons.filter(
    (item) =>
      item.course_id === course?.id_course &&
      item.type === "Video" &&
      item.paid === false
  );
  const instructor = data.users.find(
    (item) => course?.instructor_id === item.id_user
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          //@ts-ignore
          header: () => (
            <Header title={"Course Detail"}  />
          ),
        }}
      />
      <ScrollView className="px-5 ">
        <View className="mb-32">
          <View>
            {/* @ts-ignore  */}
            <Slider data={slider} />
          </View>

          <View>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "600", marginVertical: 20 }}
                className="font-poppins-semibold"
              >
                {course?.title}
              </Text>
              <View className="flex flex-row justify-between ">
                <View className="flex flex-row place-items-center gap-2 mt-2">
                  <Image
                    source={{ uri: instructor?.profile_image }}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <Text style={{ fontSize: 16 }} className="font-poppins">
                    {instructor?.name}
                  </Text>
                </View>
                <View className="flex flex-row p-2 gap-2 bg-[#FFF0CC] rounded-md">
                  <Ionicons name="star" color="#FFB200" size={16} />
                  <Text
                    style={{ fontSize: 18, fontWeight: "600" }}
                    className="font-poppins-medium"
                  >
                    {course?.rating}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <View style={{ gap: 10 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "500" }}
                className="font-poppins-medium"
              >
                Description
              </Text>
              <Text style={{ fontSize: 14 }} className="font-poppins">
                {course?.description}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-medium my-5 font-poppins-medium">
                Preview
              </Text>
              <FlatList
                data={video}
                renderItem={({ item }) => (
                  <ContentPreview
                    id={item.id_lesson.toString()}
                    title={item.title}
                    order={item.order}
                    type={item.type}
                    duration={item.duration}
                    paid={item.paid}
                  />
                )}
                keyExtractor={(item) => item?.id_lesson.toString()}
                contentContainerStyle={{ gap: 10 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Link
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          paddingHorizontal: 20,
        }}
        href={`/enroll/${course?.id_course}`}
      >
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: 15,
            backgroundColor: "#277BC0",
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20 }}>Enroll Now</Text>
        </View>
      </Link>
    </SafeAreaView>
  );
};

export default CourseDetail;
