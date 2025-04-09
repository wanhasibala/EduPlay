import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import WebView from 'react-native-webview';
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { courses, users, lessons } from "@/data/data.json";
import Header from "@/components/Layout/Header";
import { getYouTubeThumbnail } from "@/components/CourseDetail/Slider";
import { COLORS } from "@/components/constant/color";
import { Lesson, DataType } from "@/types";

interface LessonItemProps {
  item: Lesson;
  isCurrentLesson?: boolean;
}

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url?.match(regex);
  return match ? match[1] : null;
};

const Playlist = () => {
  const params = useLocalSearchParams();
  const currentLessonId = Number(params.id);

  // Type assert the data from json
  const typedLessons = lessons as DataType['lessons'];
  const typedCourses = courses as DataType['courses'];
  const typedUsers = users as DataType['users'];

  const lesson = typedLessons.find((item) => item.id_lesson === currentLessonId);
  const course = typedCourses.find(
    (course) => course.id_course === lesson?.course_id
  );
  const instructor = typedUsers.find((item) => item.id_user === course?.instructor_id);

  const { sortedPlaylist, currentIndex } = useMemo(() => {
    const playlist = typedLessons
      .filter((item) => item.course_id === lesson?.course_id)
      .sort((a, b) => a.order - b.order);
    const index = playlist.findIndex((item) => item.id_lesson === currentLessonId);
    return { sortedPlaylist: playlist, currentIndex: index };
  }, [lesson?.course_id, currentLessonId]);

  const previousLesson = currentIndex > 0 ? sortedPlaylist[currentIndex - 1] : null;
  const nextLesson = currentIndex < sortedPlaylist.length - 1 ? sortedPlaylist[currentIndex + 1] : null;

  const thumbnailUrl = lesson?.video_url
    ? getYouTubeThumbnail(lesson.video_url)
    : `http://img.youtube.com/vi/default/maxresdefault.jpg`;

  const renderLessonItem = ({ item, isCurrentLesson = false }: LessonItemProps) => (
    <Link
      href={{
        pathname: "/courseDetail/playlist/[id]",
        params: { id: item.id_lesson }
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
              className={`text-lg font-poppins-medium ${isCurrentLesson ? 'text-[#007AFF]' : ''}`}
            >
              {item.title}
            </Text>
            {item.duration && (
              <Text className="text-sm font-poppins text-gray-600">{item.duration}</Text>
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
        title={lesson?.title || ""}
        href={`/(tab)/courseDetail/${lesson?.course_id}`}
      />
      <ScrollView className="bg-white">
        {/* VideoPlayer */}
        <View className="aspect-video relative">
          {lesson?.video_url ? (
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${getYouTubeVideoId(lesson?.video_url)}?playsinline=1&autoplay=0`,
              }}
              className="aspect-video"
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              renderLoading={() => (
                <View className="absolute inset-0 items-center justify-center bg-black/20">
                  <Text className="text-white font-poppins-medium">Loading...</Text>
                </View>
              )}
            />
          ) : (
            <View className="aspect-video items-center justify-center bg-gray-200">
              <Text className="text-gray-600 font-poppins-medium">No video available</Text>
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
              {lesson?.title}
            </Text>
            {instructor && (
              <Text className="text-sm font-poppins text-gray-600">{instructor.name}</Text>
            )}
          </View>
          {lesson?.duration && (
            <Text className="text-sm font-poppins text-gray-600">{lesson.duration}</Text>
          )}
        </View>

        {/* Playlist */}
        <View className="mt-5 px-5">
          {previousLesson && (
            <>
              <Text className="text-base font-poppins-medium text-gray-600 mb-2">Previous</Text>
              {renderLessonItem({ item: previousLesson })}
            </>
          )}

          <Text className="text-base font-poppins-medium text-gray-600 mt-4 mb-2">Current</Text>
          {lesson && renderLessonItem({ item: lesson, isCurrentLesson: true })}

          {nextLesson && (
            <>
              <Text className="text-base font-poppins-medium text-gray-600 mt-4 mb-2">Up Next</Text>
              {renderLessonItem({ item: nextLesson })}
            </>
          )}

          <Text className="text-base font-poppins-medium text-gray-600 mt-6 mb-2">All Lessons</Text>
          {sortedPlaylist
            .filter(item => 
              item.id_lesson !== currentLessonId && 
              item.id_lesson !== previousLesson?.id_lesson && 
              item.id_lesson !== nextLesson?.id_lesson
            )
            .map(item => renderLessonItem({ item }))}
        </View>
      </ScrollView>
    </>
  );
};

export default Playlist;
