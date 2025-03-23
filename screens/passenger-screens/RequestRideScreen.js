import "react-native-get-random-values";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { getUserData } from "../../data-service/auth";
import { GOOGLE_API_KEY } from "@env";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker , Polyline} from "react-native-maps";
import polyline from '@mapbox/polyline';
import * as Location from "expo-location";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import getCoordinates from "../../data-service/helper";

const { width, height } = Dimensions.get("window");

const RequestRideScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeMode, setActiveMode] = useState("Carpool");
  const [selectedRideOption, setSelectedRideOption] = useState(null);
  const [pickup, setPickup] = useState(null); 
  const [dropoff, setDropoff] = useState(null); 
  const [fare, setFare] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null); 
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [ userData , setUserData ] = useState(null);

  // useEffect to fetch the current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "Permission to access location was denied");
        return;
      }
      
      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High 
        });
        // console.log("Location obtained:", location); // Debug log
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error("Error getting current location:", error);
        Alert.alert("Location Error", "Could not retrieve your current location.");
      }
    })();
  }, []);

  // useEffect to fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        }
    };
    fetchUserData();
  }, []);

  // useEffect to fetch the coords of pickup and dropoff
  useEffect(() => {
    const fetchCoord = async () => {
      if (dropoff && pickup) {
        try {
          const pickupLocation = await getCoordinates(pickup, GOOGLE_API_KEY);
          const dropoffLocation = await getCoordinates(dropoff, GOOGLE_API_KEY);
          
          if (!pickupLocation) {
            console.warn('Could not find coordinates for pickup location');
            return;
          }
          
          if (!dropoffLocation) {
            console.warn('Could not find coordinates for dropoff location');
            return;
          }
          setPickupCoords({
            latitude: pickupLocation.latitude,
            longitude: pickupLocation.longitude
          });
          
          setDropoffCoords({
            latitude: dropoffLocation.latitude,
            longitude: dropoffLocation.longitude
          });
          if (pickupCoords && dropoffCoords) {
            const coordinates = await getRoute(pickupCoords, dropoffCoords);
            if (coordinates.length > 0) {
              setRouteCoordinates(coordinates);
            }
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
          Alert.alert(
            'Error',
            'Could not get location coordinates. Please try again.'
          );
        }
      }
    };
    fetchCoord();
  }, [pickup, dropoff]);

  // useEffect to dynamically fetch the right fare amount
  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      (async () => {
        const coordinates = await getRoute(pickupCoords, dropoffCoords);
        if (coordinates.length > 0) {
          setRouteCoordinates(coordinates);
        }
        await calculateFare(pickupCoords, dropoffCoords); // Now fare updates dynamically
      })();
    }
  }, [pickupCoords, dropoffCoords]);

  const getRoute = async (pickupCoords, dropoffCoords) => {
    const origin = `${pickupCoords.latitude},${pickupCoords.longitude}`;
    const destination = `${dropoffCoords.latitude},${dropoffCoords.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY }`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const coordinates = points.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
  
        return coordinates;
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      return [];
    }
  };

  const calculateFare = async (pickupCoords, dropoffCoords) => {
    const origin = `${pickupCoords.latitude},${pickupCoords.longitude}`;
    const destination = `${dropoffCoords.latitude},${dropoffCoords.longitude}`;
    console.log("Calculating fare for:", pickupCoords, dropoffCoords);
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.rows.length > 0 && data.rows[0].elements.length > 0) {
        const distanceInMeters = data.rows[0].elements[0].distance.value; // Distance in meters
        const distanceInKm = distanceInMeters / 1000; // Convert to km

        // Example Fare Calculation Formula
        const baseFare = 100; // Base fare in PKR
        const perKmRate = 50; // Rate per km in PKR
        const estimatedFare = baseFare + perKmRate * distanceInKm;

        setFare(estimatedFare.toFixed(0)); // Round to nearest PKR
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
    }
  };

  const handleNextPress = () => {
    if (!pickup || !dropoff || !fare || !selectedRideOption || !currentLocation) {
      Alert.alert(
        "Error",
        "Please fill out all fields, select a ride option, and allow location access."
      );
      return;
    }
    const rideData = {
      passengerId: [userData.userId],
      passengerName: [userData.name],
      passengerPhone: [userData.phone],
      mode: activeMode,
      rideType: selectedRideOption,
      pickup,
      dropoff,
      fare,
      passengerCurrentLocationLatitude: currentLocation.latitude,
      passengerCurrentLocationLongitude: currentLocation.longitude
    };
    if (activeMode === "Carpool") {
      navigation.navigate("CarpoolRide", { rideData });
    } else {
      navigation.navigate("SingleRide", { rideData });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Menu" , { data : userData })}
        style={styles.menuIcon}
      >
        <MaterialIcons name="menu" size={30} color="black" />
      </TouchableOpacity>
     <View style={styles.mapContainer}>
        {currentLocation ? (
          <MapView
            ref={(ref) => ref && pickupCoords && dropoffCoords && ref.fitToCoordinates([pickupCoords, dropoffCoords], { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true })}
            style={StyleSheet.absoluteFillObject}
            initialRegion={currentLocation}
          >
            <Marker coordinate={currentLocation} title="Current Location" />
            {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup Location" pinColor="green" />}
            {dropoffCoords && <Marker coordinate={dropoffCoords} title="Dropoff Location" pinColor="red" />}
            {routeCoordinates.length > 0 && <Polyline coordinates={routeCoordinates} strokeWidth={3} strokeColor="#1E40AF" />} 
          </MapView>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.rideOptionsContainer}
        showsHorizontalScrollIndicator={false}
      >
        {[
          { id: "ac", label: "Ride A/C", iconName: "air" },
          { id: "economy", label: "Economy", iconName: "directions-car" },
          { id: "rickshaw", label: "Rickshaw", iconName: "local-taxi" },
          { id: "bike", label: "Bike", iconName: "pedal-bike" },
        ].filter(option => activeMode === "carpool" ? ["ac", "economy"].includes(option.id) : true)
        .map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.rideOption,
              selectedRideOption === option.id && styles.selectedRideOption,
            ]}
            onPress={() => setSelectedRideOption(option.id)}
          >
            <MaterialIcons
              name={option.iconName}
              size={25}
              color={selectedRideOption === option.id ? "#1E40AF" : "#374151"}
            />
            <Text
              style={[
                styles.rideLabel,
                selectedRideOption === option.id && styles.selectedRideLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.modeToggleContainer}>
        {["Carpool", "Single"].map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.checkboxContainer,
              activeMode === mode && styles.checked,
            ]}
            onPress={() => setActiveMode(mode)}
          >
            <Text
              style={[
                styles.checkboxLabel,
                activeMode === mode && styles.activeCheckboxLabel,
              ]}
            >
              {mode} Mode
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          placeholder="Enter Pickup Location"
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 16,
              paddingVertical: 10,
            },
          }}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            // const location = {
            //   latitude: details.geometry.location.lat,
            //   longitude: details.geometry.location.lng,
            //   description: data.description,
            // };
            // dispatch(setOrigin(location.description));
            setPickup(data.description);
          }}
        />

        <GooglePlacesAutocomplete
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          placeholder="Enter Drop Off Location"
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 16,
              paddingVertical: 10,
            },
          }}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            // const location = {
            //   latitude: details.geometry.location.lat,
            //   longitude: details.geometry.location.lng,
            //   description: data.description,
            // };
            // dispatch(setDestination(location));
            // setDestination({
            //   latitude: details.geometry.location.lat,
            //   longitude: details.geometry.location.lng,
            // });
            setDropoff(data.description); 
          }}
        />
        <InputField
          placeholder="Offer your fare in PKR"
          keyboardType="numeric"
          value={fare}
          onChangeText={(text) => setFare(text)}
        />
      </View>
      <View style={styles.button}>
        <Button text="Next" onPress={handleNextPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  mapContainer: {
    flex: 8,
    marginBottom: height * 0.02,
  },
  rideOptionsContainer: {
    flexDirection: "row",
    paddingHorizontal: width * 0.04,
    marginVertical: height * 0.01,
  },
  rideOption: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: width * 0.03,
    padding: width * 0.03,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },
  selectedRideOption: {
    backgroundColor: "#BFDBFE",
  },
  rideLabel: {
    marginTop: height * 0.005,
    fontSize: width * 0.035,
    color: "#374151",
  },
  selectedRideLabel: {
    color: "#1E40AF",
    fontWeight: "bold",
  },
  modeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.01,
  },
  checkboxContainer: {
    padding: width * 0.03,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  checked: {
    backgroundColor: "#BFDBFE",
  },
  checkboxLabel: {
    fontSize: width * 0.04,
    color: "#374151",
  },
  activeCheckboxLabel: {
    color: "#1E40AF",
    fontWeight: "bold",
  },
  inputContainer: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  menuIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.03 : height * 0.02,
    left: width * 0.03,
    zIndex: 1,
  },
  button: {
    width: width * 0.9,
    marginHorizontal: width * 0.09,
  },
});

export default RequestRideScreen;