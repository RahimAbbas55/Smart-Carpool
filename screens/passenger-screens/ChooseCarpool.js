import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { app } from "../../data-service/firebase";
import Button from "../../components/Button";

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
        <Text style={styles.waitingText}>Request cancelled. Please try again.</Text>
      </View>
    )}
  </View>
);

const ChooseCarpool = ({ navigation, route }) => {
  const rideId = route.params?.rideId;
  const [rideData, setRideData] = useState(null);
  const [isWaitingForDriver, setIsWaitingForDriver] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {

  }, []);

  const handleAcceptDriver = async () => {

  };

  const handleDeclineDriver = async () => {
      
  };

  const handleCancelRequest = async () => {
    
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