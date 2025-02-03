import { View, Text } from "react-native";
import React from "react";
import CardProfile from "@/components/Profile/Card";
import ProfileSettings from "@/components/Profile/Settings";

const profile = () => {
  return (
    <View className="px-10 flex gap-5">
      <CardProfile />
      <ProfileSettings />
    </View>
  );
};

export default profile;
