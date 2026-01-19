import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/components/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface QuizQuestion {
  id: number;
  question: string;
  options: any;
  correct_answer: string;
  order: number;
  explanation?: string;
  points: number;
  type: string;
}

interface QuizInfo {
  id: number;
  title: string;
  description: string;
  time_limit: number;
  passing_score: number;
  max_attempts: number;
}

const take = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const progressAnimation = new Animated.Value(0);

  useEffect(() => {
    fetchQuizData();
  }, [params.quizId]);

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, quizStarted]);

  useEffect(() => {
    // Animate progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, questions.length]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);

      // Fetch quiz info
      const { data: quizData, error: quizError } = await supabase
        .from("module_quizzes")
        .select("*")
        .eq("id", params.quizId)
        .single();

      if (quizError) throw quizError;

      // Fetch questions ordered by order field
      const { data: questionsData, error: questionsError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", params.quizId)
        .order("order");

      if (questionsError) throw questionsError;

      setQuizInfo(quizData);
      setQuestions(questionsData || []);
      setTimeRemaining(quizData?.time_limit * 60 || 1800); // Default 30 minutes
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      Alert.alert("Error", "Failed to load quiz data");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    setQuizStarted(false);

    // Here you would typically save the results to the database
    saveQuizResults(finalScore);
  };

  const saveQuizResults = async (finalScore: number) => {
    try {
      const { error } = await supabase.from("quiz_results").insert({
        quiz_id: params.quizId,
        score: finalScore,
        answers: selectedAnswers,
        total_score: questions.length,
        percentage: finalScore,
        passed: finalScore >= (quizInfo?.passing_score || 70),
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving quiz results:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const renderOptions = (options: any) => {
    if (!options) return null;

    let optionsArray = [];
    if (typeof options === "string") {
      try {
        optionsArray = JSON.parse(options);
      } catch (e) {
        return null;
      }
    } else {
      optionsArray = options;
    }

    return optionsArray.map((option: any, index: number) => {
      const optionText = option.option || option;
      const isSelected =
        selectedAnswers[questions[currentQuestionIndex].id] === optionText;

      return (
        <TouchableOpacity
          key={index}
          style={[styles.optionButton, isSelected && styles.selectedOption]}
          onPress={() => handleAnswerSelect(optionText)}
        >
          <View style={styles.optionContent}>
            <View
              style={[
                styles.radioButton,
                isSelected && styles.radioButtonSelected,
              ]}
            >
              {isSelected && <View style={styles.radioButtonInner} />}
            </View>
            <Text
              style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
              ]}
            >
              {optionText}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFB200" />
          <Text style={styles.loadingText}>Loading Quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Ionicons
              name={
                score >= (quizInfo?.passing_score || 70)
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={80}
              color={
                score >= (quizInfo?.passing_score || 70) ? "#00C135" : "#e81e4d"
              }
            />
            <Text style={styles.resultsTitle}>
              {score >= (quizInfo?.passing_score || 70)
                ? "Congratulations!"
                : "Keep Learning!"}
            </Text>
            <Text style={styles.scoreText}>Your Score: {score}%</Text>
            <Text style={styles.passingText}>
              Passing Score: {quizInfo?.passing_score || 70}%
            </Text>
          </View>

          <View style={styles.resultsSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Questions:</Text>
              <Text style={styles.summaryValue}>{questions.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Correct Answers:</Text>
              <Text style={styles.summaryValue}>
                {Math.round((score / 100) * questions.length)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Status:</Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color:
                      score >= (quizInfo?.passing_score || 70)
                        ? "#00C135"
                        : "#e81e4d",
                  },
                ]}
              >
                {score >= (quizInfo?.passing_score || 70) ? "PASSED" : "FAILED"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!quizStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.startContainer}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>{quizInfo?.title}</Text>
            <Text style={styles.quizDescription}>{quizInfo?.description}</Text>
          </View>

          <View style={styles.quizDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="help-circle-outline" size={24} color="#FFB200" />
              <Text style={styles.detailText}>
                {questions.length} Questions
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={24} color="#FFB200" />
              <Text style={styles.detailText}>
                {Math.floor(quizInfo?.time_limit || 30)} minutes
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="trophy-outline" size={24} color="#FFB200" />
              <Text style={styles.detailText}>
                Passing Score: {quizInfo?.passing_score || 70}%
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="refresh-outline" size={24} color="#FFB200" />
              <Text style={styles.detailText}>
                Max Attempts: {quizInfo?.max_attempts || 3}
              </Text>
            </View>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionText}>
              • Read each question carefully
            </Text>
            <Text style={styles.instructionText}>
              • Select the best answer for each question
            </Text>
            <Text style={styles.instructionText}>
              • You can navigate between questions
            </Text>
            <Text style={styles.instructionText}>
              • Submit when you're ready or time runs out
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>Start Quiz</Text>
            <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress and timer */}
      <View style={styles.quizHeader}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#FFB200" />
          <Text
            style={[
              styles.timerText,
              timeRemaining < 300 && styles.timerWarning,
            ]}
          >
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.questionContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion?.order}
          </Text>
          <Text style={styles.questionText}>{currentQuestion?.question}</Text>

          <View style={styles.optionsContainer}>
            {renderOptions(currentQuestion?.options)}
          </View>
        </View>
      </ScrollView>

      {/* Navigation and Submit */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentQuestionIndex === 0 ? "#C1C0C8" : "#FFB200"}
          />
          <Text
            style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              Alert.alert(
                "Submit Quiz",
                "Are you sure you want to submit your quiz?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Submit", onPress: handleSubmitQuiz },
                ]
              );
            }}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFB200" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default take;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#83829A",
  },
  startContainer: {
    padding: 20,
    flexGrow: 1,
  },
  quizHeader: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#133D60",
    marginBottom: 8,
    textAlign: "center",
  },
  quizDescription: {
    fontSize: 16,
    color: "#83829A",
    textAlign: "center",
    lineHeight: 24,
  },
  quizDetails: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#133D60",
    marginLeft: 12,
    fontWeight: "500",
  },
  instructions: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#133D60",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#83829A",
    marginBottom: 8,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: "#FFB200",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginRight: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFB200",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#133D60",
    minWidth: 60,
    textAlign: "right",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8F00",
    marginLeft: 4,
  },
  timerWarning: {
    color: "#e81e4d",
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFB200",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#133D60",
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFB200",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C1C0C8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: "#FFB200",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFB200",
  },
  optionText: {
    fontSize: 16,
    color: "#133D60",
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#133D60",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFB200",
    backgroundColor: "#FFFFFF",
  },
  navButtonDisabled: {
    borderColor: "#C1C0C8",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFB200",
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: "#C1C0C8",
  },
  submitButton: {
    backgroundColor: "#FFB200",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  resultsContainer: {
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
  },
  resultsHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#133D60",
    marginTop: 16,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFB200",
    marginBottom: 4,
  },
  passingText: {
    fontSize: 16,
    color: "#83829A",
  },
  resultsSummary: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#83829A",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#133D60",
  },
  backButton: {
    backgroundColor: "#133D60",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
