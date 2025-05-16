import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Logo from '../components/logo';

const VerifyScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://192.168.0.113:5000/api/passenger/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: route.params.phone,
          email: route.params.email,
          password: route.params.password,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'You have successfully signed up');
        navigation.navigate('Home'); // Navigate to the Home screen or any other screen
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred during OTP verification');
    }
  };

  return (
    <View style={styles.container}>
      <Logo source={require('../assets/logo.jpeg')} />
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the code sent to your phone number</Text>

      <InputField
        placeholder="Enter OTP code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <Button text="Verify OTP" onPress={handleVerifyOTP} />

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
});

export default VerifyScreen;
