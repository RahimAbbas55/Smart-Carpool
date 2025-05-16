import { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
  Modal,
  ToastAndroid,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { globalColors } from "../../constants/colors";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../data-service/firebase";
import { GOOGLE_API_KEY } from "@env";
import * as Location from "expo-location";
import getCoordinates from "../../data-service/helper";

const { height: screenHeight } = Dimensions.get("window");

const CarpoolRideDetail = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [allPassengers, setAllPassengers] = useState([]);
  const animatedHeight = useRef(new Animated.Value(screenHeight * 0.5)).current;
  const { data } = route.params;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy < 0) {
          Animated.timing(animatedHeight, {
            toValue: screenHeight * 0.25,
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else if (gestureState.dy > 0) {
          Animated.timing(animatedHeight, {
            toValue: screenHeight * 0.5,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  // This fetches the ride data and optimized path using google's API
  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const rideDocRef = doc(db, "AcceptedCarpoolRides", data);
        const rideDocSnap = await getDoc(rideDocRef);

        if (rideDocSnap.exists()) {
          console.log("Ride data:", rideDocSnap.data());
          const rideDataObj = rideDocSnap.data();
          setRideData(rideDataObj);

          if (rideDataObj.requestOrigin && rideDataObj.requestDestination) {
            try {
              const optimizedRoute = await getDirections(
                rideDataObj.requestOrigin,
                rideDataObj.requestDestination,
                GOOGLE_API_KEY
              );

              setRouteCoordinates(optimizedRoute);
            } catch (directionsError) {
              console.error("Error getting directions:", directionsError);
              try {
                const originCoords = await getCoordinates(
                  rideDataObj.requestOrigin,
                  GOOGLE_API_KEY
                );
                const destCoords = await getCoordinates(
                  rideDataObj.requestDestination,
                  GOOGLE_API_KEY
                );
                setRouteCoordinates([originCoords, destCoords]);
              } catch (error) {
                console.error("Error getting coordinates:", error);
              }
            }
          }
        } else {
          console.log("No such ride document!");
          setErrorMsg("Ride not found");
        }
      } catch (error) {
        console.error("Error fetching ride data:", error);
        setErrorMsg("Error fetching ride data");
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      fetchRideData();
    }
  }, [data]);

  // Navigation Function
  function returnToHomepage() {
    const cancelRide = async () => {
      try {
        const rideDocRef = doc(db, "AcceptedCarpoolRides", data);
        await updateDoc(rideDocRef, {
          rideStatus: "cancelled",
          cancelledAt: new Date(),
        });
        Alert.alert("Ride Cancelled Successfully!");
        navigation.replace("drawer");
      } catch (error) {
        console.error("Driver: Error cancelling ride:", error);
      }
    };
    cancelRide();
  }

  function finishRideHandler() {
    const updateRideStatus = async () => {
      try {
        const rideDocRef = doc(db, "AcceptedCarpoolRides", data);
        await updateDoc(rideDocRef, {
          rideStatus: "completed",
          completedAt: new Date(),
        });
        Alert.alert("Ride Finished Successfully!");
        navigation.replace("drawer");
      } catch (error) {
        console.error("Driver: Error completing ride:", error);
      }
    };
    updateRideStatus();
  }

 const showPassengerDetails = async () => {
  try {
    const docRef = doc(db, "AcceptedCarpoolRides", data);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const ride = docSnap.data();

      console.log("Ride data:", ride); // 🔍 Debugging

      const passengerNames = Array.isArray(ride.passengerName)
        ? ride.passengerName
        : ride.passengerName
        ? [ride.passengerName]
        : [];

      const pickups = Array.isArray(ride.pickup) ? ride.pickup : [ride.pickup];
      const dropoffs = Array.isArray(ride.dropoff) ? ride.dropoff : [ride.dropoff];
      const fares = Array.isArray(ride.fare) ? ride.fare : [ride.fare];

      const passengers = passengerNames.map((name, index) => ({
        name: name || "N/A",
        pickup: pickups[index] ?? pickups[0] ?? "N/A",   // fallback to first or N/A
        dropoff: dropoffs[index] ?? dropoffs[0] ?? "N/A",
        fare: fares[index] ?? fares[0] ?? "N/A",
      }));

      setAllPassengers(passengers);
      setDetailsVisible(true);
    } else {
      Alert.alert("No data found");
    }
  } catch (error) {
    console.error("Error fetching passenger details:", error);
    Alert.alert("Error fetching details");
  }
};


  function checkNewRequestsHandler() {
    // if (!rideData || !rideData.dropoffLocation) {
    //   Alert.alert("No New Ride Requests!");
    //   return;
    // }

    const fetchAndFilterRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "CarpoolRides"));
        let found = null;

        querySnapshot.forEach((docSnap) => {
          const request = docSnap.data();
          console.log("fetched request", request);
          if (
            request.dropoff
            && request.rideStatus === "pending"
            // &&
            // isWithin5Km(
            //   parseFloat(AsyncStorage.getItem("Driver_Latitude")),
            //   parseFloat(AsyncStorage.getItem("Driver_Longitude")),
            //   request.passengerCurrentLocationLatitude,
            //   request.passengerCurrentLocationLongitude
            // )
          ) {
            found = { id: docSnap.id, ...request };
          }
        });

        if (found) {
          setSelectedPassenger({
            passengerName: found.passengerName?.[0],
            passengerPhone: found.passengerPhone?.[0],
            pickup: found.pickup,
            dropoff: found.dropoff,
            fare: found.fare?.[0],
          });
          setModalVisible(true);
        } else {
          Alert.alert("No nearby ride requests found.");
        }
      } catch (error) {
        console.error("Error fetching ride requests:", error);
        Alert.alert("Error fetching new ride requests");
      }
    };

    fetchAndFilterRequests();
  }

  function handleAccept() {
    const addPassengerToCarpool = async () => {
      try {
        const acceptedDocRef = doc(db, "AcceptedCarpoolRides", data);

        await updateDoc(acceptedDocRef, {
          passengerName: arrayUnion(selectedPassenger.passengerName),
          passengerPhone: arrayUnion(selectedPassenger.passengerPhone),
          pickup: arrayUnion(selectedPassenger.pickup),
          dropoff: arrayUnion(selectedPassenger.dropoff),
          fare: arrayUnion(selectedPassenger.fare.toString()),
          updatedAt: new Date(),
        });

        ToastAndroid.show(
          "Passenger Added to your carpool",
          ToastAndroid.SHORT
        );
      } catch (error) {
        console.error("Error adding passenger to carpool:", error);
        Alert.alert("Failed to add passenger");
      } finally {
        setModalVisible(false);
      }
    };
    addPassengerToCarpool();
  }

  function handleReject() {
    setModalVisible(false);
    ToastAndroid.show("Passenger Rejected", ToastAndroid.SHORT);
  }

  if (loading || !location) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={returnToHomepage}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapView
        {...panResponder.panHandlers}
        style={styles.mapView}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {rideData && rideData.pickupLocation && (
          <Marker
            coordinate={{
              latitude: rideData.pickupLocation.latitude,
              longitude: rideData.pickupLocation.longitude,
            }}
            title="Pickup Location"
            pinColor="green"
          />
        )}
        {rideData && rideData.dropoffLocation && (
          <Marker
            coordinate={{
              latitude: rideData.dropoffLocation.latitude,
              longitude: rideData.dropoffLocation.longitude,
            }}
            title="Dropoff Location"
            pinColor="red"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={4}
            strokeColor="#365df2"
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      <Animated.View
        style={[styles.detailsContainer, { height: animatedHeight }]}
      >
        <View contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.heading}>Carpool Ride Details</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Psgs.</Text>
              <Text style={styles.value}>{rideData.passengerName.length} passenger</Text>
            </View>

            <View style={styles.btnContainer}>
              {/* Finish Ride Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.customBtn,
                  styles.successBtn,
                ]}
                onPress={finishRideHandler}
              >
                <Text style={styles.buttonText}>Finish Ride</Text>
              </TouchableOpacity>
              {/* Check New Passenger Button */}
              <TouchableOpacity
                style={[styles.button, styles.customBtn, styles.primaryBtn]}
                onPress={checkNewRequestsHandler}
              >
                <Text style={styles.buttonText}>Check new requests</Text>
              </TouchableOpacity>
              
            </View>
            <TouchableOpacity
                style={[styles.button, styles.infoBtn]}
                onPress={showPassengerDetails}
              >
                <Text style={styles.buttonText}>Show Details</Text>
              </TouchableOpacity>
              {/* Cancel Ride Button  */}
            <TouchableOpacity
              style={[styles.button, styles.dangerBtn]}
              onPress={returnToHomepage}
            >
              <Text style={styles.buttonText}>Cancel Ride</Text>
            </TouchableOpacity>
            {/* Check New Passengers Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalHeading}>New Ride Request</Text>
                  </View>
                  {selectedPassenger && (
                    <View style={styles.passengerInfoContainer}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Passenger Name:</Text>
                        <Text style={styles.infoValue}>{selectedPassenger.passengerName}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>{selectedPassenger.passengerPhone}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Pickup:</Text>
                        <Text style={styles.infoValue}>{selectedPassenger.pickup}</Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Dropoff:</Text>
                        <Text style={styles.infoValue}>{selectedPassenger.dropoff}</Text>
                      </View>
                      <View style={styles.fareContainer}>
                        <Text style={styles.fareLabel}>Fare:</Text>
                        <Text style={styles.fareValue}>PKR {selectedPassenger.fare}</Text>
                      </View>
                    </View>
                  )}
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.acceptButton]}
                      onPress={handleAccept}
                    >
                      <Text style={styles.modalButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.rejectButton]}
                      onPress={handleReject}
                    >
                      <Text style={styles.modalButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={detailsVisible}
              onRequestClose={() => setDetailsVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.detailsModalContent}>
                  <Text style={styles.modalHeading}>
                    Carpool Passenger Details
                  </Text>
                  {allPassengers.length === 0 ? (
                    <Text style={styles.noPassengersText}>
                      No passengers added yet.
                    </Text>
                  ) : (
                    allPassengers.map((passenger, idx) => (
                      <View key={idx} style={styles.passengerCard}>
                        <Text style={styles.passengerText}>
                          Name: {passenger.name}
                        </Text>
                        <Text style={styles.passengerText}>
                          Pickup: {passenger.pickup}
                        </Text>
                        <Text style={styles.passengerText}>
                          Dropoff: {passenger.dropoff}
                        </Text>
                        <Text style={styles.passengerText}>
                          Fare: PKR {passenger.fare}
                        </Text>
                      </View>
                    ))
                  )}
                  <TouchableOpacity
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setDetailsVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

// Helper Function
async function getDirections(origin, destination, apiKey) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch directions");
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Directions request failed: ${data.status}`);
    }

    // Decode the polyline points from the response
    const points = data.routes[0].overview_polyline.points;
    return decodePoly(points);
  } catch (error) {
    console.error("Error getting directions:", error);
    throw error;
  }
}
function decodePoly(encoded) {
  let poly = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return poly;
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
    backgroundColor: "#fff",
  },
  mapView: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  customBtn: {
    width: "48%",
  },
  fullWidthBtn: {
    width: "100%",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: globalColors.violetBlue,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#eae8fe",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2e4bb8",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: "#365df2",
  },
  successBtn: {
    backgroundColor: "#2ea84f",
  },
  dangerBtn: {
    backgroundColor: "#e53935",
    marginTop: 10
  },
  infoBtn: {
    backgroundColor: "#0097a7",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    backgroundColor: "#365df2",
    padding: 15,
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  passengerInfoContainer: {
    padding: 20,
    backgroundColor: "#f8f9ff",
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    width: "35%",
  },
  infoValue: {
    fontSize: 15,
    color: "#444",
    width: "65%",
    flexWrap: "wrap",
  },
  fareContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f0ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#365df2",
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginRight: 10,
  },
  fareValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#365df2",
  },
  modalButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalButton: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#2ea84f",
    borderRightWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  rejectButton: {
    backgroundColor: "#e53935",
    borderLeftWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  closeButton: {
    backgroundColor: "#365df2",
    marginTop: 10,
    borderRadius: 8,
    width: "80%",
    alignSelf: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
  },
  detailsModalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  passengerCard: {
    width: "100%",
    backgroundColor: "#f5f8ff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#c0d0ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  passengerText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  noPassengersText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
    marginVertical: 20,
    textAlign: "center",
  },
});

export default CarpoolRideDetail;