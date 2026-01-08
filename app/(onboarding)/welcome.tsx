import { View, Text, Image, Dimensions } from "react-native";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

export default function Welcome() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image
          source={require("../../assets/images/logo-text.svg")}
          className="w-60 h-60 mb-10"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-center mb-4">
          Welcome to Course App
        </Text>

        <Text className="text-gray-600 text-center text-lg mb-12">
          Discover thousands of courses and learn from the best educators
        </Text>

        <Link
          href="/(onboarding)/features"
          className="bg-blue-600 w-[80%] py-4 rounded-xl flex flex-row items-center justify-center "
        >
          <Text className="text-white text-center font-poppins font-semibold text-lg">
            Next
          </Text>
        </Link>
      </View>

      <View className="flex-row justify-center items-center gap-2 mb-10">
        <View className="w-8 h-2 rounded-full bg-blue-600" />
        <View className="w-2 h-2 rounded-full bg-gray-300" />
        <View className="w-2 h-2 rounded-full bg-gray-300" />
      </View>
    </View>
  );
}
