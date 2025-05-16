import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { getUserData } from "../../data-service/auth";
import { getBackendUrl } from "../../constants/ipConfig";

const PaymentScreen = () => {
  const [step, setStep] = useState(1); // Step 1: MPIN, Step 2: Payment
  const [mpin, setMpin] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUserId(data?.userId);
        setEmail(data?.email || "");
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };
    fetchUser();
  }, []);

  const verifyMPIN = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}accounts/verify-mpin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mpin }),
      });
      const data = await response.json();  
      if (response.ok) {
        if (data.message === "MPIN Verified") {
          setStep(2);
        } else {
          Alert.alert("Error", "Invalid MPIN");
          navigation.navigate('Home');
        }
      } else {
        Alert.alert("Error", "Invalid MPIN");
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error("Error validating MPIN:", error.message);
    }
  };
  
  const handleWalletUpdate = async (email, amount) => {
      try {
        const response = await fetch(`${getBackendUrl()}passenger/updateWallet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            amount: amount,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Wallet Update', 'Your wallet has been updated successfully.');
        } else {
          Alert.alert('Error', 'Failed to update wallet. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong with the wallet update request.');
      }
    };
  
  const initiatePayment = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!description) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    try {
      const response = await fetch("https://0bf6-2400-adc7-1105-c000-2021-20df-5bb1-ca3f.ngrok-free.app/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pp_Version: "1.1",
          pp_Amount: parsedAmount,
          pp_TxnCurrency: "PKR",
          pp_BillReference: "billRef123",
          pp_Description: description.trim(),
          pp_ReturnURL: "https://0bf6-2400-adc7-1105-c000-2021-20df-5bb1-ca3f.ngrok-free.app/payment/callback",
        }),
      });

      const text = await response.text();
      if (response.ok) {
        try {
          const data = JSON.parse(text);
          console.log(data)
          if (data.success) {
            Alert.alert("Payment Successful", "Your payment has been successfully processed.");
            await handleWalletUpdate(email, parsedAmount);
            navigation.replace('Home');
          } else {
            Alert.alert("Payment Failed", "There was an issue with your payment.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to parse the response.");
        }
      } else {
        Alert.alert("Error", "Server returned an error. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong with the payment request.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>JazzCash Payment</Text>

      {step === 1 ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter MPIN"
            keyboardType="numeric"
            secureTextEntry
            value={mpin}
            onChangeText={(text) => setMpin(text)}
          />
          <Button title="Verify MPIN" onPress={verifyMPIN} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />

          <Button title="Pay Now" onPress={initiatePayment} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default PaymentScreen;