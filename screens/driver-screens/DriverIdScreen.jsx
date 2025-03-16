import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { globalColors } from "../../constants/colors";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const API_KEY = "068837d15525cd65b1c49b07e618821b";

export default function DriverIdScreen({ navigation, route }) {
  const { currentData, updateData } = route.params;
  const [driverIdImage, setDriverIdImage] = useState(
    currentData?.driverIdImage || ""
  );
  const [driverIdImg, setDriverIdImg] = useState("");

  async function pickDriverIdImage() {
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

        const uploadedUrl = await uploadToImgBB(base64Image);

        if (uploadedUrl) {
          setDriverIdImage(uploadedUrl);
          setDriverIdImg(uploadedUrl);
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "There was an error selecting the image");
    }
  }

  async function uploadToImgBB(base64Image) {
    const apiUrl = `https://api.imgbb.com/1/upload?key=${API_KEY}`;

    try {
      const formData = new FormData();
      formData.append("image", base64Image);

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        return response.data.data.url;
      } else {
        Alert.alert("Upload Failed", "Could not upload image to ImgBB.");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      Alert.alert("Error", "There was an error uploading the image");
      return null;
    }
  }

  function submitHandler() {
    if (!driverIdImage) {
      Alert.alert("Error", "Please add a photo of your driving license");
      return;
    }
    updateData({
      ...currentData,
      driverIdImg,
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Photo</Text>

          {driverIdImage ? (
            <Image
              source={{ uri: driverIdImage }}
              style={styles.photoImage}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require("../../assets/pictures/person-id.jpg")}
              style={styles.photoImage}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={pickDriverIdImage}
          >
            <Text style={styles.addPhotoButtonText}>Add a photo*</Text>
          </TouchableOpacity>

          <View style={styles.photoInstructions}>
            <Text style={styles.instructionText}>
              • Your face and driving license should be clear in the picture.
            </Text>
            <Text style={styles.instructionText}>
              • Glasses, mask, and hat should not be worn in the picture.
            </Text>
            <Text style={styles.instructionText}>
              • Good lighting and without filters.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={submitHandler}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
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
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addPhotoButtonText: {
    fontSize: 16,
    color: "white",
  },
  photoInstructions: {
    alignItems: "flex-start",
    width: "100%",
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  doneButton: {
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
