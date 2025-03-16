import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CarpoolRideCard({ 
    data, onAccept, onReject
}) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.passengerInfo}>
          <Text style={styles.passengerName}>{data.passengerName}</Text>
          {data.additionalPassengers > 0 && (
            <View style={styles.additionalPassengersContainer}>
              <Ionicons name="people" size={16} color="#555" />
              <Text style={styles.additionalPassengersText}>+{data.additionalPassengers}</Text>
            </View>
          )}
        </View>
        <View style={styles.fareContainer}>
          <Text style={styles.fareAmount}>PKR.{data.fare}</Text>
          <Text style={styles.fareLabel}>Fare</Text>
        </View>
      </View>
      
      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <View style={styles.iconContainer}>
            <View style={[styles.locationIcon, styles.pickupIcon]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationText}>{data.pickup}</Text>
          </View>
        </View>
        
        <View style={styles.routeLine} />
        
        <View style={styles.locationContainer}>
          <View style={styles.iconContainer}>
            <View style={[styles.locationIcon, styles.dropoffIcon]} />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationText}>{data.dropoff}</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]} 
          onPress={onReject}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="white" />
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.acceptButton]} 
          onPress={onAccept}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  additionalPassengersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  additionalPassengersText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  fareLabel: {
    fontSize: 12,
    color: '#777',
  },
  routeContainer: {
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  locationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupIcon: {
    backgroundColor: '#4CAF50',
  },
  dropoffIcon: {
    backgroundColor: '#F44336',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  routeLine: {
    position: 'absolute',
    left: 11.5,
    top: 24,
    bottom: 24,
    width: 1,
    backgroundColor: '#ddd',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  }
});