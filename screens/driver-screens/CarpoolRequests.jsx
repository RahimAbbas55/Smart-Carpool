// import { useEffect, useState } from "react";
// import { View, Text, StyleSheet, FlatList } from "react-native";
// import { globalColors } from "../../constants/colors";
// import {
//   collection,
//   getFirestore,
//   onSnapshot,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { app } from "../../data-service/firebase";
// import RideCard from "../../components/RideCard";

// export default function CarpoolRequests({ navigation, route }) {
//   const [requests, setRequests] = useState([]);
//   const db = getFirestore(app);
//   const { driverLocation } = route.params;
//   console.log('Driver location is:' , driverLocation);
//   useEffect(() => {}, []);

//   function backNavigation() {
//     navigation.goBack();
//   }

//   async function nextNavigation(id, fare) {}

//   async function acceptNavigation(id) {}
//   return (
//     <>
//       <View style={styles.headingView}>
//         <Text style={styles.headingText}>Incoming Carpool Ride Requests</Text>
//       </View>
//       {/* <FlatList
//         style={styles.container}
//         data={requests}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <RideCard
//             data={{...item, id: item._id}}
//             acceptNavigation={ () => acceptNavigation(item._id)}
//             nextNavigation={() => nextNavigation(item._id , item.requestFare)}
//             backNavigation={backNavigation}
//           />
//         )}
//       /> */}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: globalColors.lavender,
//     marginBottom: 10,
//   },
//   headingView: {
//     backgroundColor: globalColors.lavender,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 60,
//     paddingBottom: 10,
//   },
//   headingText: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#000",
//   },
// });
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { globalColors } from "../../constants/colors";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "../../data-service/firebase";
import RideCard from "../../components/RideCard";

export default function CarpoolRequests({ navigation, route }) {
  const [requests, setRequests] = useState([]);
  const db = getFirestore(app);
  const { driverLocation } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "CarpoolRides"),
      (snapshot) => {
        const allRequests = snapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        const filteredRequests = allRequests.filter((ride) =>
          isWithin5Km(
            driverLocation.latitude,
            driverLocation.longitude,
            ride.passengerCurrentLocationLatitude,
            ride.passengerCurrentLocationLongitude
          )
        );

        setRequests(filteredRequests);
      }
    );

    return () => unsubscribe();
  }, [driverLocation]);

  function backNavigation() {
    navigation.goBack();
  }

  async function nextNavigation(id, fare) {}

  async function acceptNavigation(id) {}

  return (
    <>
      <View style={styles.headingView}>
        <Text style={styles.headingText}>Incoming Carpool Ride Requests</Text>
      </View>

      {/* FIX THE RIDE CARD OF THIS */}
      <FlatList
        style={styles.container}
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RideCard
            data={{ ...item, id: item._id }}
            acceptNavigation={() => acceptNavigation(item._id)}
            nextNavigation={() => nextNavigation(item._id, item.requestFare)}
            backNavigation={backNavigation}
          />
        )}
      />
    </>
  );
}

// HELPER FUNCTION TO DETERMINE WHETHER THE DRIVER IS WITHIN 5KM OF THE PASSENGER
// Function to calculate distance using Haversine formula
function isWithin5Km(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return false;

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= 5;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: globalColors.lavender,
    marginBottom: 10,
  },
  headingView: {
    backgroundColor: globalColors.lavender,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 10,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});
