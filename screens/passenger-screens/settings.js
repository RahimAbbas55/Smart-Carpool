import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getUserData } from '../../data-service/auth';
import * as ImagePicker from 'expo-image-picker';
import Button from "../../components/Button";
import { getBackendUrl } from '../../constants/ipConfig';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const API_KEY = "068837d15525cd65b1c49b07e618821b";
  // useEffect to fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        // console.log('Fetched userData:', data); // Debug log
        setFullName(data?.name || "");
        setEmail(data?.email || "");
        setPhone(data?.phone || "");
        setPassword(data?.password || "");
        setProfileImage(data?.profileImage || null);
      } catch (error) {
        console.log('Error fetching user data:', error.message);
      }
    };

    fetchUser();
  }, []);
  // function to pick image from device's gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      setProfileImage(localUri);

      const formData = new FormData();
      formData.append('image', {
        uri: localUri,
        type: 'image/jpeg',
        name: `profile_${Date.now()}.jpg`,
      });

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${API_KEY}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (data.success) {
          const uploadedUrl = data.data.url;
          setProfileImage(uploadedUrl);
          await handleSave(uploadedUrl); // Save user data with uploaded image
        } else {
          throw new Error('Image upload failed');
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred while uploading the image');
      }
    }
  };
  // function to update the user's details
  const handleSave = async (imageUrl = null) => {
    try {
      const response = await fetch(`${getBackendUrl()}passenger/updateUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          phone,
          password,
          email,
          profileImage: imageUrl,
        }),
      });
      // console.log("settings front", response)
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = await response.json();
      Alert.alert("Success", "User data updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred while updating user data");
    }
  };

  return (
    <>
      <View style={styles.container2}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Settings</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            style={styles.profilePicture}
            source={profileImage ? { uri: profileImage } : require("../../assets/user.png")}
          />
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changeText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <View style={styles.container3}>
          <Button text="Save" onPress={() => handleSave(profileImage)} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: "#EDE9F6",
  },
  container2: {
    flex: 1,
    backgroundColor: "#EDE9F6",
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    height: 45,
    backgroundColor: "#3B3B98",
    borderRadius: 6,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EDE9F6",
    marginLeft: 110,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: "#ccc",
    marginRight: 15,
  },
  changeText: {
    color: "#007AFF",
    fontSize: 16,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  container3: {
    marginTop: 20,
    width: 378,
  },
});

export default SettingsScreen;