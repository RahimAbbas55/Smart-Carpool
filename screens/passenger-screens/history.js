import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserData } from '../../data-service/auth';
import { getBackendUrl } from '../../constants/ipConfig';


const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const data = await getUserData();
          setUserData(data);
          setUserId(data?.userId);
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      };
      fetchUser();
    }, []);
  
    useEffect(() => {
      const fetchRideHistory = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${getBackendUrl()}history/${userId}`);
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
    
      if (userId) {
        fetchRideHistory();
      }
    }, [userId]); 
    

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'completed' ? 'green' : 'red';
    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.driverName}</Text>
          {item.fare && <Text style={styles.details}>{item.fare}, {item.car} {item.carNumber}</Text>}
          {item.fare && <Text style={styles.details}>Contact: {item.driverNumber}</Text>}

        </View>
        <Text style={[styles.status, { color: statusColor }]}>{item.status}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Ride History</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#3B3B98" style={{ marginTop: 20 }} />
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
    backgroundColor: '#EDE9F6',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    height: 40,
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
    marginLeft: 90,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DADADA',
    height: 100,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B3B98',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;