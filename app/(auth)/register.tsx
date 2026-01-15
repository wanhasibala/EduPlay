import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useToast } from "expo-toast";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useAuthContext } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const Toast = useToast();
  const { signUp } = useAuthContext();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      const message = "Please fill in all fields";
      setError(message);
      Toast.show(message);
      return;
    }

    if (password.length < 6) {
      const message = "Password must be at least 6 characters";
      setError(message);
      // Toast.show({
      //   type: "error",
      //   text1: "Error",
      //   text2: message,
      // });
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      // Toast.show({
      //   type: "error",
      //   text1: "Error",
      //   text2: message,
      // });
      return;
    }

    setError("");
    try {
      setLoading(true);
      const result = await signUp(email, password, email.split("@")[0]);

      const confirmationMessage =
        (result?.data as any)?.message ||
        "Registration successful! Check your email to confirm your account.";

      Toast.show(confirmationMessage);
      router.replace("/(auth)/login");
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred during registration";
      setError(errorMessage);
      // Toast.show({
      //   type: "error",
      //   text1: "Error",
      //   text2: errorMessage,
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Register"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
});
