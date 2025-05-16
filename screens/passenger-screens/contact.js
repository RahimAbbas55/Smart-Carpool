import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserData } from '../../data-service/auth';
import { getBackendUrl } from '../../constants/ipConfig';
import Button from '../../components/Button';
import CustomInput from '../../components/CustomInput';
import InputField from '../../components/InputField';

const ContactUsScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [query, setQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setUserId(data?.userId);
        if (data?.name) setName(data.name); 
      } catch (error) {
        console.log('Error fetching user data:', error.message);
        setName('Guest');
      }
    };
    fetchUser();
  }, []);

  const handleSendMessage = async () => {
    if (!name || !email || !phone || !query) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    try {
      const response = await fetch(`${getBackendUrl()}contactus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, complaint: query, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Your complaint has been sent!', [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setEmail('');
              setPhone('');
              setQuery('');
              navigation.navigate('Home');
            },
          },
        ]);
      } else {
        Alert.alert('Error', data.error || 'Something went wrong!');
      }      
    } catch (error) {
      Alert.alert('Error', 'Could not send the message. Please try again.' );
    }
  };

  return (
    <>
      <View style={styles.container3}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Contact Us</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <InputField
            label="First Name"
            placeholder="Enter your first name"
            value={name || ''} 
            onChangeText={setName}
            style={styles.input}
          />
          <InputField
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email || ''}
            onChangeText={setEmail}
            style={styles.input}
          />
          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone || ''}
            onChangeText={setPhone}
            style={styles.input}
          />
          <CustomInput
            label="Query"
            placeholder="Enter your query"
            multiline={true}
            value={query || ''}
            onChangeText={setQuery}
            style={[styles.textArea, styles.input]}
          />
          <View style={styles.button}>
            <Button text="Send Message" onPress={handleSendMessage} />
          </View>
        </View>
      </ScrollView>
    </>
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
    marginLeft: 90,
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

export default ContactUsScreen;