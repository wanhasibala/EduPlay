import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";

const CardProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Fetch user data from your data source here
    // For demonstration, we'll use static data
    const fetchUserData = async () => {
      // Simulate an API call
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      console.log(data);
      setUser(data.user);
    };

    fetchUserData();
  }, []);
  return (
    <View className="w-full bg-[#367A59]  rounded-[20px] ">
      <View className="flex flex-row justify-between items-center px-5 py-2">
        <Text className="text-white text-lg font-medium">History</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-white text">History</Text>
          <Ionicons name="chevron-forward" color={"white"} />
        </View>
      </View>

      <View className="bg-[#0A0A0A] rounded-[20px] flex items-center p-5 gap-3">
        <View className="rounded-full w-20 h-20 bg-gray-600 items-center "></View>
        <Text className="text-white text-2xl font-semibold">
          {user?.user_metadata?.name || "Guest"}
        </Text>
        <Text className="text-white"> {user?.email || ""}</Text>
        {/* <View className="flex flex-row justify-between items-center w-full bg-white py-2 px-4 rounded-full ">
          <Text>Tagihan</Text>
          <View className="flex flex-row items-center gap-2">
            <Text className="text-sm">Rp.1.500.000</Text>
            <Ionicons name="chevron-forward" />
          </View>
        </View> */}
      </View>
    </View>
  );
};

export default CardProfile;
