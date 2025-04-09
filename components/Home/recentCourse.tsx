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
import data from "@/data/data.json";
import { COLORS } from "../constant/color";
import { Link } from "expo-router";
import { Slider } from "../CourseDetail/Slider";
import { Ionicons } from "@expo/vector-icons";

export type Course = {
  id_course: number;
  title: string;
  category_id: number;
  course_description: string;
  course_image: string;
  price: number;
  created_date: string;
  course_duration: string;
  instructor_id: number;
  duration: string;
  rating: number;
};

export type User = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  role: string;
  profile_image: string | null;
};

export type Category = {
  id_category: number;
  name: string;
};

export type DataType = {
  users: User[];
  categories: Category[];
  courses: Course[];
};

export const RecentCourse = () => {
  const [course, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0); // 0 is for "All"

  useEffect(() => {
    const typedData = data as unknown as DataType;
    const allCourses = typedData.courses;
    setCourses(allCourses);
    setFilteredCourses(allCourses);
    const allCategories = [
      { id_category: 0, name: "All" },
      ...typedData.categories,
    ];
    setCategory(allCategories);
    setUsers(typedData.users);
  }, []);

  const getInstructorName = (instructorId: number) => {
    const instructor = users.find((user) => user.id_user === instructorId);
    return instructor
      ? instructor
      : { name: "Uknown Instructor", profile_image: null };
  };
  return (
    <View className="flex gap-4 ">
      <FlatList
        data={category}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setActiveCategory(item.id_category);
              if (item.id_category === 0) {
                setFilteredCourses(course);
              } else {
                const filtered = course.filter(
                  (c) => c.category_id === item.id_category
                );
                setFilteredCourses(filtered);
              }
            }}
            className={`mr-2 rounded-full px-4 py-1 flex items-center justify-center ${
              activeCategory === item.id_category
                ? "bg-[#FFB200] "
                : " border border-blue-300"
            }`}
          >
            <Text className="font-poppins">{item.name}</Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.id_category.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
      />
      {filteredCourses.length === 0 ? (
        <View className="w-[100%] flex-1  items-center justify-center">
          <Text
            style={{
              fontSize: 20,
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Poppins_500Medium",
            }}
          >
            No Course Found
          </Text>
        </View>
      ) : (
        <Slider<Course>
          data={filteredCourses}
          renderItem={({ item }) => (
            <ProductCardView
              item={item.id_course.toString()}
              title={item.title}
              image={item.course_image}
              mentor={getInstructorName(item.instructor_id).name}
              mentorImage={getInstructorName(item.instructor_id).profile_image}
              duration={item.duration}
              key={item.id_course.toString()}
              price={`Rp. ${item.price}`}
              rating={item.rating.toString()}
            />
          )}
        />
      )}
    </View>
  );
};
const ProductCardView = ({
  title,
  image,
  mentor,
  duration,
  mentorImage,
  price,
  item,
  rating,
}: {
  title?: string;
  image?: string;
  mentor?: string;
  duration?: string;
  mentorImage?: string | null;
  price?: string;
  rating?: string;
  item: string | "";
}) => {
  const lesson = data.lessons.filter(
    (lesson) => lesson.course_id === Number(item)
  );
  const totalLesson =
    lesson.length === 0
      ? `No lesson`
      : lesson.length > 1
      ? `${lesson.length} Lessons`
      : "1 Lesson";
  return (
    <Link
      href={{ pathname: "/courseDetail/[id]", params: { id: item } }}
      className="mr-5 "
    >
      <View
        style={styles.item}
        className="mr-5 rounded-sm bg-[#FCFCFC] h-fit  "
      >
        <Image
          source={{ uri: `${image}` }}
          resizeMode="cover"
          style={styles.imageCard}
          className=""
        />
        <View className="relative ">
          <View style={{ gap: 4, width: "100%" }} className="">
            {/* Title */}
            <Text
              numberOfLines={2}
              style={{
                fontSize: 24,
                fontWeight: 600,
                maxWidth: 320,
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              {title}
            </Text>
            {/* Mentor */}
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <Image
                source={{ uri: `${mentorImage}` }}
                style={styles.profilePicture}
              />
              <Text style={{ fontSize: 14, fontFamily: "Poppins_400Regular" }}>
                {mentor}
              </Text>
            </View>
            {/* Duration and Price */}
            <View
              style={{
                borderRadius: 99,
                paddingHorizontal: 4,
                alignSelf: "flex-start",
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: "Poppins_400Regular" }}>
                {duration} • {totalLesson}
              </Text>
            </View>
            <Text className="text-xl font-poppins-medium"> {price}</Text>
          </View>
          <View className="absolute right-0 bottom-0">
            <View className="flex  flex-row items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
              <Ionicons name="star" color={"#FFB200"} />
              <Text>{rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </Link>
  );
};

export default ProductCardView;

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginRight: 20,
    marginVertical: 8,
    borderRadius: 10,
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
  },
});
