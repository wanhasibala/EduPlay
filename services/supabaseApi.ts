import { supabase } from "@/components/utils/supabase";

export interface AuthPayload {
  token: string;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

export interface CourseSummary {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  image?: string;
  rating?: number;
  mentorName?: string;
  mentorImage?: string;
}

const mapCourseRecord = (record: any): CourseSummary => ({
  id: Number(
    record?.id ?? record?.id_course ?? record?.course_id ?? record?.id_data ?? 0
  ),
  title: record?.title ?? "Untitled course",
  description: record?.description ?? "",
  duration: record?.duration ?? record?.length ?? "",
  image: record?.course_image ?? record?.image_url ?? record?.image ?? "",
  rating:
    typeof record?.rating === "number"
      ? record.rating
      : Number(record?.rating ?? 0),
  mentorName:
    record?.mentor_name ??
    record?.instructor_name ??
    record?.instructor ??
    record?.teacher ??
    "",
  mentorImage:
    record?.mentor_image ??
    record?.instructor_image ??
    record?.teacher_image ??
    "",
});

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthPayload> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session || !data.user) {
    throw new Error("Unable to retrieve session from Supabase.");
  }

  const { session, user } = data;

  return {
    token: session.access_token,
    refreshToken: session.refresh_token ?? null,
    user: {
      id: user.id,
      email: user.email ?? email,
      name:
        (user.user_metadata as any)?.name ??
        user.email?.split("@")[0] ??
        "User",
      avatar: (user.user_metadata as any)?.avatar_url,
    },
  };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  name?: string
): Promise<{ message: string; authPayload: AuthPayload | null }> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const { session, user } = data;

  if (!session || !user) {
    return {
      message:
        "Registration successful. Please check your email to confirm your account.",
      authPayload: null,
    };
  }

  return {
    message: "Registration successful!",
    authPayload: {
      token: session.access_token,
      refreshToken: session.refresh_token ?? null,
      user: {
        id: user.id,
        email: user.email ?? email,
        name: name ?? user.email?.split("@")[0] ?? "User",
        avatar: (user.user_metadata as any)?.avatar_url,
      },
    },
  };
};

export const fetchCourses = async (): Promise<CourseSummary[]> => {
  const { data, error } = await supabase.from("courses").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map(mapCourseRecord)
    .filter((course) => Boolean(course.id));
};

export const fetchCourseById = async (
  id: number
): Promise<CourseSummary | null> => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .or(`id.eq.${id},id_course.eq.${id},course_id.eq.${id}`)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapCourseRecord(data) : null;
};
