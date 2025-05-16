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
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { globalColors } from "../../constants/colors";
import { doc, getDoc, updateDoc, onSnapshot , setDoc } from "firebase/firestore";
import { db } from "../../data-service/firebase";
import { GOOGLE_API_KEY } from "@env";
import { getBackendUrl } from "../../constants/ipConfig";
import { Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";
import getCoordinates from "../../data-service/helper";
import axios from "axios";

const { height: screenHeight } = Dimensions.get("window");

const serverURL = getBackendUrl();

const RideDetails = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rideData, setRideData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]); // State for polyline coordinates
  const { rideId } = route.params;
  const animatedHeight = useRef(new Animated.Value(screenHeight * 0.5)).current;
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

  // This fetches the ride data and optimized path using google's API
  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const rideDocRef = doc(db, "Rides", rideId);
        const rideDocSnap = await getDoc(rideDocRef);

        if (rideDocSnap.exists()) {
          // console.log("Ride data:", rideDocSnap.data());
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

    if (rideId) {
      fetchRideData();
    }
  }, [rideId]);
  // add the vehicles location in the firestore db
  useEffect(() => {
    if (!rideData || !rideId) return;

    // Only track if ride is ongoing
    const isOngoing = ["accepted", "started", "in-progress"].includes(
      rideData.status
    );
    let locationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // update every 5 seconds
          distanceInterval: 10, // or every 10 meters
        },
        async (loc) => {
          const coords = loc.coords;
          setLocation(coords);

          try {
            await setDoc(
              doc(db, "LiveLocations", rideId),
              {
                latitude: coords.latitude,
                longitude: coords.longitude,
                timestamp: new Date(),
              },
              { merge: true }
            );
          } catch (error) {
            console.error("Error updating live location:", error);
          }
        }
      );
    };
    startTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [rideData, rideId]);
  // useEffect to fetch the vehicle latitude and longitude
  useEffect(() => {
    const unsubscribe = rideId
      ? onSnapshot(doc(db, "LiveLocations", rideId), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setVehicleLocation({
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        })
      : () => {};

    return () => unsubscribe();
  }, [rideId]);
  // useEffect to send vehicles latitude and longitude to the firestore
  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Watch location continuously
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 seconds
          distanceInterval: 10, // or every 10 meters
        },
        (loc) => {
          const coords = loc.coords;
          setLocation(coords); // update local state

          // Push to Firestore
          const rideDocRef = doc(db, "LiveLocations", rideId);
          updateDoc(rideDocRef, {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: new Date(),
          }).catch((error) => {
            console.error("Error updating live location:", error);
          });
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [rideId]);
  // useEffect to fetch the location
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

  const openGoogleMaps = () => {
  if (rideData?.requestDestination && rideData?.requestOrigin) {
    const origin = encodeURIComponent(rideData.requestOrigin);
    const destination = encodeURIComponent(rideData.requestDestination);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    Linking.openURL(googleMapsUrl);
  } else {
    Alert.alert("Error", "Origin or destination not available");
  }
};

  // Navigation Function
  function returnToHomepage() {
    const cancelRide = async () => {
      try {
        const rideDocRef = doc(db, "Rides", rideId);
        await updateDoc(rideDocRef, {
          status: "cancelled",
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
  // Helper function to finish the ride
  function finishRideHandler(rideId) {
    const updateRideStatus = async () => {
      try {
        const rideDocRef = doc(db, "Rides", rideId);
        const rideSnapshot = await getDoc(rideDocRef);
        if (!rideSnapshot.exists()) {
          throw new Error("Ride not found!");
        }

        const updatedRide = {
          ...rideSnapshot.data(),
          status: "completed",
          completedAt: new Date(),
        };

        // Update the ride in Firestore
        await updateDoc(rideDocRef, {
          status: "completed",
          completedAt: updatedRide.completedAt,
        });
        // Send a POST request to the API
        const response = await axios.post(
          `${serverURL}singleRide/addDetailToDB`,
          updatedRide
        );

        if (response.status === 201) {
          Alert.alert("Ride Finished Successfully!");
          navigation.replace("Home");
        } else {
          throw new Error("Failed to save ride to the server");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    updateRideStatus();
  }
  // Helper function to check for new requests
  function checkNewRequestsHandler() {
    navigation.navigate("carpool_requests");
  }
  // Conditionals to display in case of errors
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
          style={styles.checkRequestsButton}
          onPress={returnToHomepage}
        >
          <Text style={styles.checkRequestsText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>OTP: {rideData.rideOTP}</Text>
      </View>

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
        {vehicleLocation && (
          <Marker
            coordinate={vehicleLocation}
            title="Vehicle"
            pinColor="blue"
          />
        )}
      </MapView>

      <Animated.View
        style={[styles.detailsContainer, { height: animatedHeight }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
            <Text style={styles.mapButtonText}>Map</Text>
          </TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.heading}>
              {rideData?.requestType === "single" ? "Single" : "Carpool"} Ride
              Details
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Pickup Location"
              value={rideData?.requestOrigin || "No pickup address"}
              editable={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Drop off Location"
              value={rideData?.requestDestination || "No dropoff address"}
              editable={false}
            />
            <View style={styles.infoRow}>
              <Text style={styles.label}>PKR</Text>
              <Text style={styles.value}>{rideData?.requestFare || "0"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Psgs.</Text>
              <Text style={styles.value}>
                {rideData?.requestType === "single" ? "1" : rideData?.passenger}{" "}
                people
              </Text>
            </View>

            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={[
                  styles.checkRequestsButton,
                  styles.customBtn,
                  styles.accept,
                  rideData?.requestType === "single"
                    ? styles.fullWidthBtn
                    : null,
                ]}
                onPress={() => finishRideHandler(rideId)}
              >
                <Text style={styles.checkRequestsText}>Finish Ride</Text>
              </TouchableOpacity>

              {rideData?.requestType !== "single" && (
                <TouchableOpacity
                  style={[styles.checkRequestsButton, styles.customBtn]}
                  onPress={checkNewRequestsHandler}
                >
                  <Text style={styles.checkRequestsText}>
                    Check new requests
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.checkRequestsButton, styles.cancel]}
              onPress={returnToHomepage}
            >
              <Text style={styles.checkRequestsText}>Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  customBtn: {
    width: "45%",
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#eae8fe",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#000",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#365df2",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
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
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  checkRequestsButton: {
    backgroundColor: "#365df2",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "black",
  },
  checkRequestsText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  cancel: {
    backgroundColor: "red",
  },
  accept: {
    backgroundColor: "green",
  },
  mapButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#365df2",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 9999, // Ensure it's above all elements
    elevation: 10, // Helps on Android
    borderWidth: 2,
    borderColor: "black",
  },
  mapButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  otpContainer: {
    position: "absolute",
    top: 40,
    right: 16,
    backgroundColor: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  otpText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RideDetails;
