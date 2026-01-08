import { Stack, Tabs, usePathname } from "expo-router";
import TabBar from "@/components/Layout/TabBar";
import Header from "@/components/Layout/Header";
import { useAuth } from "@/contexts/useAuth";

export default function RootLayout() {
  const pathname = usePathname(); // Get the current route pathname

  const hideTabBarRoutes = [
    "/courseDetail",
    "/courseDetail/playlist",
    "/enroll",
  ];

  const shouldHideTabBar = hideTabBarRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isSignIn = useAuth();
  console.log(isSignIn);
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
        name="search"
        options={{
          title: "Search",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: "Course",
          header: () => <Header title="Course" />,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          header: () => <Header title="Wishlist" />,
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
