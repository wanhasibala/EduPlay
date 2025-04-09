import React, { useState } from "react";
import { Button, View, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const UploadToFirebase = () => {
  const [uploading, setUploading] = useState(false);

  const uploadDataToFirebase = async () => {
    try {
      setUploading(true);

      // Read the data.json file
      const jsonContent = require("../../data/data.json");
      
      // Convert JSON to string
      const jsonString = JSON.stringify(jsonContent, null, 2);

      // Create a reference to 'data.json' in Firebase Storage
      const storageRef = ref(storage, 'data/data.json');

      // Upload the string data directly
      await uploadString(storageRef, jsonString, 'raw', {
        contentType: 'application/json'
      });

      Alert.alert("Success", "Data uploaded to Firebase Storage successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
      Alert.alert("Error", "Failed to upload data. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 200 }} className="border h-[100px]">
      <Button 
        title={uploading ? "Uploading..." : "Upload Data"} 
        onPress={uploadDataToFirebase}
        disabled={uploading}
      />
    </View>
  );
};

export default UploadToFirebase;
