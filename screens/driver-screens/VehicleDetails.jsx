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
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import RNPickerSelect from "react-native-picker-select";
import { globalColors } from "../../constants/colors";

const IMGBB_API_KEY = "068837d15525cd65b1c49b07e618821b"; 

export default function VehicleDetails({ navigation, route }) {
  const { currentData, updateData, vehicle } = route.params;
  const [vehicleBrand, setVehicleBrand] = useState(currentData?.vehicleBrand || "");
  const [vehicleName, setVehicleName] = useState(currentData?.vehicleName || "");
  const [vehicleColor, setVehicleColor] = useState(currentData?.vehicleColor || "");
  const [licensePlate, setLicensePlate] = useState(currentData?.licensePlate || "");
  const [carType, setCarType] = useState(currentData?.carType || "");
  const [vehiclePhotos, setVehiclePhotos] = useState(
    Array.isArray(currentData?.vehiclePhotos) ? currentData.vehiclePhotos : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  async function pickDocument(index) {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setIsUploading(true);
        setUploadingIndex(index);
        const base64 = await FileSystem.readAsStringAsync(selectedAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const uploadResult = await uploadToImgBB(base64);
        if (uploadResult.success) {
          const updatedPhotos = [...vehiclePhotos];
          const photoUrl = uploadResult.data.url;
          while (updatedPhotos.length <= index) {
            updatedPhotos.push("");
          }
          updatedPhotos[index] = photoUrl;
          setVehiclePhotos(updatedPhotos);
        } else {
          Alert.alert("Upload Failed", "Failed to upload image to server");
        }
        setIsUploading(false);
        setUploadingIndex(null);
      }
    } catch (error) {
      setIsUploading(false);
      setUploadingIndex(null);
      Alert.alert("Error", "There was an error selecting or uploading the image");
      console.error("Image upload error:", error);
    }
  }

  async function uploadToImgBB(base64Image) {
    try {
      const formData = new FormData();
      formData.append("key", IMGBB_API_KEY);
      formData.append("image", base64Image);
      
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        return {
          success: true,
          data: responseData.data,
        };
      } else {
        console.error("imgBB API error:", responseData);
        return {
          success: false,
          error: responseData.error,
        };
      }
    } catch (error) {
      console.error("imgBB upload error:", error);
      return {
        success: false,
        error: "Network error",
      };
    }
  }

  function confirmHandler() {
    const requiredPhotoCount = 3;
    const validPhotoCount = vehiclePhotos.filter(url => url && url.trim() !== "").length;
    
    if (!vehicleBrand || !vehicleName || !vehicleColor || !licensePlate || validPhotoCount < requiredPhotoCount) {
      Alert.alert("Error", `Please fill all fields and upload all ${requiredPhotoCount} images.`);
      return;
    }
    const dataToUpdate = {
      vehicleBrand,
      vehicleName,
      vehicleColor,
      licensePlate,
      carType,
      vehiclePhotos,
    };
    
    updateData(dataToUpdate);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Vehicle Details</Text>
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Vehicle Brand</Text>
          <TextInput style={styles.input} placeholder="Enter brand" value={vehicleBrand} onChangeText={setVehicleBrand} />

          <Text style={styles.inputLabel}>Vehicle Name</Text>
          <TextInput style={styles.input} placeholder="Enter name" value={vehicleName} onChangeText={setVehicleName} />

          <Text style={styles.inputLabel}>Vehicle Color</Text>
          <TextInput style={styles.input} placeholder="Enter color" value={vehicleColor} onChangeText={setVehicleColor} />

          <Text style={styles.inputLabel}>License Plate</Text>
          <TextInput style={styles.input} placeholder="Enter license plate" value={licensePlate} onChangeText={setLicensePlate} />

          {vehicle === "car" && (
            <>
              <Text style={styles.inputLabel}>Car Type</Text>
              <RNPickerSelect
                onValueChange={setCarType}
                items={[
                  { label: "AC Car", value: "Ac car" },
                  { label: "Economy Car", value: "Economy car" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Select car type", value: null }}
                value={carType}
              />
            </>
          )}
        </View>

        <Text style={styles.inputLabel}>Upload Images</Text>
        {["Front", "Back", "Side"].map((label, index) => {
          const photoUrl = vehiclePhotos[index];
          
          return (
            <View key={index} style={styles.imageContainer}>
              <Text>Image from {label}</Text>
              
              {photoUrl ? (
                <Image 
                  source={{ uri: photoUrl }} 
                  style={styles.imagePreview} 
                  onError={() => console.log(`Error loading image at index ${index} with URL: ${photoUrl}`)}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>No image selected</Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={[
                  styles.uploadButton, 
                  (isUploading && (uploadingIndex === index || uploadingIndex === null)) && styles.disabledButton
                ]} 
                onPress={() => pickDocument(index)}
                disabled={isUploading}
              >
                {isUploading && uploadingIndex === index ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.uploadButtonText}>
                    {photoUrl ? "Change Image" : "Upload Image"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        <TouchableOpacity 
          style={[styles.confirmButton, isUploading && styles.disabledButton]} 
          onPress={confirmHandler}
          disabled={isUploading}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 20 },
  content: { paddingBottom: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  form: { marginBottom: 20, backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 2, borderColor: globalColors.violetBlue },
  inputLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: { height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, marginBottom: 16, borderWidth: 2, borderColor: globalColors.violetBlue },
  imageContainer: { alignItems: "center", marginBottom: 20, backgroundColor: "#fff", padding: 16, borderRadius: 8, borderWidth: 2, borderColor: globalColors.violetBlue },
  imagePreview: { width: "100%", height: 150, marginBottom: 8, resizeMode: "cover", borderRadius: 4 },
  imagePlaceholder: { width: "100%", height: 150, marginBottom: 8, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0", borderRadius: 4 },
  uploadButton: { backgroundColor: "green", padding: 10, borderRadius: 8, width: "100%" },
  uploadButtonText: { color: "#fff", textAlign: "center" },
  confirmButton: { backgroundColor: globalColors.violetBlue, padding: 12, borderRadius: 8, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledButton: { opacity: 0.5 },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
    borderRadius: 8,
    color: "black",
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
    borderRadius: 8,
    color: "black",
    marginBottom: 16,
  },
};