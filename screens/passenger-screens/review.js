import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';

const ReviewScreen = ({ navigation , route }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const { rideData} = route.params;

    console.log('in review screen' , rideData)

    const handleRating = (index) => {
        setRating(index);
    };

    const handleSubmit=()=>{
        Alert.alert("Review Submitted Successfully!");
        navigation.navigate('Home');

    };

    return (
        <><View style={styles.container3}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Write a Review</Text>
            </View>
        </View>
        <View style={styles.container}>
                <View style={styles.profileSection}>
                    <View style={styles.profileImage} />
                    <Text style={styles.profileName}>Jane Doe</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Write your review here..."
                    multiline
                    value={review}
                    onChangeText={(text) => setReview(text)} />
                <Text style={styles.label}>Rate</Text>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                            <FontAwesome
                                name="star"
                                size={30}
                                color={star <= rating ? '#1E40AF' : '#E5E7EB'} />
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.button}>
                <Button text="Submit Review" onPress={handleSubmit} />
                </View>
            </View></>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F3F4F6',
        marginTop:0
    }, 
    container3: {
        flex: 1,
        backgroundColor:  '#F3F4F6',
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
    profileSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 80,
        backgroundColor: '#BFDBFE',
        marginBottom: 10,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        fontSize: 14,
        color: '#374151',
        height: 150,
        textAlignVertical: 'top',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    button:{
        width:400,
    }
    
});

export default ReviewScreen;