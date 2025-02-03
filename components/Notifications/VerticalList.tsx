import { View, Text, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const NotificationData = [
  {
    id: 1,
    message:
      "Hari ini adalah waktu untuk membayar cicilan bulanan. Jika tidak membayar cicilan lebih dari 10 hari maka peminjam akan dikenakan denda sebesar Rp20.000",
  },
  {
    id: 1,
    message:
      "Untuk proses penyetujuan pinjaman akan di proses 2-5 hari kerja untuk melanjutkan ke langkah selanjutnya.",
  },
];

const VerticalList = () => {
  return (
    <ScrollView className="flex px-10">
      <Text className="text-xl font-medium px-10">Today</Text>
      {NotificationData.map((item) => (
        <View className="border-b border-[#B7D3EA] px-2 py-4 mr-4 rounded-md flex h-fit flex-row gap-2 ">
          <View className="p-2 rounded-full bg-[#133D60] w-fit h-fit self-center">
            <Ionicons name="checkmark" color="#fff" size={24} />
          </View>
          <Text className="text-sm w-4/5">{item.message}</Text>
        </View>
      ))}
      <Text className="text-xl font-medium px-10 mt-5">Last Week</Text>
      {NotificationData.map((item) => (
        <View className="border-b border-[#B7D3EA] px-2 py-4 mr-4 rounded-md flex h-fit flex-row gap-2 ">
          <View className="p-2 rounded-full bg-[#133D60] w-fit h-fit self-center">
            <Ionicons name="checkmark" color="#fff" size={24} />
          </View>
          <Text className="text-sm w-4/5">{item.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default VerticalList;
