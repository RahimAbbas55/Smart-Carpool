import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { globalColors } from "../../constants/colors";
import { useState } from "react";

export default function DriverIdScreen({ navigation }) {
  const [driverId, setDriverId] = useState("");

  function submitHandler(){
    navigation.goBack('details');
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.photoContainer}>
          <Text style={styles.photoLabel}>Photo</Text>
          <Image
            source={require("../../assets/pictures/person-id.jpg")}
            style={styles.photoImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.addPhotoButton}>
            <Text style={styles.addPhotoButtonText}>Add a photo*</Text>
          </TouchableOpacity>
          <View style={styles.photoInstructions}>
            <Text style={styles.instructionText}>• Your face and driving license should be clear in the picture.</Text>
            <Text style={styles.instructionText}>• Glasses, mask, and hat should not be worn in the picture.</Text>
            <Text style={styles.instructionText}>• Good lighting and without filters.</Text>
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
    paddingTop: 50
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: globalColors.violetBlue,
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
