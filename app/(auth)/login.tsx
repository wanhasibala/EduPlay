import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useToast } from "expo-toast";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/contexts/AuthContext";
import { loginWithEmail } from "@/services/supabaseApi";
import { supabase } from "@/utils/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const Toast = useToast();
  const { signIn } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const loginResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("✅ Login response:", JSON.stringify(loginResponse, null, 2));

      if (loginResponse.error) {
        throw loginResponse.error;
      }

      Toast.show("Login successful!");
      await signIn({
        token: loginResponse.data.session?.access_token || "",
        refreshToken: loginResponse.data.session?.refresh_token || "",
        user: loginResponse.data.user,
      });
      // Navigation will happen automatically due to auth state change
      // The RootLayoutNav will detect the auth state change and redirect
      router.push("/(tab)");
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred during login";
      setError(errorMessage);
      console.error("❌ Login error:", JSON.stringify(err, null, 2));
      Toast.show(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} className="flex gap-8">
      <View className="flex flex-row gap-2 items-center justify-center">
        <Image
          source={require("../../assets/images/logo-text.svg")}
          style={{ width: 36, height: 36, alignSelf: "center" }}
        />
        <Text className="text-4xl font-poppins-semibold text-center text-primary">
          EduPlay
        </Text>
      </View>
      {/* <Text style={styles.title}>Welcome Back</Text> */}

      <View>
        <View className="flex gap-2 font-poppins">
          <Text className="ml-2">Email or Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Email "
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text className="ml-2 font-poppins">Password</Text>

          <View
            style={{ flexDirection: "row", alignItems: "center" }}
            className="relative"
          >
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 15 }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="password"
              autoComplete="current-password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ marginRight: 10, marginBottom: 15 }}
              className="absolute right-2 "
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
          </View>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText} className="font-poppins">
          {isLoading ? "Signing in..." : "Masuk"}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/register" asChild>
        <TouchableOpacity style={styles.link}>
          <Text className="font-poppins">
            Tidak punya akun? <Text className="text-secondary">Daftar</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: "#fff",
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
