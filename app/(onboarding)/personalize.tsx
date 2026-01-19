import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HAS_SEEN_ONBOARDING = "hasSeenOnboarding";

export default function Personalize() {
  const handleGetStarted = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem(HAS_SEEN_ONBOARDING, "true");
      // Navigate to the auth flow
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
      // Navigate anyway even if saving fails
      router.push("/(auth)/login");
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require("../../assets/images/Banner.png")}
          className="w-60 h-60 mb-10"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-center mb-4">
          Personalized Learning
        </Text>

        <Text className="text-gray-600 text-center text-lg mb-12">
          Get customized course recommendations based on your interests and
          learning goals
        </Text>

        <View
          className="bg-blue-600 w-[80%] py-4 rounded-xl"
          onTouchEnd={handleGetStarted}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Get Started
          </Text>
        </View>
      </View>

      <View className="flex-row justify-center items-center gap-2 mb-10">
        <View className="w-2 h-2 rounded-full bg-gray-300" />
        <View className="w-2 h-2 rounded-full bg-gray-300" />
        <View className="w-8 h-2 rounded-full bg-blue-600" />
      </View>
    </View>
  );
}
