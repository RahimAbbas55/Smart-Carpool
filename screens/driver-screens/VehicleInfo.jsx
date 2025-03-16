import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { globalColors } from "../../constants/colors";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const API_KEY = "068837d15525cd65b1c49b07e618821b";

export default function VehicleInfo({ navigation, route }) {
  const { currentData, updateData } = route.params;
  const [vehicleCertFront, setVehicleCertFront] = useState("");
  const [vehicleCertBack, setVehicleCertBack] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [frontImageUri, setFrontImageUri] = useState("");
  const [backImageUri, setBackImageUri] = useState("");

  async function uploadToImgBB(base64Image) {
    const apiUrl = `https://api.imgbb.com/1/upload?key=${API_KEY}`;
    try {
      const formData = new FormData();
      formData.append("image", base64Image);
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        return response.data.data.url;
      } else {
        Alert.alert("Upload Failed", "Could not upload image to ImgBB.");
        return null;
      }
    } catch (error) {
      Alert.alert("Error", "There was an error uploading the image");
      return null;
    }
  }

  async function pickFrontImage() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const base64Image = await FileSystem.readAsStringAsync(selectedAsset.uri, { encoding: FileSystem.EncodingType.Base64 });
        const uploadedUrl = await uploadToImgBB(base64Image);
        if (uploadedUrl) {
          setVehicleCertFront(uploadedUrl);
          setFrontImageUri(uploadedUrl);
        }
      }
    } catch (error) {
      Alert.alert("Error", "There was an error selecting the image");
    }
  }

  async function pickBackImage() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const base64Image = await FileSystem.readAsStringAsync(selectedAsset.uri, { encoding: FileSystem.EncodingType.Base64 });
        const uploadedUrl = await uploadToImgBB(base64Image);
        if (uploadedUrl) {
          setVehicleCertBack(uploadedUrl);
          setBackImageUri(uploadedUrl);
        }
      }
    } catch (error) {
      Alert.alert("Error", "There was an error selecting the image");
    }
  }

  function submitHandler() {
    if (!vehicleCertFront || !vehicleCertBack) {
      Alert.alert("Error", "Please add both front and back images of the vehicle registration");
      return;
    }
    updateData({ ...currentData, registerationCertFront: vehicleCertFront, registerationCertBack: vehicleCertBack, productionYear });
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>
            Certificate of vehicle registration (front side)
          </Text>
          {frontImageUri ? (
            <Image source={{ uri: frontImageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>No image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={pickFrontImage}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>
            Certificate of vehicle registration (back side)
          </Text>
          {backImageUri ? (
            <Image source={{ uri: backImageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>No image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={pickBackImage}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            Vehicle Production Year (optional)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter production year"
            value={productionYear}
            onChangeText={setProductionYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={submitHandler}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 25,
  },
  backButton: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  cardSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 180,
    marginBottom: 10,
    borderRadius: 5,
    resizeMode: "contain",
  },
  placeholderImage: {
    width: 300,
    height: 180,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: globalColors.violetBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  fileNameText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  inputSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  doneButton: {
    alignItems: "center",
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
