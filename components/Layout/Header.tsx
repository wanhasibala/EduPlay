import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<CustomHeaderProps> = ({ title, showBackButton }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="-mb-5">
      <View style={styles.headerContainer}>
        {showBackButton && (
          <Pressable onPress={() => router.back()} className="absolute left-10">
            <Ionicons name="chevron-back" size={20} />
          </Pressable>
        )}
        <View className="flex items-center gap-2">
          <Text style={styles.text}>{title}</Text>
          {showBackButton && (
            <Text className="text-blue-400 text-sm">1 Course</Text>
          )}
        </View>
        {showBackButton && (
          <Pressable
            onPress={() => router.back()}
            className="absolute right-10"
          >
            <Ionicons name="search" size={20} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  backButton: {
    marginRight: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
  },
});

export default Header;
