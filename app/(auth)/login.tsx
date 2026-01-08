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
import { useCreateMutation, useLoginMutation } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const Toast = useToast();
  const [login] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show("Please fill in all fields");
      return;
    }

    try {
      console.log("🔐 Attempting login with:", email);
      console.log("📡 API Base URL:", "http://192.168.100.20:8080"); // Check this matches your backend

      const response = await login({
        email,
        password,
      }).unwrap();

      console.log("✅ Login successful:", response);

      if (response?.error) {
        throw new Error(response.error);
      }

      const token = response.token;
      const user = response.user;

      // Store token in SecureStore (encrypted)
      await SecureStore.setItemAsync("authToken", token);
      if (response.refreshToken) {
        await SecureStore.setItemAsync("refreshToken", response.refreshToken);
      }

      // Store user in AsyncStorage (non-sensitive)
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Toast.show("Login successful!");
      router.push("/(tab)");
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during login";
      setError(errorMessage);
      console.error("❌ Login error:", JSON.stringify(err, null, 2));
      console.error("Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      Toast.show(errorMessage);
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
      <TouchableOpacity style={[styles.button]} onPress={handleLogin}>
        <Text style={styles.buttonText} className="font-poppins">
          {"Masuk"}
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
