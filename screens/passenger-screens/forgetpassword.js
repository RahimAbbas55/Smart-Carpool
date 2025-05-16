import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import InputField from '../../components/InputField';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await fetch('http://192.168.0.113:5000/api/passenger/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'A reset code has been sent to your email.');
                navigation.navigate('ChangePassword');
            } else {
                Alert.alert('Error', data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.log('Something went wrong' , error.message)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Forgot Password</Text>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.label}>Enter your email</Text>
                <InputField
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                />
                <Button text="Reset Password" onPress={handleResetPassword} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EDE9F6',
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#3B3B98',
        borderRadius: 6,
    },
    backButton: {
        marginRight: 12,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EDE9F6',
        marginLeft:70
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDE9F6',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    label: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft:5
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        color: '#374151',
    },
});

export default ForgotPasswordScreen;
