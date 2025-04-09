import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import data from "@/data/data.json";
import { COLORS } from "@/components/constant/color";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Course, User } from "@/types/index";

export const ListCourse = () => {
  const [course, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setCourses(data.courses);
    setUsers(data.users);
  }, []); // Add dependency array to prevent infinite re-render

  const getInstructorName = (instructorId: number): User => {
    const instructor = users.find((user) => user.id_user === instructorId);
    return (
      instructor || {
        id_user: 0,
        name: "Unknown Instructor",
        profile_image: null,
      }
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Text style={styles.title}> Popular</Text>
        <Text className="font-poppins"> Lihat semua</Text>
      </View>
      <FlatList
        data={course}
        renderItem={({ item }) => (
          <ItemPopular
            title={item.title}
            mentor={getInstructorName(item.instructor_id).name}
            duration={item.duration}
            image={item.course_image}
            mentorImage={getInstructorName(item.instructor_id).profile_image}
            id={item.id_course}
          />
        )}
        keyExtractor={(item) => item.id_course.toString()} // Ensure unique key as string
      />
    </View>
  );
};

const ItemPopular = ({
  title,
  image,
  mentor,
  duration,
  mentorImage,
  id,
}: {
  title: string;
  image: string;
  mentor: string;
  duration: string;
  mentorImage?: string;
  id: number;
}) => {
  return (
    <Link href={`/courseDetail/${id}`} className="mb-2">
      <View className="flex flex-row  items-center p-2 rounded-xl mb-2 w-full bg-white gap-4 relative">
        <Image
          source={{ uri: `${image}` }}
          className="h-full w-auto aspect-square rounded-md"
        />
        <View style={{ gap: 10 }} className="w-fit ">
          <Text
            numberOfLines={1}
            style={{ fontSize: 20, fontWeight: 500, maxWidth: 250 }}
            className="font-poppins-medium "
          >
            {title}
          </Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {mentorImage ? (
              <Image
                source={{ uri: `${mentorImage}` }}
                style={styles.profilePicture}
              />
            ) : (
              <View
                style={[
                  styles.profilePicture,
                  { backgroundColor: COLORS.secondary },
                ]}
              />
            )}
            <Text style={{ fontSize: 14 }} className="font-poppins">
              {mentor}
            </Text>
          </View>
          <Text style={{ fontSize: 14 }} className="font-poppins">
            {duration}{" "}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          className="absolute right-5"
        />
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  itemPopular: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E0E0E0",
  },

  profilePicture: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});
