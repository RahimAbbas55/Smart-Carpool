import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { globalColors } from "../../constants/colors";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../data-service/firebase";
import CarpoolRideCard from "../../components/CarpoolRideCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CarpoolRequests({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const db = getFirestore(app);
  const [driverLocation, setDriverLocation] = useState(null);
  const { data } = route.params || {};

  useEffect(() => {
    async function fetchDriverLocation() {
      const latitude = await AsyncStorage.getItem("Driver_Latitude");
      const longitude = await AsyncStorage.getItem("Driver_Longitude");
      if (latitude && longitude) {
        setDriverLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
      }
    }
    fetchDriverLocation();
  }, []);

  useEffect(() => {
    if (!driverLocation) return;

    const unsubscribe = onSnapshot(
      collection(db, "CarpoolRides"),
      (snapshot) => {
        const allRequests = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));

        const filteredRequests = allRequests.filter(
          (ride) =>
            (ride.rideStatus === "pending" || ride.rideStatus === "ongoing")
            // isWithin5Km(
            //   driverLocation.latitude,
            //   driverLocation.longitude,
            //   ride.passengerCurrentLocationLatitude,
            //   ride.passengerCurrentLocationLongitude
            // )
        );
        console.log('carpool requests of driver' , filteredRequests)
        setRequests(filteredRequests);
      }
    );

    return () => unsubscribe();
  }, [driverLocation]);

  function backNavigation() {
    navigation.goBack();
  }

  async function acceptNavigation(id) {
    try {
      const rideRef = doc(db, "CarpoolRides", id);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        console.log("❌ Ride not found!");
        return;
      }

      const rideData = rideSnap.data();
      const maxCapacity = 4;

      if (rideData.currentPassengers >= maxCapacity) {
        console.log("⚠️ Ride is already full!");
        return;
      }

      // Move ride to AcceptedCarpoolRides
      const acceptedRideRef = doc(db, "AcceptedCarpoolRides", id);
      await setDoc(acceptedRideRef, {
        ...rideData,
        rideStatus: "ongoing",
        driverAccepted: true,
        carType: data?.carType,
        driverId: data?.id,
        driverPhone: data?.driverPhone,
        driverFirstName: data?.firstName,
        driverLastName: data?.lastName,
        licensePlate: data?.licensePlate,
        vehicle: data?.vehicle,
        vehicleType: data?.vehicleType,
      });
      await updateDoc(rideRef , {
        rideStatus: true
      })

      Alert.alert("Ride accepted successfully!");
      navigation.navigate("carpoolridedetails", { data: id });
    } catch (error) {
      console.error("❌ Error accepting ride:", error);
    }
  }

  return (
    <>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Incoming Carpool Ride Requests</Text>
      </View>

      <FlatList
        style={styles.container}
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CarpoolRideCard
            data={{ ...item, id: item._id }}
            onAccept={() => acceptNavigation(item._id)}
            onReject={backNavigation}
          />
        )}
      />
    </>
  );
}

function isWithin5Km(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return false;

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= 5;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: globalColors.lavender,
    marginBottom: 10,
  },
  headingView: {
    backgroundColor: globalColors.lavender,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 10,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});
