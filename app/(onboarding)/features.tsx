import { View, Text, Image } from 'react-native';
import { Link } from 'expo-router';

export default function Features() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Image 
          source={require('../../assets/images/react-logo.png')}
          className="w-60 h-60 mb-10"
          resizeMode="contain"
        />
        
        <Text className="text-3xl font-bold text-center mb-4">
          Learn Anywhere
        </Text>
        
        <Text className="text-gray-600 text-center text-lg mb-12">
          Access your courses anytime, anywhere. Learn at your own pace with our flexible learning platform.
        </Text>

        <Link 
          href="/(onboarding)/personalize" 
          className="bg-blue-600 w-[80%] py-4 rounded-xl flex justify-center items-center"
        >
          <View className="items-center w-full">
            <Text className="text-white font-semibold text-lg">Next</Text>
          </View>
        </Link>
      </View>
      
      <View className="flex-row justify-center items-center gap-2 mb-10">
        <View className="w-2 h-2 rounded-full bg-gray-300" />
        <View className="w-8 h-2 rounded-full bg-blue-600" />
        <View className="w-2 h-2 rounded-full bg-gray-300" />
      </View>
    </View>
  );
}