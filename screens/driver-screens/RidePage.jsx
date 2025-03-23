import React, { useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { globalColors } from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDriverData } from "../../context/DriverContext";

const { height: screenHeight } = Dimensions.get("window");

const RidePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const animatedHeight = useRef(new Animated.Value(screenHeight * 0.5)).current;
  const { driverDetails } = useDriverData();

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
      await AsyncStorage.setItem("Driver_Latitude", "31.4800906");
      await AsyncStorage.setItem("Driver_Longitude", "74.2980626");
    })();
  }, []);

  function navigationHandler() {
    if (isOnline) {
      navigation.navigate("requests", { data: driverDetails });
    }
  }

  function checkCarpoolRidesHandler() {
    if (isOnline) {
      navigation.navigate("carpool_requests", {
        driverLocation: {
          latitude: 31.4800906,
          longitude: 74.2980626,
        },
        data: driverDetails,
      });
    }
  }

  if (!location) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Online/Offline Button */}
      <View style={styles.onlineStatusContainer}>
        <TouchableOpacity
          style={[styles.onlineButton, { backgroundColor: isOnline ? "green" : "red" }]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={styles.buttonText}>{isOnline ? "Online" : "Offline"}</Text>
        </TouchableOpacity>
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
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
        />
      </MapView>

      {/* Incoming ride and Check Carpool Rides buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.doneButton, { opacity: isOnline ? 1 : 0.5 }]}
          onPress={navigationHandler}
          disabled={!isOnline}
        >
          <Text style={styles.buttonText}>Incoming Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.doneButton, { opacity: isOnline ? 1 : 0.5 }]}
          onPress={checkCarpoolRidesHandler}
          disabled={!isOnline}
        >
          <Text style={styles.buttonText}>Check Carpool Rides</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  onlineStatusContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  onlineButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default RidePage;