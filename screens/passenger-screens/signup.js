import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBackendUrl } from '../../constants/ipConfig';
import DropDownPicker from 'react-native-dropdown-picker'; // Ensure this is installed
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Logo from '../../components/logo';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male'); // Add state for gender
  const [open, setOpen] = useState(false); // Track whether the dropdown is open
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  // Validation functions
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = (phone) => /^\+92\d{10}$/.test(phone);
  const isPasswordValid = (password) => password.length > 8;

  const handleSignUp = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Validation Error', 'Invalid email format');
      return;
    }

    if (!isPhoneValid(phone)) {
      Alert.alert('Validation Error', 'Phone number must start with +92 and have 13 characters');
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert('Validation Error', 'Password must be greater than 8 characters');
      return;
    }

    try {
      const response = await fetch(`${getBackendUrl()}passenger/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password,
          gender: gender, 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Sign up successful. You can now log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Sign-up failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign-up');
    }
  };

  return (
    <View style={styles.container}>
      <Logo source={require('../../assets/logo.jpeg')} />
      <Text style={styles.title}>Welcome to Smart Carpool</Text>
      <Text style={styles.subtitle}>Sign Up to continue</Text>

      <InputField placeholder="Name" value={name} onChangeText={setName} />
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Phone Number (+92XXXXXXXXXX)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <InputField placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <DropDownPicker
        open={open} 
        value={gender}
        items={items}
        setOpen={setOpen} 
        setValue={setGender} 
        setItems={setItems} 
        containerStyle={styles.pickerContainer}
        style={styles.picker}
        dropDownStyle={styles.dropDownStyle}
        placeholder="Select Gender"
        zIndex={3000} 
        zIndexInverse={1000} 
      />

      <Button text="Sign Up" onPress={handleSignUp} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  loginText: {
    color: '#4A90E2',
    marginTop: 10,
    fontSize: 14,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dropDownStyle: {
    backgroundColor: '#fafafa',
  },
});

export default SignUpScreen;