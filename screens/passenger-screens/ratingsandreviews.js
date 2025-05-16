import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getUserData } from '../../data-service/auth';
import { getBackendUrl } from "../../constants/ipConfig";

const RatingsAndReviewsScreen = () => {
    const navigation = useNavigation();
    const [passengerId, setpassengerId] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserData();
                setpassengerId(data?.userId || "");
                setRating(data?.rating || '');
            } catch (error) {
                console.log('Error fetching user data:', error.message);
            }
        };
        fetchUser();
    }, []);

    const ratepercent = (rating / 5) * 100;

    useEffect(() => {
        if (!passengerId) return;
        const fetchRatings = async () => {
            if (!passengerId) return;
            try {
                const response = await fetch(`${getBackendUrl()}passengerRating/${passengerId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error fetching ratings:", errorData.message);
                    return;
                }
                const data = await response.json();
                console.log("Fetched Ratings:", data);
                setReviews(data);
            } catch (error) {
                console.log("Error fetching ratings:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRatings();
    }, [passengerId]);

    const renderDriver = ({ item }) => (
        <View style={styles.reviewCard}>
            <View style={styles.profileContainer}>
                <Image style={styles.profileImage} />
                <View style={styles.profileText}>
                    <Text style={styles.driverName}>{item.driverName}</Text>
                    <View style={styles.ratingContainer}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <FontAwesome
                                key={index}
                                name="star"
                                size={18}
                                color={index < Math.round(item.rating) ? "#1E40AF" : "#E5E7EB"}
                            />
                        ))}
                    </View>
                </View>
            </View>
            <Text style={styles.reviewText}>{item.review}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Ratings and Reviews</Text>
            </View>
            <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>Passenger Rating</Text>
                <Text style={styles.overallRating}>{rating}</Text>
                <Text style={styles.recommended}>{ratepercent}% Recommended</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#1E40AF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={reviews}
                    renderItem={renderDriver}
                    keyExtractor={(item, index) => item.id || index.toString()} 
                    contentContainerStyle={{ paddingBottom: 20 }}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
        backgroundColor: '#F3F4F6',
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
        marginLeft: 60,
    },
    reviewList: {
        padding: 20,
    },
    reviewCard: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#E5E7EB",
    },
    profileText: {
        marginLeft: 10,
    },
    driverName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
    },
    ratingContainer: {
        flexDirection: "row",
        marginTop: 5,
    },
    reviewText: {
        fontSize: 14,
        color: "#374151",
        marginTop: 10,
    },
    summarySection: {
        backgroundColor: "#BFDBFE",
        padding: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    summaryTitle: {
        fontSize: 16,
        color: "#374151",
        marginBottom: 10,
    },
    overallRating: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#1E40AF",
    },
    recommended: {
        fontSize: 16,
        color: "#374151",
        marginTop: 10,
    },
});

export default RatingsAndReviewsScreen;