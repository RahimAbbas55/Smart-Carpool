import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBackendUrl } from "../../constants/ipConfig";
import { useDriverData } from "../../context/DriverContext";

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const { driverDetails } = useDriverData();
  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${getBackendUrl()}history/driver/${driverDetails?.id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        const result = JSON.parse(text);
        if (result.success) {
          setRideHistory(result.data);
        } else {
          console.error("API returned failure:", result);
        }
      } catch (error) {
        console.error("Error fetching ride history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (driverDetails?.id) {
      fetchRideHistory();
    }
  }, [driverDetails?.id]);

  const renderItem = ({ item }) => {
    const statusColor = item.status === "completed" ? "green" : "red";
  
    return (
      <View style={styles.card}>
        <Text style={styles.name}>Driver: {item.driverName}</Text>
        <Text style={styles.details}>{item.fare}, {item.car} {item.carNumber}</Text>
        <Text style={styles.details}>Contact: {item.driverNumber}</Text>
  
        {/* Passenger Section */}
        {item.passengerNames?.length > 0 && (
          <View>
            <Text style={styles.passengerHeader}>Passengers:</Text>
            {item.passengerNames.map((name, index) => (
              <Text key={index} style={styles.passengerDetails}>
                {name}
              </Text>
            ))}
          </View>
        )}
  
        <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B3B98"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={rideHistory}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F4F8",
        paddingHorizontal: 15,
        paddingTop: 10,
      },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    height: 40,
    backgroundColor: "#3B3B98",
    borderRadius: 6,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EDE9F6",
    marginLeft: 90,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "column",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B3B98",
    marginBottom: 5,
  },
  details: {
    fontSize: 15,
    color: "#444",
    marginBottom: 2,
  },
  passengerHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B3B98",
    marginTop: 8,
  },
  passengerDetails: {
    fontSize: 14,
    color: "#555",
    marginLeft: 10,
    marginTop: 2,
    paddingLeft: 5,
    borderLeftWidth: 3,
    borderLeftColor: "#3B3B98",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 5,
  },
});

export default HistoryScreen;
