import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { globalColors } from "../../constants/colors";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import {
  validateDOB,
  validateFirstName,
  validateLastName,
} from "../../constants/driverValidators";

export default function BasicInfo({ navigation, route }) {
  const { currentData, updateData } = route.params;

  const [firstName, setFirstName] = useState(currentData?.firstName || "");
  const [lastName, setLastName] = useState(currentData?.lastName || "");
  const [dob, setDOB] = useState(currentData?.dob || "");
  const [photoUrl, setPhotoUrl] = useState(currentData?.driverPhoto || "");

  const API_KEY = "068837d15525cd65b1c49b07e618821b";

  async function pickImage() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const base64Image = await FileSystem.readAsStringAsync(
          selectedAsset.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        uploadToImgBB(base64Image);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "There was an error selecting the image");
    }
  }

  async function uploadToImgBB(base64Image) {
    const apiUrl = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", base64Image);

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const uploadedImageUrl = response.data.data.url;
        setPhotoUrl(uploadedImageUrl);
      } else {
        Alert.alert("Upload Failed", "Could not upload image to ImgBB.");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      Alert.alert("Error", "There was an error uploading the image");
    }
  }

  function confirmHandler() {
    if (!photoUrl || !firstName || !lastName || !dob) {
      Alert.alert("Error", "Please enter data in all fields!");
      return;
    }

    if (validateFirstName(firstName)) {
      Alert.alert(
        "Error",
        "First name must contain only letters and be at least 2 characters long."
      );
      return;
    }

    if (validateLastName(lastName)) {
      Alert.alert(
        "Error",
        "Last name must contain only letters and be at least 2 characters long."
      );
      return;
    }

    if (validateDOB(dob)) {
      Alert.alert("Error", "Date of Birth must be in YYYY-MM-DD format.");
      return;
    }

    updateData({
      driverPhoto: photoUrl,
      firstName: firstName,
      lastName: lastName,
      dob: dob,
    });

    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Photo</Text>

          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.photoImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../../assets/pictures/id-card.jpg")}
              style={styles.photoImage}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
            <Text style={styles.addPhotoButtonText}>
              {photoUrl ? "Change photo*" : "Add a photo*"}
            </Text>
          </TouchableOpacity>

          <View style={styles.photoInstructions}>
            <Text style={styles.instructionText}>• Clearly visible face</Text>
            <Text style={styles.instructionText}>• Without sunglasses</Text>
            <Text style={styles.instructionText}>
              • Good lighting and without filters
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Please Enter Your First Name"
            onChangeText={setFirstName}
            value={firstName}
          />

          <Text style={styles.inputLabel}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Please Enter Your Last Name"
            onChangeText={setLastName}
            value={lastName}
          />

          <View style={styles.optionalField}>
            <Text style={styles.inputLabel}>Date of birth</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Please Enter Your Date of Birth (YYYY-MM-DD)"
            onChangeText={setDOB}
            value={dob}
          />

          <TouchableOpacity style={styles.doneButton} onPress={confirmHandler}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  photoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  photoImage: {
    width: "100%",
    height: 150,
    marginBottom: 16,
  },
  addPhotoButton: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addPhotoButtonText: {
    fontSize: 16,
    color: "green",
  },
  photoInstructions: {
    alignItems: "flex-start",
    width: "100%",
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
  },
  doneButton: {
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});
