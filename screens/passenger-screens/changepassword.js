import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import InputField from '../../components/InputField';

const ChangePasswordScreen = ({ navigation }) => {
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!resetCode || !newPassword) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://192.168.0.113:5000/api/passenger/changepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resetCode, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password has been reset successfully.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.log("Something went wrong." , error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Change Password</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Enter the code sent to your email and your new password:</Text>
                <InputField
                    style={styles.input}
                    placeholder="Reset Code"
                    value={resetCode}
                    onChangeText={setResetCode}
                    keyboardType="numeric"
                    autoCapitalize="none"
                />
                <InputField
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <View style={styles.button}>
                <Button text='Submit' onPress={handleChangePassword} />
                </View>
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
        marginLeft: 60
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDE9F6',
        padding: 15,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    label: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 5
    },
    button:{
        width:340,
        marginLeft:23
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

export default ChangePasswordScreen;
