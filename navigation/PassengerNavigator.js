import { createStackNavigator } from "@react-navigation/stack";
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
import ChooseCarpool from "./screens/passenger-screens/ChooseCarpool";

const Stack = createStackNavigator();

export default function PassengerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
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
        name="carpool_driver"
        component={ChooseCarpool}
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
    </Stack.Navigator>
  );
}
