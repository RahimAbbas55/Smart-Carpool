import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../data-service/firebase';
import { collection, addDoc } from "firebase/firestore";
import Button from '../../components/Button';

const CarpoolRideScreen = ({ route }) => {
    const navigation = useNavigation();
    const [selectedDriver, setSelectedDriver] = useState('female'); 
    const [selectedCarpoolers, setSelectedCarpoolers] = useState('male'); 
    const [additionalPassengers, setAdditionalPassengers] = useState(2);
    const { rideData } = route.params;

    // Helper functions for incrementing and decrementing passenger count
    const incrementPassengers = () => {
        setAdditionalPassengers(additionalPassengers + 1);
    };

    const decrementPassengers = () => {
        if (additionalPassengers > 1) {
            setAdditionalPassengers(additionalPassengers - 1);
        }
    };

    // Helper function to add ride to Firestore
    const addRideToFirestore = async (rideData) => {
        try {
            const docRef = await addDoc(collection(db, "CarpoolRides"), rideData);
            console.log("Ride added with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding ride: ", error);
        }
    };

    // Adding the request to firestore
    const handleDriver = async () => {

        if ( additionalPassengers > 3 ){
            Alert.alert('Error', 'You can only add 3 additional passengers!');
            return;
        }
        const updatedRideData = {
            ...rideData,
            selectedDriver,
            selectedCarpoolers,
            additionalPassengers,
            rideStatus: 'pending'
        };
        await addRideToFirestore(updatedRideData);
        setTimeout(() => {
            Alert.alert('Ride Request Sent', 'Waiting for driver to accept your request');
            navigation.navigate('carpool_driver');
        }
        , 4000);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#007bff" />
                </TouchableOpacity>
            </View>
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Choose Driver</Text>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedDriver === 'female' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedDriver('female')}
                    >
                        <MaterialIcons name="woman" size={40} color={selectedDriver === 'female' ? '#007bff' : '#000'} />
                        <Text>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedDriver === 'male' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedDriver('male')}
                    >
                        <MaterialIcons name="man" size={40} color={selectedDriver === 'male' ? '#007bff' : '#000'} />
                        <Text>Male</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Choose Carpoolers</Text>
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedCarpoolers === 'female' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedCarpoolers('female')}
                    >
                        <MaterialIcons name="woman" size={40} color={selectedCarpoolers === 'female' ? '#007bff' : '#000'} />
                        <Text>Female Only</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedCarpoolers === 'male' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedCarpoolers('male')}
                    >
                        <MaterialIcons name="man" size={40} color={selectedCarpoolers === 'male' ? '#007bff' : '#000'} />
                        <Text>Male Only</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedCarpoolers === 'any' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedCarpoolers('any')}
                    >
                        <MaterialIcons name="group" size={40} color={selectedCarpoolers === 'any' ? '#007bff' : '#000'} />
                        <Text>Any</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Additional Passengers With You</Text>
                <View style={styles.passengerCountContainer}>
                    <Button
                        iconName="remove"
                        text="-"
                        onPress={decrementPassengers}
                        color="#fff"
                        backgroundColor="#007bff"
                    />
                    <TextInput
                        style={styles.passengerInput}
                        value={String(additionalPassengers)}
                        editable={false}
                    />
                    <Button
                        iconName="add"
                        text="+"
                        onPress={incrementPassengers}
                        color="#fff"
                        backgroundColor="#007bff"
                    />
                </View>
                <View style={styles.findDriverButton}>
                    <Button
                        text="Find a driver"
                        iconName="search"
                        onPress={() => handleDriver()}
                        color="#fff"
                        backgroundColor="#007bff"
                    />
                </View>
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f4ff',
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    backButton: {
        marginTop:20,
        marginRight: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
        marginTop: '35%', 
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    bottomContent: {
        flex: 1,
        justifyContent: 'flex-end', 
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    option: {
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    selectedOption: {
        borderColor: '#007bff',
        backgroundColor: '#d0e7ff',
    },
    passengerCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width:40,
        marginLeft:150,
        marginTop:20
    },
    passengerInput: {
        marginHorizontal: 15,
        fontSize: 18,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: 40,
    },
    findDriverButton: {
        marginTop: 20,
        marginLeft:20
    },
});

export default CarpoolRideScreen;
