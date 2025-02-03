import { View, Text } from "react-native";
import React from "react";
import HorizontalList from "@/components/Notifications/ListHorizontal";
import VerticalList from "@/components/Notifications/VerticalList";

const notification = () => {
  return (
    <View className="flex gap-10">
      <HorizontalList />
      <VerticalList />
    </View>
  );
};

export default notification;
