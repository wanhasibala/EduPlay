import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import courseData from "../../../data/data.json";
import { Link } from "expo-router";

interface Course {
  id_course: number;
  title: string;
  description: string;
  course_image: string;
  rating: number;
  duration: string;
  price: number;
}

interface Category {
  id_category: number;
  name: string;
  description: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);

    if (text.trim() === "") {
      setFilteredCourses([]);
      return;
    }

    const searchResults = courseData.courses.filter((course) => {
      const searchTermLower = text.toLowerCase();
      return (
        course.title.toLowerCase().includes(searchTermLower) ||
        course.description.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredCourses(searchResults);
  }, []);

  const renderCourseItem = ({ item }: { item: Course }) => (
    <Pressable className="flex-row items-center p-4 border-b border-gray-200">
      <Image
        source={{ uri: item.course_image }}
        className="w-20 h-20 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold mb-1">{item.title}</Text>
        <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text className="ml-1 text-sm">{item.rating}</Text>
          <Text className="ml-4 text-sm text-gray-600">{item.duration}</Text>
          <Text className="ml-auto text-sm font-semibold">
            ${(item.price / 1000).toFixed(3)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <Link
      className="p-4 bg-white rounded-xl shadow-sm m-2 flex-1"
      href={`/(tab)/category/${item.id_category}`}
    >
      <View className="items-center justify-center">
        <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-3">
          <Ionicons
            name={
              item.name === "Design"
                ? "color-palette"
                : item.name === "Development"
                ? "code-slash"
                : "megaphone"
            }
            size={24}
            color="#666"
          />
        </View>
        <Text className="text-lg font-semibold mb-1">{item.name}</Text>
        <Text className="text-gray-600 text-sm text-center" numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </Link>
  );

  const renderCategories = () => (
    <View className="flex-1">
      <Text className="text-xl font-semibold mx-5 mb-4">Categories</Text>
      <FlatList
        data={courseData.categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id_category.toString()}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 10 }}
        className="flex-1"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="mx-5 my-4">
        <View className="border border-gray-300 flex-row items-center px-4 py-2 rounded-lg bg-white">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search courses..."
            value={searchTerm}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          )}
        </View>
      </View>

      {searchTerm === "" ? (
        renderCategories()
      ) : filteredCourses.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="search-outline" size={48} color="#ccc" />
          <Text className="mt-4 text-gray-500 text-lg">
            No courses found for "{searchTerm}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id_course.toString()}
          className="flex-1"
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
