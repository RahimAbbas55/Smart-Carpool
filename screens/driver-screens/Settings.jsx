import { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDriverData } from "../../context/DriverContext";
import { globalColors } from '../../constants/colors';
import * as DocumentPicker from 'expo-document-picker';

export default function Profile() {
    const { driverDetails, updateDriverDetails } = useDriverData();
    
    // Create state for all editable fields
    const [formData, setFormData] = useState({
        firstName: driverDetails.firstName || '',
        lastName: driverDetails.lastName || '',
        driverEmail: driverDetails.driverEmail || '',
        driverPhone: driverDetails.driverPhone || '',
        dateOfBirth: new Date(driverDetails.dateOfBirth) || new Date(),
        brand: driverDetails.brand || '',
        vehicle: driverDetails.vehicle || '',
        vehicleType: driverDetails.vehicleType || '',
        carType: driverDetails.carType || '',
        licensePlate: driverDetails.licensePlate || '',
        driverPhoto: driverDetails.driverPhoto || ''
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const pickImage = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                copyToCacheDirectory: true,
            });

            if (result.type === "success") {
                uploadImageToImgBB(result.uri);
            }
        } catch (error) {
            console.error("Document Picker Error:", error);
        }
    };

    const uploadImageToImgBB = async (imageUri) => {
        setUploading(true);
        const apiKey = "YOUR_IMGBB_API_KEY";
        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            name: "upload.jpg",
            type: "image/jpeg"
        });

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });

            const data = await response.json();
            if (data.success) {
                handleChange("driverPhoto", data.data.url);
            } else {
                Alert.alert("Upload Failed", "Could not upload image.");
            }
        } catch (error) {
            console.error("ImgBB Upload Error:", error);
            Alert.alert("Error", "Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        console.log('Updated driver details:', formData);
        Alert.alert(
            "Profile Updated",
            "Your profile has been successfully updated.",
            [{ text: "OK" }]
        );
        if (typeof updateDriverDetails === 'function') {
            updateDriverDetails(formData);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.photoContainer}>
                <Image 
                    source={{ uri: formData.driverPhoto }} 
                    style={styles.profilePhoto} 
                />
                <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.firstName}
                        onChangeText={(text) => handleChange('firstName', text)}
                        placeholder="First Name"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.lastName}
                        onChangeText={(text) => handleChange('lastName', text)}
                        placeholder="Last Name"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.driverEmail}
                        onChangeText={(text) => handleChange('driverEmail', text)}
                        placeholder="Email"
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.driverPhone}
                        onChangeText={(text) => handleChange('driverPhone', text)}
                        placeholder="Phone Number"
                        editable={false}
                        keyboardType="phone-pad"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity 
                        style={styles.dateInput}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{formatDate(formData.dateOfBirth)}</Text>
                    </TouchableOpacity>
                    
                </View>
                
                <Text style={styles.sectionTitle}>Vehicle Information</Text>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Brand</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.brand}
                        onChangeText={(text) => handleChange('brand', text)}
                        placeholder="Brand"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.vehicle}
                        onChangeText={(text) => handleChange('vehicle', text)}
                        placeholder="Vehicle"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle Type</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.vehicleType}
                        editable={false}
                        onChangeText={(text) => handleChange('vehicleType', text)}
                        placeholder="Vehicle Type"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Car Type</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.carType}
                        onChangeText={(text) => handleChange('carType', text)}
                        placeholder="Car Type"
                        editable={false}
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>License Plate</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.licensePlate}
                        onChangeText={(text) => handleChange('licensePlate', text)}
                        placeholder="License Plate"
                    />
                </View>
                
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#2c3e50',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    photoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#fff',
    },
    changePhotoButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    changePhotoText: {
        color: '#fff',
        fontSize: 14,
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 10,
        color: '#2c3e50',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#7f8c8d',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: globalColors.violetBlue,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});