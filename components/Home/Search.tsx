import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Search = () => {
  return (
    <View className="flex w-full flex-row gap-5">
      <View className="border px-4 py-2 rounded-full border-blue-400 w-[85%]   flex-row  gap-5 ">
        <Ionicons name="search" size={24} />
        <TextInput placeholder="Search for course" />
      </View>
      <TouchableOpacity className="rounded-full  border-gray-400 items-center   justify-center">
        <Ionicons name="filter-circle-outline" size={40} />
      </TouchableOpacity>
    </View>
  );
};

export default Search;
