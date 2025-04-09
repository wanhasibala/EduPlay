export type User = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  created_at: string;
  profile_image?: string;
};

export type Category = {
  id_category: number;
  name: string;
  description: string;
};

export type Course = {
  id_course: number;
  title: string;
  description: string;
  instructor_id: number;
  category_id: number;
  price: number;
  created_at: string;
  course_image: string;
  duration: string;
  rating: number;
};

export type Enrollment = {
  id_enrollment: number;
  user_id: number;
  course_id: number;
  status: "active" | "completed" | "dropped";
  enrolled_at: string;
};

export type Lesson = {
  id_lesson: number;
  course_id: number;
  title: string;
  content: string;
  video_url: string;
  order: number;
  type: "Video" | "Article" | "Quiz";
  duration?: string;
  paid: boolean;
};

export type Quiz = {
  id_quiz: number;
  lesson_id: number;
  question: string;
  options: string[];
  correct_answer: string;
};

export type Certificate = {
  id_certificate: number;
  user_id: number;
  course_id: number;
  issued_at: string;
};

export type Discussion = {
  id_discussion: number;
  user_id: number;
  course_id: number;
  message: string;
  created_at: string;
};

// Main data structure type
export type DataType = {
  users: User[];
  categories: Category[];
  courses: Course[];
  enrollments: Enrollment[];
  lessons: Lesson[];
  quizzes: Quiz[];
  certificates: Certificate[];
  discussions: Discussion[];
};