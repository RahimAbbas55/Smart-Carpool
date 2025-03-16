import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContactUsScreen from "./contact";
import HistoryScreen from "./history";
import LoginScreen from "./login";
import PackagesScreen from "./packages";
import RatingsAndReviewsScreen from "./ratingsandreviews";
import RequestRideScreen from "./RequestRideScreen";
import SettingsScreen from "./settings";
import WalletScreen from "./wallet";
import { getDriverdata } from "../../data-service/auth";

const pages = [
  { name: "Home", component: RequestRideScreen, icon: "home" },
  { name: "Wallet", component: WalletScreen, icon: "wallet" },
  { name: "Packages", component: PackagesScreen, icon: "work" },
  { name: "History", component: HistoryScreen, icon: "history" },
  {
    name: "Ratings and Reviews",
    component: RatingsAndReviewsScreen,
    icon: "rate-review",
  },
  { name: "ContactUs", component: ContactUsScreen, icon: "mail" },
  { name: "Settings", component: SettingsScreen, icon: "settings" },
  { name: "Driver", component: LoginScreen, icon: "person" },
];

const MenuScreen = ({ navigation, route }) => {
  const { data } = route.params;
  const [driverData, setDriverData] = useState(null);
  useEffect(() => {
    const fetchDriver = async () => {
      const id = data?.userId;
      try {
        const data = await getDriverdata(id);
        setDriverData(data);
      } catch (error) {
        console.log("Menu.js: error fetching driver data", error);
      }
    };
    fetchDriver();
  }, [data?.userId]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Success", "You have been logged out.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert(
        "Error",
        "An error occurred while logging out. Please try again."
      );
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        if (item.name === "Logout") {
          handleLogout();
        } else if (item.name === "Home") {
          navigation.goBack();
        } else if (item.name === "Driver") {
          if (driverData === null) {
            navigation.navigate("Driver");
          } else {
            navigation.navigate("drawer", { driverDetails: driverData });
          }
        } else {
          navigation.navigate(item.name);
        }
      }}
    >
      <MaterialIcons name={item.icon} size={24} color="#1E40AF" />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.placeholder}>
          <MaterialIcons name="image" size={40} color="#374151" />
        </View>
        <Text style={styles.name}>{data?.name}</Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.ratingText}>4.5</Text>
        </View>
      </View>

      <FlatList
        data={[...pages, { name: "Logout", icon: "logout" }]}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    width: "70%",
    borderRightWidth: 1,
    borderColor: "#1E40AF",
    padding: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#BFDBFE",
    borderRadius: 10,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#1E40AF",
  },
  list: {
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: "#1E40AF",
    marginLeft: 10,
  },
});
export default MenuScreen;
