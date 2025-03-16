import { createDrawerNavigator } from "@react-navigation/drawer";
import { globalColors } from "../constants/colors";
import RidePage from "../screens/driver-screens/RidePage";
import RideHistory from "../screens/driver-screens/RideHistory";
import Settings from "../screens/driver-screens/Settings";

const Drawer = createDrawerNavigator();

export default function DriverDrawer() {
  return (
    <Drawer.Navigator
      drawerType="slide"
      overlayColor="rgba(0, 0, 0, 0.5)"
      drawerContentOptions={{
        activeBackgroundColor: globalColors.violetBlue,
        activeTintColor: "#fff",
        inactiveTintColor: "#999",
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