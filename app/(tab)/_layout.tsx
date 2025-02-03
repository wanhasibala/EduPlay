import { Stack, Tabs, usePathname } from "expo-router";
import TabBar from "@/components/Layout/TabBar";
import Header from "@/components/Layout/Header";

export default function RootLayout() {
  const pathname = usePathname(); // Get the current route pathname

  const hideTabBarRoutes = ["/courseDetail/"];

  const shouldHideTabBar = hideTabBarRoutes.some((route) =>
    pathname.startsWith(route),
  );
  return (
    <Tabs
      tabBar={(props) => (!shouldHideTabBar ? <TabBar {...props} /> : null)}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
          header: () => <Header title="Course" showBackButton={true} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          header: () => <Header title="Notification" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          header: () => <Header title="Profile" />,
        }}
      />
    </Tabs>
  );
}
