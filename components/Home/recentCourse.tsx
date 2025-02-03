import { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import courseData2 from "../../data/courseData";
import { COLORS } from "../constant/color";
import { Link } from "expo-router";

type Course = {
  course_id: number;
  course_title: string;
  category_id: number;
  course_description: string;
  course_image: string;
  price: number;
  created_date: string;
  course_duration: string;
  instructor_id: number;
};
type User = {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profile_image: string | null;
};

// Type for Category
type Category = {
  category_id: number;
  name: string;
};

export const RecentCourse = () => {
  const [course, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  useEffect(() => {
    //@ts-ignore
    setCourses(courseData2.courses);
    setCategory(courseData2.category);
    setUsers(courseData2.users);
  }, []);

  const getInstructorName = (instructorId: number) => {
    const instructor = users.find(
      (user: any) => user?.user_id === instructorId,
    );
    return instructor
      ? instructor
      : { name: "Uknown Instructor", profile_image: null };
  };
  return (
    <View className="flex gap-4 ">
      <FlatList
        data={category}
        renderItem={({ item }) => (
          <View className="mr-4  rounded-full px-2 py-1 border border-blue-300">
            <View>
              <Text>{item.name}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item: any) => item.category_id}
        horizontal
        // showsHorizontalScrollIndicator="false"
        snapToAlignment="start"
      />

      <ScrollView className="flex flex-row gap-5" horizontal>
        {course.map((item) => (
          <ProductCardView
            item={item.course_id.toString()}
            title={item.course_title}
            image={item.course_image}
            mentor={getInstructorName(item.instructor_id).name}
            mentorImage={getInstructorName(item.instructor_id).profile_image}
            duration={item.course_duration}
          />
        ))}
      </ScrollView>
    </View>
  );
};
const ProductCardView = ({
  title,
  image,
  mentor,
  duration,
  mentorImage,
  item,
}: {
  title?: string;
  image?: string;
  mentor?: string;
  duration?: string;
  mentorImage?: string | null;
  item: string | "";
}) => {
  return (
    <Link
      href={{ pathname: "/courseDetail/[id]", params: { id: item } }}
      className="mr-5 bg-white"
    >
      <View style={styles.item} className="mr-5">
        <Image
          source={{ uri: `${image}` }}
          resizeMode="cover"
          style={styles.imageCard}
        />
        <Text
          numberOfLines={2}
          style={{
            fontSize: 24,
            fontWeight: 600,
            width: 320,
          }}
        >
          {title}
        </Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Image
            source={{ uri: `${mentorImage}` }}
            style={styles.profilePicture}
          />
          <Text style={{ fontSize: 14 }}>{mentor}</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 99,
            backgroundColor: COLORS.primary,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ fontSize: 12 }}>{duration}</Text>
        </View>
      </View>
    </Link>
  );
};

export default ProductCardView;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "",
    padding: 12,
    marginRight: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: COLORS.gray,
    borderWidth: 0.25,
    // shadowColor: "#000000",
    // shadowOffset: { object: { width: 0.5, height: 0 } },
    // shadowOpacity: 0.25,
    marginBottom: 20,
    gap: 5,
  },
  imageCard: {
    width: 320,
    height: 150,
    borderRadius: 5,
  },
  profilePicture: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor: COLORS.primary,
  },
});
