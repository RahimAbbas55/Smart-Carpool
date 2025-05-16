import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { globalColors } from '../../constants/colors';
import { collection, getFirestore, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { app } from '../../data-service/firebase';
import RideCard from '../../components/RideCard';

export default function RideRequests({ navigation , route }) {
  const [requests, setRequests] = useState([]);
  const { data } = route.params
  const db = getFirestore(app);

  useEffect(() => {
    const ridesRef = collection(db, 'Rides');
    
    const unsubscribe = onSnapshot(ridesRef, (snapshot) => {
      const ridesData = snapshot.docs
        .map(doc => ({
          _id: doc.id,
          ...doc.data()
        }))
        .filter(ride => ride.requestAccepted === false);
      setRequests(ridesData);
    }, (error) => {
      console.error("Error fetching rides: ", error);
    });

    return () => unsubscribe();
  }, []);
  
  function backNavigation() {
    navigation.goBack();
  }

  async function nextNavigation(id , fare) {
    try {
      const rideRef = doc(db, 'Rides', id);
      await updateDoc(rideRef, {
        driverName: 'Aamir Liaqut',
        driverCar: 'Supra',
        carNumber: 'ABC-123',
        time: '10 minutes',
        distance: '5 km',
        price: '10',
        offeredPrice: Number((Number(fare) * 0.1) + Number(fare)),
        request: false
      });
      // navigation.navigate('ridedetails');
    } catch (error) {
      console.error('Error updating ride status:', error);
    }
  }

  async function acceptNavigation(id){
    try {
      const rideRef = doc(db, 'Rides', id);
      await updateDoc(rideRef, {
        requestAccepted: true, 
        driverId: data?.id,
        driverName: data?.firstName + '' + data?.lastName,
        car: data?.vehicle,
        carNumber: data?.licensePlate,
        driverNumber: data?.driverPhone,
        rideOTP: Math.floor(1000 + Math.random() * 9000).toString()
      });
      setTimeout(() => {
        navigation.navigate('ridedetails' , {rideId : id})
      } , 5000)
    } catch (error) {
      console.error('Error accepting ride request:', error);
    }
  }
  return (
    <>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Incoming Ride Requests</Text>
      </View>
      <FlatList
        style={styles.container}
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RideCard 
            data={{...item, id: item._id}}
            acceptNavigation={ () => acceptNavigation(item._id)}
            nextNavigation={() => nextNavigation(item._id , item.requestFare)}
            backNavigation={backNavigation}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: globalColors.lavender,
    marginBottom: 10
  },
  headingView: {
    backgroundColor: globalColors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,  
    paddingBottom: 10,
  },
  headingText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#000', 
  }
});