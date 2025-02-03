import React from "react";
import { Button, View, Alert } from "react-native";
import storage from "@react-native-firebase/storage";
import * as FileSystem from "expo-file-system"; // Use expo-file-system for local file handling

const UploadToFirebase = () => {
  const uploadDataToFirebase = async () => {
    try {
      // Path to the local JSON file (adjust path based on your structure)
      const fileUri = FileSystem.documentDirectory + "courseData2.json";

      // Create a blob or file reference to upload
      const response = await FileSystem.downloadAsync(
        require("./assets/courseData2.json"),
        fileUri,
      );

      const storageRef = storage().ref("../../data/courseData.json");

      // Upload file to Firebase Storage
      await storageRef.putFile(response.uri);

      Alert.alert("Success", "Data uploaded to Firebase Storage successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      Alert.alert("Error", "Failed to upload data. Check console for details.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Upload Data" onPress={uploadDataToFirebase} />
    </View>
  );
};

export default UploadToFirebase;
