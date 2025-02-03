import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import courseData2 from "@/data/courseData";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Layout/Header";
import { Slider } from "@/components/CourseDetail/Slider";

const CourseDetail = () => {
  const params = useLocalSearchParams();
  // const id = params.id ? Number(params.id) : null;

  const course = courseData2.courses.find(
    (item) => item.course_id === Number(params.id),
  );
  const video = courseData2.videos.filter(
    (item) => item.course_id === course?.course_id,
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          //@ts-ignore
          header: () => (
            <Header title={course?.course_title} showBackButton={true} />
          ),
        }}
      />
      <View className="px-5">
        <View>
          <View>
            {/* @ts-ignore  */}
            <Slider data={video} />
          </View>

          <View>
            <View>
              <Text style={{ fontSize: 24, fontWeight: "600" }}>
                {course?.course_title}
              </Text>
              <View>
                <View>
                  <Image
                    // source={{ uri: instructor.profile_image }}
                    width={16}
                    height={16}
                  />
                </View>
                {/* <Text style={{ fontSize: 16 }}>{instructor.name}</Text> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                backgroundColor: "#ffefcc",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="star" color="#FFB200" size={20} />
              <Text style={{ fontSize: 18, fontWeight: "600" }}>4.6</Text>
            </View>
          </View>
          <View>
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "500" }}>
                Description
              </Text>
              <Text style={{ fontSize: 14 }}>{course?.course_description}</Text>
            </View>
            <View>
              {/* <FlatList */}
              {/*   data={video} */}
              {/*   renderItem={({ item }) => ( */}
              {/*     <ContentPreview */}
              {/*       title={item.video_title} */}
              {/*       duration={item.duration} */}
              {/*       video={video} */}
              {/*     /> */}
              {/*   )} */}
              {/*   keyExtractor={(item) => item.id} */}
              {/*   contentContainerStyle={{ gap: 10 }} */}
              {/* /> */}
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          paddingHorizontal: 20,
        }}
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
      </View>
    </SafeAreaView>
  );
};

export default CourseDetail;
