import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constant/color";
import { Link } from "expo-router";

interface TabBarProps {
  state: any;
  descriptors: any;
}
interface IconProps {
  [key: string]: (props: { color: string; size: number }) => JSX.Element;
}

const TabBar = ({ state, descriptors }: TabBarProps) => {
  const icons: IconProps = {
    index: (props) => (
      <Ionicons name={state.index === 0 ? "home" : "home-outline"} {...props} />
    ),
    search: (props) => (
      <Ionicons
        name={state.index === 1 ? "search" : "search-outline"}
        {...props}
      />
    ),
    course: (props) => (
      <Ionicons
        name={state.index === 2 ? "play-circle" : "play-circle-outline"}
        {...props}
      />
    ),
    wishlist: (props) => (
      <Ionicons
        name={state.index === 3 ? "heart" : "heart-outline"}
        {...props}
      />
    ),
    profile: (props) => (
      <Ionicons
        name={state.index === 4 ? "person-circle" : "person-circle-outline"}
        {...props}
      />
    ),
  };
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];

        if (
          [
            "_sitemap",
            "+not-found",
            "courseDetail/[id]",
            "courseDetail/playlist/[id]",
            "enroll/[id]",
            "category/[id]",
          ].includes(route.name)
        )
          return null;

        const href = route.name === "index" ? "/" : `/(tab)/${route.name}`;
        const isFocused = state.index === index;

        return (
          <Link key={route.name} href={href} asChild style={styles.tabbarItem}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
            >
              {icons[route.name] ? (
                icons[route.name]({
                  color: isFocused ? COLORS.tertiary : COLORS.gray2,
                  size: 26,
                })
              ) : (
                <Text style={{ color: COLORS.gray2 }}>?</Text>
              )}
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 99,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TabBar;
