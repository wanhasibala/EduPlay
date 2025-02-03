import { View, Text } from "react-native";
import React from "react";
import { ListCourse } from "@/components/Course/ListCourse";

const Course = () => {
  return (
    <View className="mx-10  flex-1">
      <ListCourse />
    </View>
  );
};

export default Course;
