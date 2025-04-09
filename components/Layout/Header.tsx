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
import { Link, useRouter } from "expo-router";

interface CustomHeaderProps {
  title: string;
  description?: string;
  href?: string;
}

const Header: React.FC<CustomHeaderProps> = ({ title, description, href }) => {
  const router = useRouter();
  return (
    <SafeAreaView className="-mb-5">
      <View style={styles.headerContainer}>
        {href && (
          <Link href={href || ".."} className="absolute left-10">
            <Ionicons name="chevron-back" size={20} />
          </Link>
        )}
        <View className="flex items-center gap-2">
          <Text className="font-poppins-semibold" style={styles.text}>
            {title}
          </Text>
          {description && (
            <Text className="text-blue-400 text-sm font-poppins">
              {description}
            </Text>
          )}
        </View>
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
