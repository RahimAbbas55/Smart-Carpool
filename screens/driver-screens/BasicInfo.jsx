import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { globalColors } from "../../constants/colors";

export default function BasicInfo({ navigation }) {
  const [firstName , setFirstName] = useState('');
  const [lastName , setLastName] = useState('');
  const [dob , setDOB] = useState('');

  function firstNameHandler(enteredText)
  {
    setFirstName(enteredText)
  }

  function lastNameHandler(enteredText){
    setLastName(enteredText)
  }

  function dobHandler(enteredText){
    setDOB(enteredText)
  }

  function confirmHandler(){
    console.log(firstName , lastName , dob);
    navigation.goBack('details');
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Photo Section */}
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Photo</Text>
          <Image
            source={require("../../assets/pictures/id-card.jpg")}
            style={styles.photoImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.addPhotoButton}>
            <Text style={styles.addPhotoButtonText}>Add a photo*</Text>
          </TouchableOpacity>
          <View style={styles.photoInstructions}>
            <Text style={styles.instructionText}>• Clearly visible face</Text>
            <Text style={styles.instructionText}>• Without sunglasses</Text>
            <Text style={styles.instructionText}>
              • Good lighting and without filters
            </Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput style={styles.input} placeholder="Please Enter Your First Name" onChangeText={firstNameHandler}/>

          <Text style={styles.inputLabel}>Last name</Text>
          <TextInput style={styles.input} placeholder="Please Enter Your Last Name" onChangeText={lastNameHandler}/>

          <View style={styles.optionalField}>
            <Text style={styles.inputLabel}>Date of birth</Text>
            <Text style={styles.optionalText}>Optional</Text>
          </View>
          <TextInput style={styles.input} placeholder="Please Enter Your Date of Birth" onChangeText={dobHandler}/>

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
  backButton: {
    color: "#fff",
    fontSize: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    color: "#fff",
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    // paddingTop: ,
  },
  photoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: globalColors.violetBlue
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
    borderColor: globalColors.violetBlue
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
  optionalField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionalText: {
    fontSize: 14,
    color: "#888",
  },
  doneButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  doneButton: {
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
});
