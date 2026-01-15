export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      course_lessons: {
        Row: {
          content: string | null
          created_at: string | null
          document_url: string | null
          duration: string | null
          external_url: string | null
          id: number
          is_required: boolean | null
          module_id: number
          order: number
          title: string
          type: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          document_url?: string | null
          duration?: string | null
          external_url?: string | null
          id?: number
          is_required?: boolean | null
          module_id: number
          order: number
          title: string
          type: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          document_url?: string | null
          duration?: string | null
          external_url?: string | null
          id?: number
          is_required?: boolean | null
          module_id?: number
          order?: number
          title?: string
          type?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: number
          created_at: string | null
          description: string | null
          duration: number | null
          id: number
          objectives: Json | null
          order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: number
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          objectives?: Json | null
          order: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: number
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          objectives?: Json | null
          order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "internship_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      intern_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          gpa: number | null
          id: number
          internship_end_date: string | null
          internship_start_date: string | null
          learning_goals: string | null
          major: string | null
          resume_url: string | null
          semester: number | null
          skills: Json | null
          student_id: string | null
          supervisor_id: string | null
          transcript_url: string | null
          university: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          gpa?: number | null
          id?: number
          internship_end_date?: string | null
          internship_start_date?: string | null
          learning_goals?: string | null
          major?: string | null
          resume_url?: string | null
          semester?: number | null
          skills?: Json | null
          student_id?: string | null
          supervisor_id?: string | null
          transcript_url?: string | null
          university?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          gpa?: number | null
          id?: number
          internship_end_date?: string | null
          internship_start_date?: string | null
          learning_goals?: string | null
          major?: string | null
          resume_url?: string | null
          semester?: number | null
          skills?: Json | null
          student_id?: string | null
          supervisor_id?: string | null
          transcript_url?: string | null
          university?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      internship_courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: number
          image_url: string | null
          is_active: boolean | null
          level: string | null
          mentor_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          mentor_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          mentor_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      internship_enrollments: {
        Row: {
          completed_at: string | null
          course_id: number
          created_at: string | null
          enrolled_at: string | null
          id: number
          intern_id: string
          overall_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id: number
          created_at?: string | null
          enrolled_at?: string | null
          id?: number
          intern_id: string
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: number
          created_at?: string | null
          enrolled_at?: string | null
          id?: number
          intern_id?: string
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internship_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "internship_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_final_assessments: {
        Row: {
          areas_for_improvement: string | null
          assessment_date: string | null
          average_quiz_score: number | null
          communication_skills: number | null
          course_completion_rate: number | null
          created_at: string | null
          id: number
          initiative: number | null
          intern_id: string
          intern_self_reflection: string | null
          overall_score: number | null
          performance_grade: string | null
          problem_solving: number | null
          professionalism: number | null
          recommendation: string | null
          status: string | null
          strengths: string | null
          supervisor_comments: string | null
          supervisor_id: string | null
          team_collaboration: number | null
          technical_competence: number | null
          total_courses_completed: number | null
          total_courses_taken: number | null
          updated_at: string | null
        }
        Insert: {
          areas_for_improvement?: string | null
          assessment_date?: string | null
          average_quiz_score?: number | null
          communication_skills?: number | null
          course_completion_rate?: number | null
          created_at?: string | null
          id?: number
          initiative?: number | null
          intern_id: string
          intern_self_reflection?: string | null
          overall_score?: number | null
          performance_grade?: string | null
          problem_solving?: number | null
          professionalism?: number | null
          recommendation?: string | null
          status?: string | null
          strengths?: string | null
          supervisor_comments?: string | null
          supervisor_id?: string | null
          team_collaboration?: number | null
          technical_competence?: number | null
          total_courses_completed?: number | null
          total_courses_taken?: number | null
          updated_at?: string | null
        }
        Update: {
          areas_for_improvement?: string | null
          assessment_date?: string | null
          average_quiz_score?: number | null
          communication_skills?: number | null
          course_completion_rate?: number | null
          created_at?: string | null
          id?: number
          initiative?: number | null
          intern_id?: string
          intern_self_reflection?: string | null
          overall_score?: number | null
          performance_grade?: string | null
          problem_solving?: number | null
          professionalism?: number | null
          recommendation?: string | null
          status?: string | null
          strengths?: string | null
          supervisor_comments?: string | null
          supervisor_id?: string | null
          team_collaboration?: number | null
          technical_competence?: number | null
          total_courses_completed?: number | null
          total_courses_taken?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_progresses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: number
          is_completed: boolean | null
          last_accessed: string | null
          lesson_id: number
          module_progress_id: number
          notes: string | null
          time_spent: number | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          last_accessed?: string | null
          lesson_id: number
          module_progress_id: number
          notes?: string | null
          time_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: number
          is_completed?: boolean | null
          last_accessed?: string | null
          lesson_id?: number
          module_progress_id?: number
          notes?: string | null
          time_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progresses_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progresses_module_progress_id_fkey"
            columns: ["module_progress_id"]
            isOneToOne: false
            referencedRelation: "module_progresses"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progresses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          enrollment_id: number
          id: number
          module_id: number
          progress: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id: number
          id?: number
          module_id: number
          progress?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: number
          id?: number
          module_id?: number
          progress?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_progresses_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "internship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_progresses_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          max_attempts: number | null
          module_id: number
          passing_score: number | null
          time_limit: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          max_attempts?: number | null
          module_id: number
          passing_score?: number | null
          time_limit?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          max_attempts?: number | null
          module_id?: number
          passing_score?: number | null
          time_limit?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: true
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          explanation: string | null
          id: number
          options: Json | null
          order: number
          points: number | null
          question: string
          quiz_id: number
          type: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: number
          options?: Json | null
          order: number
          points?: number | null
          question: string
          quiz_id: number
          type: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: number
          options?: Json | null
          order?: number
          points?: number | null
          question?: string
          quiz_id?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "module_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          answers: Json | null
          attempt: number | null
          completed_at: string | null
          created_at: string | null
          enrollment_id: number
          id: number
          module_id: number
          passed: boolean | null
          percentage: number | null
          quiz_id: number
          score: number | null
          started_at: string | null
          time_spent: number | null
          total_score: number | null
        }
        Insert: {
          answers?: Json | null
          attempt?: number | null
          completed_at?: string | null
          created_at?: string | null
          enrollment_id: number
          id?: number
          module_id: number
          passed?: boolean | null
          percentage?: number | null
          quiz_id: number
          score?: number | null
          started_at?: string | null
          time_spent?: number | null
          total_score?: number | null
        }
        Update: {
          answers?: Json | null
          attempt?: number | null
          completed_at?: string | null
          created_at?: string | null
          enrollment_id?: number
          id?: number
          module_id?: number
          passed?: boolean | null
          percentage?: number | null
          quiz_id?: number
          score?: number | null
          started_at?: string | null
          time_spent?: number | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "internship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "module_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisor_profiles: {
        Row: {
          bio: string | null
          company_name: string | null
          created_at: string | null
          department: string | null
          employee_id: string | null
          expertise: Json | null
          id: number
          position: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          expertise?: Json | null
          id?: number
          position?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          company_name?: string | null
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          expertise?: Json | null
          id?: number
          position?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          admin_role_level: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          profile_image: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          admin_role_level?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          profile_image?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          admin_role_level?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          profile_image?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
