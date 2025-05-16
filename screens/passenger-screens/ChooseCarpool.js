import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../data-service/firebase";
import Button from "../../components/Button";

const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const RideRequestCard = ({ data, onAccept, onDecline, isWaitingForDriver }) => (
  <View style={styles.card}>
    {isWaitingForDriver ? (
      <View style={styles.waitingContainer}>
        <ActivityIndicator size="large" color="#3B3B98" />
        <Text style={styles.waitingText}>Waiting for a driver...</Text>
      </View>
    ) : data.driverName ? (
      // Show driver details for passenger to accept/decline
      <>
        <View style={styles.detailsContainer}>
          <Text style={styles.driverText}>Driver: {data.driverName}</Text>
          <Text style={styles.carText}>
            {data.car} ({data.carNumber})
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Contact: {data.driverNumber}</Text>
          <Text style={styles.priceText}>
            Pkr.{data.offeredPrice || data.requestFare}
          </Text>
        </View>

        {!data.passengerAccepted && (
          <View style={styles.buttonContainer}>
            <Button
              text="Decline Driver"
              onPress={onDecline}
              style={[styles.button, styles.declineButton]}
              textStyle={styles.buttonText}
            />
            <Button
              text="Accept Driver"
              onPress={onAccept}
              style={[styles.button, styles.acceptButton]}
              textStyle={styles.buttonText}
            />
          </View>
        )}
      </>
    ) : (
      <View style={styles.waitingContainer}>
        <Text style={styles.waitingText}>
          Request cancelled. Please try again.
        </Text>
      </View>
    )}
  </View>
);

const ChooseCarpool = ({ navigation, route }) => {
  const [rideData, setRideData] = useState(route.params.rideData || null);
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(true);
  const rideId = rideData?.id;
  const db = getFirestore(app);

  useEffect(() => {
    findMatchingRide();
  }, []);

  useEffect(() => {
    if (!rideId) return;
  
    const rideRef = doc(db, "AcceptedCarpoolRides", rideId);
  
    const unsubscribe = onSnapshot(rideRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedRide = docSnapshot.data();
        console.log("🔥 Firestore Snapshot Triggered! Updated Ride:", updatedRide);
  
        setRideData(updatedRide);
  
        // Automatically navigate to ongoing screen if driver has accepted
        if (updatedRide.driverAccepted) {
          navigation.navigate("carpool_ongoing", { rideData: { id: rideId, ...updatedRide } });
        }
      } else {
        console.log("❌ Ride not found in AcceptedCarpoolRides.");
      }
    });
  
    return () => unsubscribe();
  }, [rideId]);
  

  // Function to find an existing carpool ride
  const findMatchingRide = async () => {
    try {
      const db = getFirestore(app);

      // 1️⃣ Search for an existing ride within 5km in AcceptedCarpoolRides
      const q = query(
        collection(db, "AcceptedCarpoolRides"),
        where("rideStatus", "==", "ongoing")
      );

      const querySnapshot = await getDocs(q);
      let matchedRide = null;

      querySnapshot.forEach((doc) => {
        const ride = doc.data();
        const distance = getDistance(
          ride.dropoffLatitude,
          ride.dropoffLongitude,
          rideData.dropoffLatitude,
          rideData.dropoffLongitude
        );

        if (distance < 5 && ride.passengerId.length < 4) {
          matchedRide = { id: doc.id, ...ride };
        }
      });

      if (matchedRide) {
        const rideRef = doc(db, "AcceptedCarpoolRides", matchedRide.id);
        await updateDoc(rideRef, {
          passengerId: arrayUnion(rideData.id),
          passengerName: arrayUnion(rideData.name),
          passengerPhone: arrayUnion(rideData.phone),
          fare: arrayUnion(rideData.fare),
          additionalPassengers: matchedRide.additionalPassengers + 1,
        });

        Alert.alert("🚗 Matched!", "You have been added to an ongoing ride.");
        navigation.navigate("carpool_ongoing", { rideData: matchedRide });
        return;
      } 
      else {
        // Create a new ride request
        const newRide = {
          ...rideData,
          rideStatus: "pending",
          fare: [rideData.fare],
          additionalPassengers: rideData.additionalPassengers + 1
        };
        const docRef = await addDoc(collection(db, "CarpoolRides"), newRide);
        newRide.id = docRef.id;
        setRideData(newRide);
        Alert.alert(
          "New Ride Created!",
          "No existing ride found. A new ride request has been created."
        );
      }
    } catch (error) {
      console.error("Error finding or creating ride:", error.message);
    }
  };

  // Function to accept the driver
  const handleAcceptDriver = async () => {
    if (rideData?.id) {
      const rideRef = doc(db, "CarpoolRides", rideData.id);
      await updateDoc(rideRef, { passengerAccepted: true });
      setIsWaitingForDriver(false);
      Alert.alert("Ride Accepted", "You have accepted the driver.");
    }
  };

  // Function to decline the driver
  const handleDeclineDriver = async () => {
    if (rideData?.id) {
      const rideRef = doc(db, "CarpoolRides", rideData.id);
      await updateDoc(rideRef, { passengerAccepted: false });
      setIsWaitingForDriver(true);
      Alert.alert("Ride Declined", "You have declined the driver.");
    }
  };

  // Function to cancel the ride request
  const handleCancelRequest = async () => {
    if (rideData?.id) {
      await deleteDoc(doc(db, "CarpoolRides", rideData.id));
      Alert.alert("Ride Canceled", "Your ride request has been canceled.");
      navigation.goBack();
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isWaitingForDriver ? "Waiting for Driver" : "Choose Driver"}
        </Text>
      </View>

      <FlatList
        data={rideData ? [rideData] : []}
        keyExtractor={(item) => item.driverName || "waiting"}
        renderItem={({ item }) => (
          <RideRequestCard
            data={item}
            onAccept={handleAcceptDriver}
            onDecline={handleDeclineDriver}
            isWaitingForDriver={isWaitingForDriver}
          />
        )}
        contentContainerStyle={styles.container}
      />

      {isWaitingForDriver && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelRequest}
        >
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F3F4F6",
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    height: 45,
    backgroundColor: "#3B3B98",
    borderRadius: 6,
  },
  backButton: {
    marginRight: 15,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EDE9F6",
    marginLeft: 75,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 150,
  },
  waitingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  waitingText: {
    fontSize: 16,
    color: "#374151",
    marginTop: 10,
    textAlign: "center",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  driverText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "bold",
  },
  carText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  declineButton: {
    backgroundColor: "#EF4444",
  },
  acceptButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChooseCarpool;
