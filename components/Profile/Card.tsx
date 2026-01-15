import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";

const CardProfile = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    // Fetch user data from your data source here
    // For demonstration, we'll use static data
    const fetchUserData = async () => {
      // Simulate an API call
      const { data, error } = await supabase.auth.getUser();
      const { data: userProfile, error: userError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", data?.user.id)
        .single();
      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }
      console.log(userProfile);
      setUser(userProfile);
    };

    fetchUserData();
  }, []);
  return (
    <View className="w-full bg-[#367A59]  rounded-[20px] ">
      <View className="flex flex-row justify-between items-center px-5 py-2">
        <Text className="text-white text-lg font-medium">Enrollment</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-white text">History</Text>
          <Ionicons name="chevron-forward" color={"white"} />
        </View>
      </View>

      <View className="bg-[#0A0A0A] rounded-[20px] flex items-center p-5 gap-3">
        <Image
          source={{ uri: user?.profile_image }}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <Text className="text-white text-2xl font-semibold">
          {user?.name || "Guest"}
        </Text>
        <Text className="text-white"> {user?.phone || ""}</Text>
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
