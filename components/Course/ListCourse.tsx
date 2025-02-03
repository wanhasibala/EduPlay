import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import courseData2 from "@/data/courseData";
import { COLORS } from "@/components/constant/color";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Course = {
  course_id: number;
  course_title: string;
  course_image: string;
  course_duration: string;
  instructor_id: number;
};

type User = {
  user_id: number;
  name: string;
  profile_image: string | null;
};

export const ListCourse = () => {
  const [course, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    //@ts-ignore
    setCourses(courseData2.courses);
    setUsers(courseData2.users);
  }, []); // Add dependency array to prevent infinite re-render

  const getInstructorName = (instructorId: number): User => {
    const instructor = users.find((user) => user.user_id === instructorId);
    return (
      instructor || {
        user_id: 0,
        name: "Unknown Instructor",
        profile_image: null,
      }
    );
  };

  return (
    <View>
      <FlatList
        data={course}
        renderItem={({ item }) => (
          <View>
            <Text>{item.progress}</Text>
            <ItemPopular
              title={item.course_title}
              mentor={getInstructorName(item.instructor_id).name}
              duration={item.course_duration}
              image={item.course_image}
              mentorImage={getInstructorName(item.instructor_id).profile_image}
              id={item.course_id}
            />
          </View>
        )}
        keyExtractor={(item) => item.course_id.toString()} // Ensure unique key as string
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
  mentorImage: string | null;
  id: number;
}) => {
  return (
    <Link href={`/courseDetail/${id}`} className="mb-2">
      <View className="flex flex-row border-2 items-center border-gray-300 p-2 rounded-xl mb-2 w-full gap-4">
        <Image
          source={{ uri: `${image}` }}
          className="h-full w-auto aspect-square rounded-md"
        />
        <View style={{ gap: 10 }} className="">
          <Text
            numberOfLines={1}
            style={{ fontSize: 20, fontWeight: 500, width: 250 }}
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
            <Text style={{ fontSize: 14 }}>{mentor}</Text>
          </View>
          <Text style={{ fontSize: 14 }}>{duration} </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} />
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
    fontWeight: "600",
  },
});
