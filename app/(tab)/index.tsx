import Banner from "@/components/Home/Banner";
import HeaderProfile from "@/components/Home/HeaderProfile";
import { ListCourse } from "@/components/Home/itemPopular";
import { RecentCourse } from "@/components/Home/recentCourse";
import Search from "@/components/Home/Search";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 mx-5 gap-5 mb-20">
          <HeaderProfile />
          {/* <Search /> */}
          {/* <Banner /> */}
          <RecentCourse />
          {/* <ListCourse /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
