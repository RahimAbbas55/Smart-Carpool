import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View , Linking} from 'react-native';
import { GOOGLE_API_KEY } from "@env";
import { db } from '../../data-service/firebase';
import * as Location from 'expo-location';
import { doc, onSnapshot} from '@firebase/firestore';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import getCoordinates from '../../data-service/helper';

const getDirections = async (origin, destination, apiKey) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch directions');
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Directions request failed: ${data.status}`);
    }
    
    // Decode the polyline
    const points = decodePolyline(data.routes[0].overview_polyline.points);
    return points;
  } catch (error) {
    console.error('Error getting directions:', error);
    throw error;
  }
};

const decodePolyline = (encoded) => {
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;
    
    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;
    
    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5
    });
  }
  
  return points;
};

const CarpoolOngoingRideScreen = ({ navigation, route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const data = route.params;

  console.log(data)
  
  // Location useEffect
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
      
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location Error', 'Permission to access location was denied.');
          return;
        }
      
        let location = await Location.getCurrentPositionAsync({});
        const currentCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentCoords);
      
        const pickupLocation = data.pickup || data.requestOrigin;
        const pickupCoordinates = await getCoordinates(pickupLocation, GOOGLE_API_KEY);
        setPickupCoords(pickupCoordinates);
      
        const dropoffLocation = data.dropoff || data.requestDestination;
        const dropoffCoordinates = await getCoordinates(dropoffLocation, GOOGLE_API_KEY);
        setDropoffCoords(dropoffCoordinates);
      
        const routePoints = await getDirections(pickupCoordinates, dropoffCoordinates, GOOGLE_API_KEY);
        setRouteCoordinates(routePoints);
      
        calculateMapRegion(pickupCoordinates, dropoffCoordinates, routePoints);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching locations:', error);
        Alert.alert('Error', 'Failed to get location coordinates or directions. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchLocations();
  }, [data]);

  // Listen for when the ride is completed
  useEffect(() => {
    if (!data.rideId) return; 
  
    const rideRef = doc(db, 'Rides', data.rideId); // Adjust collection name if needed
  
    const unsubscribe = onSnapshot(rideRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const rideData = docSnapshot.data();
        if (rideData.status === "completed") {
          navigation.replace('Review', { rideData: rideData });
        }
      }
    });
  
    return () => unsubscribe();
  }, [data.rideId, navigation]);

  const calculateMapRegion = (pickup, dropoff, routePoints = []) => {
    let minLat = Math.min(pickup.latitude, dropoff.latitude);
    let maxLat = Math.max(pickup.latitude, dropoff.latitude);
    let minLng = Math.min(pickup.longitude, dropoff.longitude);
    let maxLng = Math.max(pickup.longitude, dropoff.longitude);
    

    if (routePoints.length > 0) {
      routePoints.forEach(point => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
    }
  
    const PADDING = 0.1;
    const latDelta = (maxLat - minLat) * (1 + PADDING);
    const lngDelta = (maxLng - minLng) * (1 + PADDING);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    const minDelta = 0.01;
    
    setMapRegion({
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, minDelta),
      longitudeDelta: Math.max(lngDelta, minDelta),
    });
  };

  // Navigation Functions
  const handleCancelRide = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => {
          Alert.alert(
            "Ride Cancelled",
            "Your ride has been cancelled.",
            [{ text: "OK", onPress: () => navigation.navigate('Home') }]
          );
        }}
      ]
    );
  };

  const handleContactDriver = () => {
    Alert.alert(
      "Contact Driver",
      `You can contact the driver at: ${data.driverNumber}`,
      [
        { text: "Call", onPress: () => Linking.openURL(`tel:${data.driverNumber}`) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading map and directions...</Text>
        ) : mapRegion && pickupCoords && dropoffCoords ? (
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={mapRegion}
          >
            {pickupCoords && (
              <Marker 
                coordinate={pickupCoords} 
                title="Pickup"
                description={data.pickup || data.requestOrigin}
                pinColor="green"
              />
            )}
            
            {dropoffCoords && (
              <Marker 
                coordinate={dropoffCoords} 
                title="Dropoff"
                description={data.dropoff || data.requestDestination}
                pinColor="red"
              />
            )}
            
            {/* Optimized route polyline */}
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="#4A56E2"
              />
            )}
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Could not load map. Please check your connection.</Text>
        )}
      </View>

      <ScrollView style={styles.detailsSection}>
        <Text style={styles.title}>Ride Details</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Driver Name</Text>
          <Text style={styles.infoValue}>{data.driverName || "Loading..."}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Car</Text>
          <Text style={styles.infoValue}>
            {data.carName || "Loading..."} - {data.carNumber || ""}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Pickup Location</Text>
          <Text style={styles.infoValue}>{data.pickup || data.requestOrigin || "Loading..."}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Dropoff Location</Text>
          <Text style={styles.infoValue}>{data.dropoff || data.requestDestination || "Loading..."}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Price</Text>
          <Text style={styles.infoValue}>PKR{data.fare || "Loading..."}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.contactButton} 
            onPress={handleContactDriver}
          >
            <Text style={styles.buttonText}>CONTACT DRIVER</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancelRide}
          >
            <Text style={styles.buttonText}>CANCEL RIDE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    height: '60%',
    width: '100%',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#374151',
    padding: 20,
  },
  detailsSection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B5FE2',
    marginVertical: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 16,
  },
  contactButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CarpoolOngoingRideScreen;