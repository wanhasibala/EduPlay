import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuthContext } from "../../contexts/AuthContext";
import { supabase } from "../utils/supabase";

const HeaderProfile = () => {
  const [user, setUser] = React.useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  return (
    <View className="flex flex-row mt-4 justify-between items-center">
      <View className="flex-col gap-2">
        <Text className="font-poppins">Welcome</Text>
        <Text className="text-4xl font-poppins-medium">
          {user?.user_metadata?.name || "Guest"}
        </Text>
      </View>
      <Link href={user ? "/(tab)/profile" : "/(auth)/login"}>
        <View className="relative">
          <Ionicons name="notifications" size={24} />
          <View className="absolute bg-red-500 rounded-full w-4 h-4 flex items-center justify-center -top-1 -right-1">
            <Text className=" text-sm  text-white ">2</Text>
          </View>
        </View>
      </Link>
    </View>
  );
};

export default HeaderProfile;
