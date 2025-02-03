import HeaderProfile from "@/components/Home/HeaderProfile";
import { ListCourse } from "@/components/Home/itemPopular";
import { RecentCourse } from "@/components/Home/recentCourse";
import Search from "@/components/Home/Search";
import { Text, View, SafeAreaView } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 mx-5 gap-10">
      <HeaderProfile />
      <Search />
      <RecentCourse />
      <ListCourse />
    </SafeAreaView>
  );
}
