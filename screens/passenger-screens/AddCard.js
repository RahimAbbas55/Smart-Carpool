import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getUserData } from '../../data-service/auth';
import { getBackendUrl, getBaseUrl } from "../../constants/ipConfig";


export default function App() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("+92");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [mpin, setMpin] = useState("");
  const [useJazzCash, setUseJazzCash] = useState(false);
  const [userId,setUserId]=useState("");
  const [userData, setUserData] = useState(null);
  
  // fetching user info
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const data = await getUserData();
          setUserData(data);
          setUserId(data?.userId);        
        } catch (error) {
          console.log('Error fetching user data:', error.message);
        }
      };
  
      fetchUser();
    }, []);
  
  
  const isValidPhoneNumber = (number) => /^\+92[0-9]{10}$/.test(number);

  const sendOTP = async () => {
    if (!isValidPhoneNumber(phone)) {
      Alert.alert("Invalid Number", "Enter a valid +92XXXXXXXXXX format.");
      return;
    }
    try {
      const response = await fetch(`${getBaseUrl()}send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        Alert.alert("OTP Sent", "Check your phone for the OTP.");
      } else {
        Alert.alert("Error", data.error || "Failed to send OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const verifyOTP = async () => {
    if (code.length !== 6) {
      Alert.alert("Invalid OTP", "Enter a valid 6-digit OTP.");
      return;
    }
    try {
      const response = await fetch(`${getBaseUrl()}verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        Alert.alert("Success", "OTP Verified Successfully!");
      } else {
        Alert.alert("Invalid OTP", data.message || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleMPINSubmit = async () => {
    console.log("MPIN:", mpin); 
    console.log("Phone:", phone);
    console.log
    if (mpin.length !== 4) {
      Alert.alert("Invalid MPIN", "MPIN should be exactly 4 digits.");
      return;
    }
  
    try {
      const response = await fetch(`${getBackendUrl()}accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, 
          jazzCashNumber: phone,
          mpin,
        }),
      });
  
      const data = await response.json();
      console.log("data",data);
  
      if (response.ok) {
        Alert.alert("Success", "Card added successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.error || "Failed to add card.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Card</Text>
      </View>
      <View style={styles.formContainer}>
        {!otpSent ? (
          <>
            <Text>Add JazzCash Account</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              placeholder={useJazzCash ? "JazzCash Account" : "+92XXXXXXXXXX"}
              value={phone}
              onChangeText={(text) => {
                if (!useJazzCash && text.startsWith("+92")) {
                  setPhone(text);
                } else if (useJazzCash) {
                  setPhone(text);
                }
              }}
            />
            <Button title="Send OTP" onPress={sendOTP} />
          </>
        ) : !otpVerified ? (
          <>
            <Text>Enter OTP</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              maxLength={6}
            />
            <Button title="Verify OTP" onPress={verifyOTP} />
          </>
        ) : (
          <>
            <Text>Enter MPIN</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="****"
              value={mpin}
              onChangeText={setMpin}
              maxLength={4}
              secureTextEntry
            />
            <Button title="Submit" onPress={handleMPINSubmit} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE9F6',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    height: 40,
    backgroundColor: '#3B3B98',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EDE9F6',
    flex: 1,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginVertical: 10,
  },
});