import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const CustomInput = ({ placeholder, secureTextEntry, onChangeText, style }) => (
  <TextInput
    style={StyleSheet.flatten([styles.input, style])} 
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    onChangeText={onChangeText}
    placeholderTextColor="#A9A9A9"
  />
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    marginBottom: 15,
    fontSize: 16,
  },
});

export default CustomInput;
