import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect } from "react";
import { globalColors } from "./constants/colors";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import * as Network from "expo-network";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Passenger Screens
import CarpoolRideScreen from "./screens/passenger-screens/carpoolride";
import ChangePasswordScreen from "./screens/passenger-screens/changepassword";
import ChooseDriverScreen from "./screens/passenger-screens/choosedriver";
import ContactUsScreen from "./screens/passenger-screens/contact";
import ForgotPasswordScreen from "./screens/passenger-screens/forgetpassword";
import HistoryScreen from "./screens/passenger-screens/history";
import LoginScreen from "./screens/passenger-screens/login";
import MenuScreen from "./screens/passenger-screens/menu";
import OngoingRideScreen from "./screens/passenger-screens/ongoingride";
import PackagesScreen from "./screens/passenger-screens/packages";
import RatingsAndReviewsScreen from "./screens/passenger-screens/ratingsandreviews";
import ReviewScreen from "./screens/passenger-screens/review";
import RequestRideScreen from "./screens/passenger-screens/RequestRideScreen";
import SettingsScreen from "./screens/passenger-screens/settings";
import SignUpScreen from "./screens/passenger-screens/signup";
import SingleRideScreen from "./screens/passenger-screens/singleride";
import WalletScreen from "./screens/passenger-screens/wallet";
// Driver Screens
import RideRequests from "./screens/driver-screens/RideRequests";
import RidePage from "./screens/driver-screens/RidePage";
import DriverRegisteration from "./screens/driver-screens/DriverRegisteration";
import RegisterationDetails from "./screens/driver-screens/RegisterationDetails";
import BasicInfo from "./screens/driver-screens/BasicInfo";
import DriverIdScreen from "./screens/driver-screens/DriverIdScreen";
import CNICDetail from "./screens/driver-screens/CNICDetail";
import VehicleInfo from "./screens/driver-screens/VehicleInfo";
import ThankYouPage from "./screens/driver-screens/ThankYou";
import RideDetails from "./screens/driver-screens/RideDetails";
import Settings from "./screens/driver-screens/Settings";
import RideHistory from "./screens/driver-screens/RideHistory";
import { getUserData } from "./data-service/auth";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DriverDrawer() {
  return (
    <Drawer.Navigator
      drawerType="slide"
      overlayColor="rgba(0, 0, 0, 0.5)"
      // drawerStyle={styles.drawerStyles}
      drawerContentOptions={{
        activeBackgroundColor: globalColors.violetBlue,
        activeTintColor: "#fff",
        inactiveTintColor: "#999",
        // itemStyle: styles.drawerItemStyle,
        // labelStyle: styles.drawerLabelStyle,
      }}
      sceneContainerStyle={{ backgroundColor: globalColors.violetBlue }}
    >
      <Drawer.Screen
        name="mainpage"
        component={RidePage}
        options={{
          headerStyle: { backgroundColor: globalColors.violetBlue },
          headerTintColor: "#ffffff",
          headerTitle: "Rides",
          headerTitleStyle: { fontWeight: "bold" },
          drawerLabel: "Rides",
        }}
      />
      <Drawer.Screen
        name="history"
        component={RideHistory}
        options={{
          headerStyle: { backgroundColor: globalColors.violetBlue },
          headerTintColor: "#ffffff",
          headerTitle: "Rides History",
          headerTitleStyle: { fontWeight: "bold" },
          drawerLabel: "Rides History",
        }}
      />
      <Drawer.Screen
        name="settings"
        component={Settings}
        options={{
          headerStyle: { backgroundColor: globalColors.violetBlue },
          headerTintColor: "#ffffff",
          headerTitle: "Account Settings",
          headerTitleStyle: { fontWeight: "bold" },
          drawerLabel: "Account Settings",
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [sessionToken, setSessionToken] = useState(undefined);
  const [isLoading, setisLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [user , setUser] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setisLoading(true);
          setSessionToken(token);
          console.log('session token found')
        } else {
          console.log("No Session Token found!");
        }
      } catch (error) {
        console.log("Error fetching token:", error);
      } finally {
        setisLoading(false);
      }
    };
    checkAuth();
  }, [sessionToken]);  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <>
      <Provider store={store}>
        <NavigationContainer
          onReady={() => console.log("Navigation Ready")}
        >
          <Stack.Navigator
            initialRouteName={sessionToken !== null ? "Home" : "Login"}
          >
            {/* Non-Authenticated Screens */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="ForgetPassword"
              component={ForgotPasswordScreen}
              options={{ gestureEnabled: false, headerShown: false }}
            />
  
            {/* Authenticated Screens */}
            <Stack.Screen
              name="Home"
              component={RequestRideScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="Menu"
              component={MenuScreen}
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="CarpoolRide"
              component={CarpoolRideScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SingleRide"
              component={SingleRideScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChooseDriver"
              component={ChooseDriverScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ContactUs"
              component={ContactUsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OngoingRide"
              component={OngoingRideScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Logout"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Review"
              component={ReviewScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Ratings and Reviews"
              component={RatingsAndReviewsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Packages"
              component={PackagesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Wallet"
              component={WalletScreen}
              options={{ headerShown: false }}
            />
            {/* Driver Screens */}
            <Stack.Screen
              name="Driver"
              component={DriverRegisteration}
              options={{
                title: "Driver Registeration",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="details"
              component={RegisterationDetails}
              options={{
                title: "Driver Details",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="basicInfo"
              component={BasicInfo}
              options={{
                title: "Basic Info",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="cnic"
              component={CNICDetail}
              options={{
                title: "CNIC Info",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="driverId"
              component={DriverIdScreen}
              options={{
                title: "Driver Photo With ID",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="vehicleInfo"
              component={VehicleInfo}
              options={{
                title: "Vehicle Info",
                headerStyle: { backgroundColor: globalColors.violetBlue },
                headerTintColor: "white",
                headerTitleStyle: { fontWeight: "bold", textAlign: "center" },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="thankyou"
              component={ThankYouPage}
              options={{ headerShown: false, headerLeft: null }}
            />
            <Stack.Screen
              name="drawer"
              component={DriverDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="requests"
              component={RideRequests}
              // options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ridedetails"
              component={RideDetails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
  
}