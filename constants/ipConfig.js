import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getBackendUrl = () => {
    if (__DEV__) {
      if (Constants.expoConfig.hostUri) {
        const localIp = Constants.expoConfig.hostUri.split(':')[0];
        if (Device.isDevice) {
          return `http://${localIp}:50/api/`;
        } else {
          if (Platform.OS === 'android') {
            return 'http://10.0.2.2:50/api/'; 
          } else {
            return 'http://localhost:50/api/';
          }
        }
      }
    } else {
      return 'https://api.yourdomain.com/api/';
    }
};