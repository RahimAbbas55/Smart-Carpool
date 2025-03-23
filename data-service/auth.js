import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBackendUrl } from "../constants/ipConfig";

const serverURL = getBackendUrl();
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
      password: data.data.password,
      gender: data.data.gender,
      wallet: data.data.wallet,
      imageUrl: data.data.imageUrl,
      rating: data.data.rating
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// fetch driver data
export async function getDriverdata(id) {
  if (!id) {
    console.log('Id not available')
    return;
  }
  try {
    const response = await fetch(`${serverURL}driver/getDriverDetails?passengerId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching driver data:', errorData.message);
      return null;
    }
    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error('Network error while fetching driver data:', error.message);
    return null;
  }
}