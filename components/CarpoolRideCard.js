import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CarpoolRideCard({ 
    data, onAccept, onReject
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.95}>
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
          style={styles.rejectButton} 
          onPress={onReject}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={22} color="#F44336" />
          <Text style={styles.rejectButtonText}>Decline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={onAccept}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text style={styles.acceptButtonText}>Accept Ride</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  fareLabel: {
    fontSize: 13,
    color: '#777',
  },
  routeContainer: {
    marginTop: 8,
    marginBottom: 8,
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
    gap: 12,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.38,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.62,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  rejectButtonText: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 6,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 6,
  }
});