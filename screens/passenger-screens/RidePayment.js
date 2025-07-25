import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUserData } from "../../data-service/auth";
import { getBackendUrl } from "../../constants/ipConfig";
import { useNavigation } from "@react-navigation/native";

const RidePaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { driverId, rideFare, rideData } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setEmail(data?.email || "");
        setWallet(data?.wallet || 0);
        setUserId(data?.userId || "");
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  const handlePayment = async () => {
    console.log("Selected Payment Method:", selectedMethod);

    if (!selectedMethod) {
      Alert.alert("Select Payment Method", "Please choose a payment method.");
      return;
    }

    if (selectedMethod === "wallet") {
      if (wallet >= rideFare) {
        const updatedWallet = wallet - rideFare;
        try {
          const passengerResponse = await fetch(
            `${getBackendUrl()}passenger/updateWallet`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, amount: -rideFare }),
            }
          );

          if (!passengerResponse.ok) {
            Alert.alert("Payment Failed", "Error deducting amount from wallet.");
            return;
          }

          const driverResponse = await fetch(
            `${getBackendUrl()}driver/updateWallet`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ driverId, amount: rideFare }),
            }
          );

          if (driverResponse.ok) {
            setWallet(updatedWallet);
            Alert.alert(
              "Payment Successful",
              "Amount deducted from wallet and credited to the driver."
            );
            navigation.navigate("Review", {
              passengerId: userId,
              rideId: "67d6e14440ae360f7bc24f7e",
              driverId: data.driverId,
              driverName: data.driverName,
            });
          } else {
            Alert.alert("Payment Failed", "Error adding fare to driver's wallet.");
          }
        } catch (error) {
          Alert.alert("Payment Failed", "An error occurred while processing the payment.");
        }
      } else {
        Alert.alert("Insufficient Balance", "Please choose cash.");
        return;
      }
    } else {
      
      navigation.navigate("review", {
        passengerId: userId,
        rideId: "67d6e14440ae360f7bc24f7e",
        driverId: driverId,
        driverName: rideData.driverName || rideData.driverFirstName + '' + rideData.driverLastName || "Rahim Sindhu",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Ride Fare: <Text style={styles.amount}>Rs {rideFare}</Text>
        </Text>
      </View>

      <Text style={styles.paymentTitle}>Select Payment Method</Text>

      <TouchableOpacity
        onPress={() => {
          console.log("Wallet selected");
          setSelectedMethod("wallet");
        }}
        style={[
          styles.paymentButton,
          selectedMethod === "wallet"
            ? styles.selectedButton
            : styles.unselectedButton,
        ]}
      >
        <Text style={styles.buttonText}>Pay with Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log("Cash selected");
          setSelectedMethod("cash");
        }}
        style={[
          styles.paymentButton,
          selectedMethod === "cash"
            ? styles.selectedButton
            : styles.unselectedButton,
        ]}
      >
        <Text style={styles.buttonText}>Pay with Cash</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePayment} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  amount: {
    color: "#1E40AF",
    fontWeight: "bold",
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  paymentButton: {
    width: "80%",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#BFDBFE",
  },
  unselectedButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#1E40AF",
    width: "80%",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default RidePaymentScreen;
