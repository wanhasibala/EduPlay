import { View, Text, TouchableOpacity } from "react-native";
import { useToast } from "expo-toast";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthContext } from "../../contexts/AuthContext";

type IconName =
  | "card"
  | "finger-print-outline"
  | "help-circle"
  | "log-out"
  | "chevron-forward";

interface SettingItem {
  name: string;
  iconName: IconName;
  color?: string;
  onPress?: () => void;
}

const Settings: SettingItem[] = [
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
  const Toast = useToast();
  const router = useRouter();
  const { logout } = useAuthContext();

  const handleItemPress = async (item: SettingItem) => {
    if (item.name === "Log Out") {
      try {
        await logout();
        Toast.show("Successfully logged out");
        router.replace({
          pathname: "/(auth)/login",
        });
        // Protected routes will automatically redirect to login
      } catch (error) {
        console.error("Error logging out:", error);
        Toast.show("Failed to log out. Please try again");
      }
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg gap-4">
      {Settings.map((item) => (
        <TouchableOpacity
          key={item.name}
          className="flex flex-row w-full items-center gap-4 relative p-2"
          onPress={() => handleItemPress(item)}
        >
          <Ionicons
            name={item.iconName as IconName}
            size={24}
            color={item.color || "#000"}
          />
          <Text className={`w-4/5 text-lg  font-medium`}>{item.name}</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            className="absolute right-0"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProfileSettings;
