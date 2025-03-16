import { createStackNavigator } from "@react-navigation/stack";
import { globalColors } from "../constants/colors";
import { useDriverContext } from "../contexts/DriverContext";

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
import CarpoolRequests from "./screens/driver-screens/CarpoolRequests";
import CarpoolRideDetail from "./screens/driver-screens/CarpoolRideDetail";
import VehicleDetails from "./screens/driver-screens/VehicleDetails";
import DriverDrawer from "./DriverDrawer";

const Stack = createStackNavigator();

export default function DriverNavigator() {
  const { driverData, loading } = useDriverContext();

  // If driver registration is not complete, show registration flow
  const isRegistered = driverData && driverData.isRegistrationComplete;

  return (
    <Stack.Navigator>
      {!isRegistered ? (
        <>
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
            name="vehicleDetails"
            component={VehicleDetails}
            options={{
              title: "Vehicle Details",
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
        </>
      ) : (
        <>
          <Stack.Screen
            name="drawer"
            component={DriverDrawer}
            options={{ headerShown: false }}
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
            name="carpool_requests"
            component={CarpoolRequests}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ridedetails"
            component={RideDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="carpoolridedetails"
            component={CarpoolRideDetail}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
