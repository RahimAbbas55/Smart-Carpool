import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator, 
  Modal 
} from "react-native";
import { CheckCircle } from "react-native-feather";
import { globalColors } from "../../constants/colors";
import { getUserData } from "../../data-service/auth";
import { getBackendUrl } from "../../constants/ipConfig";

const data = [
  { id: "1", title: "Basic info", description: "", icon: ">" },
  { id: "2", title: "CNIC", description: "", icon: ">" },
  { id: "3", title: "Selfie with ID", description: "", icon: ">" },
  { id: "4", title: "Vehicle Info", description: "", icon: ">" },
  { id: "5", title: "Vehicle Details", description: "", icon: ">" },
];

export default function RegistrationDetails({ navigation, route }) {
  const vehicle = (route.params?.vehicleType || "").toLowerCase();
  const [userData , setUserData] = useState(null)
  const [loadingState, setLoadingState] = useState("idle");
  const [formData, setFormData] = useState({
    basicInfo: {
      driverPhoto: "",
      firstName: "",
      lastName: "",
      dob: "",
    },
    cnicInfo: {
      CNICFront: "",
      CNICBack: "",
      CNICNumber: "",
    },
    driverIdInfo: {},
    vehicleInfo: {},
    vehicleDetails: {}
  });

  // useEffect to fetch user's data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data)
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    }
    fetchUserData();
  } , [])

  // Adavnced Navigation function that passes the data to proper routes
  const navigateToScreen = (item) => {
    let route;
    let stateData;
    let stateSetter;

    switch (item.title) {
      case "Basic info":
        route = "basicInfo";
        stateData = formData.basicInfo;
        stateSetter = (newData) =>
          setFormData({
            ...formData,
            basicInfo: newData,
          });
        break;

      case "CNIC":
        route = "cnic";
        stateData = formData.cnicInfo;
        stateSetter = (newData) =>
          setFormData({
            ...formData,
            cnicInfo: newData,
          });
        break;

      case "Selfie with ID":
        route = "driverId";
        stateData = formData.driverIdInfo;
        stateSetter = (newData) =>
          setFormData({
            ...formData,
            driverIdInfo: newData,
          });
        break;

      case "Vehicle Info":
        route = "vehicleInfo";
        stateData = formData.vehicleInfo;
        stateSetter = (newData) =>
          setFormData({
            ...formData,
            vehicleInfo: newData,
          });
        break;
      
        case "Vehicle Details":
        route = "vehicleDetails";
        stateData = formData.vehicleDetails;
        stateSetter = (newData) =>
          setFormData({
            ...formData,
            vehicleDetails: newData,
          });
        break;

      default:
        route = "invalid";
        break;
    }

    navigation.navigate(route, {
      currentData: stateData,
      updateData: stateSetter,
      vehicle
    });
  };

  async function submitHandler() {
    // setLoadingState("loading");

    const requestBody = {
        driverPassword: userData.password,
        driverEmail: userData.email,
        driverPhone: userData.phone,
        driverPhoto: formData.basicInfo.driverPhoto,
        driverFirstName: formData.basicInfo.firstName,
        driverLastName: formData.basicInfo.lastName,
        driverDOB: new Date(formData.basicInfo.dob),
        driverCnicFront: formData.cnicInfo.CNICFront,
        driverCnicBack: formData.cnicInfo.CNICBack,
        driverCnicNumber: formData.cnicInfo.CNICNumber,
        driverSelfie: formData.driverIdInfo.driverIdImg,
        vehicleRegisterationFront: formData.vehicleInfo.registerationCertFront,
        vehicleRegisterationBack: formData.vehicleInfo.registerationCertBack,
        vehicleProductionYear: formData.vehicleInfo.productionYear || "",
        vehicleType: vehicle,
        carType: formData.vehicleDetails.carType,
        brand: formData.vehicleDetails.vehicleBrand,
        vehicleName: formData.vehicleDetails.vehicleName,
        vehicleColor: formData.vehicleDetails.vehicleColor,
        licenseNumber: formData.vehicleDetails.licensePlate,
        vehiclePhotos: formData.vehicleDetails.vehiclePhotos,
        passengerId: userData.userId,
    };
    try {
        const serverUrl = getBackendUrl();
        const response = await fetch(`${serverUrl}driver/addDriver`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        console.log(response);
        if (response.status === 201) {
            setLoadingState("success");
            setTimeout(() => {
                navigation.navigate("thankyou");
            }, 1500);
        } else {
            throw new Error("Failed to submit data");
        }
    } catch (error) {
        console.error("Submission error:", error);
        setLoadingState("idle");
    }
  }

  // Check if all required fields are filled
  const isFormComplete =
    formData.basicInfo.driverPhoto &&
    formData.basicInfo.firstName &&
    formData.basicInfo.lastName &&
    formData.basicInfo.dob &&
    formData.cnicInfo.CNICFront &&
    formData.cnicInfo.CNICBack &&
    formData.cnicInfo.CNICNumber &&
    Object.keys(formData.driverIdInfo).length > 0 &&
    Object.keys(formData.vehicleInfo).length > 0 &&
    formData.vehicleDetails.carType &&
    formData.vehicleDetails.licensePlate &&
    formData.vehicleDetails.vehicleBrand &&
    formData.vehicleDetails.vehicleColor &&
    formData.vehicleDetails.vehicleName &&
    formData.vehicleDetails.vehiclePhotos;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigateToScreen(item)}
    >
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.itemDescription}>{item.description}</Text>
        ) : null}
      </View>
      <Text style={styles.itemIcon}>{item.icon}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />

<TouchableOpacity
        style={[
          styles.doneButton,
          { backgroundColor: isFormComplete ? globalColors.violetBlue : "#ccc" },
        ]}
        onPress={submitHandler}
        disabled={!isFormComplete || loadingState === "loading"}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
      </View>

        {/* Loader Modal */}
      <Modal visible={loadingState !== "idle"} transparent>
        <View style={styles.modalContainer}>
          {loadingState === "loading" ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <CheckCircle width={60} height={60} color="green" />
          )}
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By tapping <Text style={styles.bold}>"Submit"</Text> you agree with
          our <Text style={styles.link}>Terms and Conditions</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: globalColors.violetBlue,
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
    justifyContent: "flex-start",
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
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
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f2f2f2",
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    color: globalColors.cornFlower,
    textDecorationLine: "underline",
  },
  // Add the RegistrationItem styles here
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: globalColors.cornFlower,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#000",
  },
  itemDescription: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  itemIcon: {
    fontSize: 18,
    color: "green",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent overlay
  },
  modalContent: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  
});
