import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ source }) => {
  return <Image source={source} style={styles.logo} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 80
  },
});

export default Logo;
