import { View, Text, Button } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import UploadToFirebase from "../Home/UploadToFirebase";
import { collection, doc, setDoc } from "firebase/firestore";

const Settings = [
  {
    name: "Payment Method",
    iconName: "card",
  },
  {
    name: "Change Password",
    iconName: "finger-print-outline",
  },
  {
    name: "Get Help",
    iconName: "help-circle",
  },
  {
    name: "Log Out",
    iconName: "log-out",
    color: "#EE8375",
  },
];
const ProfileSettings = () => {
  const UploadToDatabase = async () => {
    // try {
    //   const response = await UploadToFirebase();
    // } catch (error) {
    //   console.error("Error uploading to Firebase:", error);
    // }
  };
  return (
    <View className="bg-white p-4 rounded-lg gap-4 ">
      {Settings.map((item) => (
        <View className="flex flex-row w-full items-center gap-2 relative">
          <Ionicons name={item.iconName} size={20} color={item.color} />
          <Text className={`w-4/5 text-lg  font-medium`}>{item.name}</Text>
          <Ionicons name="chevron-forward" className="absolute right-0" />
        </View>
      ))}
    </View>
  );
};

export default ProfileSettings;
