import { View, Text, TouchableOpacity } from "react-native";
import Toast from 'react-native-toast-message';
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../auth/AuthProvider";

type IconName = "card" | "finger-print-outline" | "help-circle" | "log-out" | "chevron-forward";

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
  const { signOut } = useAuth();

  const handleItemPress = async (item: SettingItem) => {
    if (item.name === "Log Out") {
      try {
        await signOut();
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Successfully logged out'
        });
      } catch (error) {
        console.error('Error logging out:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to log out. Please try again.'
        });
      }
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg gap-4">
      {Settings.map((item) => (
        <TouchableOpacity
          key={item.name}
          className="flex flex-row w-full items-center gap-2 relative"
          onPress={() => handleItemPress(item)}
        >
          <Ionicons
            name={item.iconName as IconName}
            size={20}
            color={item.color || '#000'}
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
