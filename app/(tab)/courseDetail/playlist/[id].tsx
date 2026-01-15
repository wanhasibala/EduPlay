import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import WebView from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { courses, users, lessons } from "@/data/data.json";
import Header from "@/components/Layout/Header";
import { getYouTubeThumbnail } from "@/components/CourseDetail/Slider";
import { COLORS } from "@/components/constant/color";
import { Lesson, DataType } from "@/types";
import { supabase } from "@/utils/supabase";

interface LessonItemProps {
  item: Lesson;
  isCurrentLesson?: boolean;
}

const getYouTubeVideoId = (url: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

const Playlist = () => {
  const params = useLocalSearchParams();
  const currentLessonId = Number(params.id);
  const [lessons, setLessons] = useState<any>(null);
  const [otherLessons, setOtherLessons] = useState<any>();
  const [instructor, setInstructor] = useState<any>(null);
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data, error } = await supabase
          .from("course_lessons")
          .select(
            "*, course_modules(*, internship_courses(*, user_profiles!mentor_id(*)))"
          )
          .eq("id", currentLessonId)
          .single();
        const { data: other, error: errorOther } = await supabase
          .from("course_lessons")
          .select("*")
          .neq("id", currentLessonId)
          .eq("module_id", data?.module_id)
          .order("id", { ascending: true });
        const instructor =
          data?.course_modules.internship_courses.user_profiles;
        setInstructor(instructor);
        if (error) {
          throw error;
        }
        setLessons(data);
        setOtherLessons(other);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };
    fetchLessons();
  }, [currentLessonId]);

  // Memoize lesson organization
  const { previousLesson, nextLesson, sortedPlaylist } = useMemo(() => {
    if (!otherLessons || otherLessons.length === 0) {
      return { previousLesson: null, nextLesson: null, sortedPlaylist: [] };
    }

    const allLessons = [lessons, ...otherLessons].filter(Boolean);
    const sortedLessons = allLessons.sort((a, b) => (a.id || 0) - (b.id || 0));

    const currentIndex = sortedLessons.findIndex(
      (lesson) => lesson.id === currentLessonId
    );

    return {
      previousLesson: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null,
      nextLesson:
        currentIndex !== -1 && currentIndex < sortedLessons.length - 1
          ? sortedLessons[currentIndex + 1]
          : null,
      sortedPlaylist: sortedLessons,
    };
  }, [lessons, otherLessons, currentLessonId]);

  const renderLessonItem = ({
    item,
    isCurrentLesson = false,
  }: LessonItemProps) => (
    <Link
      href={{
        pathname: "/courseDetail/playlist/[id]",
        params: { id: item.id_lesson },
      }}
      asChild
    >
      <TouchableOpacity className="gap-5 flex max-h-[80px] flex-row items-center w-full py-5 border-b border-b-gray-300">
        <View className="relative h-16 w-16 rounded-[5px] overflow-hidden">
          <Image
            source={{ uri: getYouTubeThumbnail(item.video_url) }}
            resizeMode="cover"
            className="h-full w-full"
          />
          {isCurrentLesson && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <Ionicons name="play-circle" size={24} color={COLORS.tertiary} />
            </View>
          )}
        </View>
        <View className="flex-1 justify-between flex-row items-center">
          <View className="gap-2 flex-1 mr-4">
            <Text
              numberOfLines={1}
              className={`text-lg font-poppins-medium ${
                isCurrentLesson ? "text-[#007AFF]" : ""
              }`}
            >
              {item.title}
            </Text>
            {item.duration && (
              <Text className="text-sm font-poppins text-gray-600">
                {item.duration}
              </Text>
            )}
          </View>
          {isCurrentLesson && (
            <Ionicons name="play-circle" size={24} color={COLORS.tertiary} />
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Header
        title={lessons?.title || ""}
        href={`/(tab)/courseDetail/${lessons?.course_modules?.internship_courses.id}`}
      />
      <ScrollView className="bg-white">
        {/* VideoPlayer */}
        <View className="aspect-video relative">
          {lessons?.video_url ? (
            <WebView
              source={{
                uri: `${lessons.video_url}`,
              }}
              className="aspect-video"
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              renderLoading={() => (
                <View className="absolute inset-0 items-center justify-center bg-black/20">
                  <Text className="text-white font-poppins-medium">
                    Loading...
                  </Text>
                </View>
              )}
            />
          ) : (
            <View className="aspect-video items-center justify-center bg-gray-200">
              <Text className="text-gray-600 font-poppins-medium">
                No video available
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View className="gap-5 flex-row p-5 items-center bg-white shadow-sm">
          {instructor?.profile_image && (
            <Image
              source={{ uri: instructor.profile_image }}
              className="h-10 w-10 rounded-full"
            />
          )}
          <View className="flex-1">
            <Text numberOfLines={1} className="text-xl font-poppins-medium">
              {lessons?.title}
            </Text>
            {instructor && (
              <Text className="text-sm font-poppins text-gray-600">
                {instructor.name}
              </Text>
            )}
          </View>
          {lessons?.duration && (
            <Text className="text-sm font-poppins text-gray-600">
              {lessons.duration}
            </Text>
          )}
        </View>

        {/* Playlist */}
        <View className="mt-5 px-5">
          {/* {previousLesson && (
            <>
              <Text className="text-base font-poppins-medium text-gray-600 mb-2">
                Previous
              </Text>
              {renderLessonItem({ item: previousLesson })}
            </>
          )} */}

          <Text className="text-base font-poppins-medium text-gray-600 mt-4 mb-2">
            Current
          </Text>
          {lessons &&
            renderLessonItem({ item: lessons, isCurrentLesson: true })}

          {nextLesson && (
            <>
              <Text className="text-base font-poppins-medium text-gray-600 mt-4 mb-2">
                Up Next
              </Text>
              {renderLessonItem({ item: nextLesson })}
            </>
          )}

          <Text className="text-base font-poppins-medium text-gray-600 mt-6 mb-2">
            All Lessons
          </Text>
          {sortedPlaylist
            .filter(
              (item) =>
                item.id !== currentLessonId &&
                item.id !== previousLesson?.id &&
                item.id !== nextLesson?.id
            )
            .map((item) => renderLessonItem({ item }))}
        </View>
      </ScrollView>
    </>
  );
};

export default Playlist;
