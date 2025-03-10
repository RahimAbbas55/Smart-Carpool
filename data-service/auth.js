import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getBackendUrl } from "../constants/ipConfig";

export async function getUserData() {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    // const serverURL =
    //   Platform.OS === "android"
    //     ? "http://10.0.2.2:50/api/passenger/userData"
    //     : "http://localhost:50/api/passenger/userData";
    const serverURL = getBackendUrl();
    const response = await fetch(`${serverURL}passenger/userData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
      userId: data.data._id,
      name: data.data.name,
      email: data.data.email,
      phone: data.data.phone,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}