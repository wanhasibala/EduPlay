import { View, Text, SafeAreaView, ScrollView, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Layout/Header";
import { CourseSummary, fetchCourseById } from "@/services/supabaseApi";
import { supabase } from "@/utils/supabase";
import ContentPreview from "@/components/CourseDetail/ContentPreview";

const CourseDetail = () => {
  const params = useLocalSearchParams();
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const courseId = Array.isArray(params.id)
    ? Number(params.id[0])
    : params.id
    ? Number(params.id)
    : null;

  useEffect(() => {
    let isMounted = true;

    if (!courseId) {
      setError("Course not found");
      return undefined;
    }

    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await supabase
          .from("internship_courses")
          .select(
            `
    *,
    user_profiles!mentor_id(*),
    course_modules(*, course_lessons(*))
  `
          )
          .eq("id", courseId)
          .single();
        console.log(result.data);
        if (isMounted) {
          setCourse(result.data || null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message ?? "Failed to load course");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            //@ts-ignore
            header: () => <Header title={"Course Detail"} href=".." />,
          }}
        />
        <View className="flex-1 items-center justify-center">
          <Text>Loading course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !course) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            //@ts-ignore
            header: () => <Header title={"Course Detail"} href=".." />,
          }}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center">{error ?? "Course not found"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          //@ts-ignore
          header: () => <Header title={"Course Detail"} href=".." />,
        }}
      />
      <ScrollView className="px-5 ">
        <View className="mb-32">
          <View>
            {/* @ts-ignore  */}
            {/* <Slider data={slider} /> */}
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
                  {/* <Image
                    source={{ uri: instructor?.profile_image }}
                    width={20}
                    height={20}
                    className="rounded-full"
                  /> */}
                  <Text style={{ fontSize: 16 }} className="font-poppins">
                    {course?.mon}
                  </Text>
                </View>
                <View className="flex flex-row p-2 gap-2 bg-[#FFF0CC] rounded-md">
                  <Ionicons name="star" color="#FFB200" size={16} />
                  <Text
                    style={{ fontSize: 18, fontWeight: "600" }}
                    className="font-poppins-medium"
                  >
                    {course?.rating ?? 0}
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
                data={course?.course_modules}
                renderItem={({ item }) => (
                  <ContentPreview
                    id={item.id.toString()}
                    title={item.title}
                    order={item.order}
                    type={item.type}
                    duration={item.duration}
                    paid={item.paid}
                    lessons={item.course_lessons}
                  />
                )}
                keyExtractor={(item) => item?.id.toString()}
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
        href={`/enroll/${course?.id}`}
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
