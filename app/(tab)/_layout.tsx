import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        contentStyle: { shadowColor: "transparent" },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="category/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="courseDetail/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="courseDetail/playlist/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="enroll/[id]"
        options={{
          title: "Enroll",
        }}
      />
      <Stack.Screen
        name="quiz/index"
        options={{
          title: "Quiz",
          headerShown: false,
          header: () => (
            <View className=" py-4 px-5 mt-10">
              <Text className="text-lg font-poppins-medium text-center">
                Quiz
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="quiz/take"
        options={{
          title: "Take Quiz",
          headerShown: true,
          header: () => (
            <View className=" py-4 px-5 mt-10">
              <Text className="text-lg font-poppins-medium text-center">
                Take Quiz
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({});
