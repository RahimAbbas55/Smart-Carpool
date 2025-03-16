import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { globalColors } from '../../constants/colors';
import { useState } from 'react';
import { validateCNIC } from '../../constants/driverValidators';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const API_KEY = "068837d15525cd65b1c49b07e618821b";

export default function CNICDetail({ navigation, route }) {
  const { currentData, updateData } = route.params;
  const [CNICFrontURI , setFrontURI] = useState('')
  const [CNICBackURI , setBackUri] = useState('')
  const [CNICFront, setCNICFront] = useState(currentData?.CNICFront || '');
  const [CNICBack, setCNICBack] = useState(currentData?.CNICBack || '');
  const [CNICNumber, setCNICNumber] = useState(currentData?.CNICNumber || '')

  async function pickImage(isFront) {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        // Convert image to Base64
        const base64Image = await FileSystem.readAsStringAsync(selectedAsset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Upload to ImgBB
        const uploadedUrl = await uploadToImgBB(base64Image);

        if (uploadedUrl) {
          if (isFront) {
            setFrontURI(uploadedUrl);
            setCNICFront(uploadedUrl);
          } else {
            setBackUri(uploadedUrl);
            setCNICBack(uploadedUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'There was an error selecting the image');
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
    if ( !CNICFront || !CNICBack || !CNICNumber) {
      Alert.alert('Error', 'Please enter all data fields!');
      return;
    }
    
    if ( validateCNIC(CNICNumber) ){
      Alert.alert("Error" , 'Invalid CNIC Format!' )
      return
    }

    updateData({
      ...currentData,
      CNICFront,
      CNICBack,
      CNICNumber
    });
    

    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>CNIC (front side)</Text>
          {CNICFrontURI ? (
            <Image 
              source={{ uri: CNICFrontURI }} 
              style={styles.image}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>No image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => pickImage(true)}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>CNIC (back side)</Text>
          {CNICBackURI ? (
            <Image 
              source={{ uri: CNICBackURI }} 
              style={styles.image}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text>No image selected</Text>
            </View>
          )}
          <TouchableOpacity style={styles.addButton} onPress={() => pickImage(false)}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CNIC Number</Text>
          <TextInput 
            style={[styles.input , styles.extraInput]}
            placeholder="Enter CNIC Number in (DDDDD-DDDDDDD-D) Format"
            value={CNICNumber}
            onChangeText={setCNICNumber}
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
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
  },
  backButton: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: globalColors.violetBlue
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 180,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: 300,
    height: 180,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: globalColors.violetBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  inputSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: globalColors.violetBlue
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: globalColors.violetBlue,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  extraInput: {
    fontSize: 12
  },
  doneButton: {
    alignItems: "center",
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});