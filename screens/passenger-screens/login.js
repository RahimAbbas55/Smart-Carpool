import { useState, useContext } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { getBackendUrl } from '../../constants/ipConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import LinkButton from '../../components/LinkButton';
import Logo from '../../components/logo';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const serverURL = getBackendUrl();
      const response = await fetch(`${serverURL}passenger/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.status === 'ok') {
        await AsyncStorage.setItem('authToken', data.token);
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Login failed.');
      }
    } catch (error) {
      console.log("Something went wrong." , error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Logo source={require('../../assets/logo.jpeg')} />
      <Text style={styles.welcomeText}>Welcome to Smart Carpool</Text>
      <Text style={styles.subText}>Log in to continue</Text>

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <LinkButton
        text="Forget Password?"
        style={styles.forgetPassword}
        onPress={() => navigation.navigate('ForgetPassword')}
      />
      <Button text="Log In" onPress={handleLogin} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account? </Text>
        <LinkButton
          text="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#707070',
    marginBottom: 20,
  },
  forgetPassword: {
    textAlign: 'right',
    marginLeft: 240,
    fontSize: 14,
    color: '#707070',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#707070',
  },
});

export default LoginScreen;