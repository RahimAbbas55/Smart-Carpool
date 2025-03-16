import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/passenger-screens/login";
import SignUpScreen from "../screens/passenger-screens/signup";
import ForgotPasswordScreen from "../screens/passenger-screens/forgetpassword";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}