import { View, Text, FlatList, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const NotificationData = [
  {
    id: 1,
    message:
      "Pengajuan pinjaman disetujui. Diharapkan anda membayar tepat pada waktu yang sudah ditentukan",
  },
  {
    id: 1,
    message:
      "Untuk proses penyetujuan pinjaman akan di proses 2-5 hari kerja untuk melanjutkan ke langkah selanjutnya.",
  },
];

const HorizontalList = () => {
  return (
    <View>
      <Text className="text-xl font-medium px-10">Highlight</Text>
      <ScrollView horizontal indicatorStyle="white" className="mt-4 pl-10 ">
        {NotificationData.map((item) => (
          <View className="w-80 border border-[#B7D3EA] p-2 mr-4 rounded-md flex h-fit flex-row gap-2 ">
            <View className="p-2 rounded-full bg-[#133D60] w-fit h-fit self-center">
              <Ionicons name="checkmark" color="#fff" size={24} />
            </View>
            <Text className="text-sm w-4/5">{item.message}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HorizontalList;
