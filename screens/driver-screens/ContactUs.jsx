import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDriverData } from '../../context/DriverContext';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import CustomInput from '../../components/CustomInput';
import InputField from '../../components/InputField';
import { getBackendUrl } from '../../constants/ipConfig';

const ContactUs = () => {
  const navigation = useNavigation();
  const { driverDetails } = useDriverData();

  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [query, setQuery] = useState('');

  const handleSendMessage = async () => {
    if ( !firstName || !email || !phoneNumber || !query ){
      Alert.alert('Error' , 'All fields are required!')
      return;
    }
    try {
      const response = await fetch(`${getBackendUrl()}driver-contact-us`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ firstName, email, phoneNumber, complaint: query, driverId: driverDetails?.id }),
            });
      
            const data = await response.json();
            if (response.ok) {
              Alert.alert('Success', 'Your complaint has been sent!', [
                {
                  text: 'OK',
                  onPress: () => {
                    setFirstName('');
                    setEmail('');
                    setPhoneNumber('');
                    setQuery('');
                    navigation.navigate('Home');
                  },
                },
              ]);
            } else {
              Alert.alert('Error', data.error || 'Something went wrong!');
            }      
    } catch (error) {
      Alert.alert('Error', 'Could not send the message. Please try again.');
      // console.log(error)
    }
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <InputField
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <InputField
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <InputField
          label="Phone Number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
        />
        <CustomInput
          label="Query"
          placeholder="Enter your query"
          multiline={true}
          value={query}
          onChangeText={setQuery}
          style={[styles.textArea, styles.input]}
        />
        <View style={styles.button}>
          <Button text="Send Message" onPress={handleSendMessage} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#EDE9F6',
  },
  container3: {
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
    height: 45,
    backgroundColor: '#3B3B98',
    borderRadius: 6,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EDE9F6',
    marginLeft: 100,
  },
  input: {
    marginBottom: 30,
  },
  textArea: {
    height: 200,
  },
  button: {
    width: 378,
  },
});

export default ContactUs;
