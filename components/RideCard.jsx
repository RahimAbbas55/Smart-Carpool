import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import { globalColors } from "../constants/colors";

function RideCard({ data, offerNavigation, backNavigation, acceptNavigation }) {
  // Calculate the higher offer amount and format it nicely
  const offerAmount = (Number(data.requestFare) * 1.2).toFixed(0);

  return (
    <View key={data.id} style={styles.requestCard}>
      <View style={styles.header}>
        <Image
          style={styles.profilePic}
          source={{ uri: "https://via.placeholder.com/50" }}
        />
        <Text style={styles.personText}>{data.passengerName}</Text>
        <View style={styles.tripInfo}>
          <Text style={styles.distanceText}>{data.distance}</Text>
          <Text style={styles.timeText}>{data.time}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Pick Up:</Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {data.requestOrigin}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.labelText}>Drop Off:</Text>
          <Text style={styles.valueText} numberOfLines={1}>
            {data.requestDestination}
          </Text>
        </View>
        
        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Fare:</Text>
          <Text style={styles.fareAmount}>PKR {data.requestFare}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={backNavigation}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.offerButton}
          onPress={offerNavigation}
        >
          <Text style={styles.buttonText}>Offer PKR {offerAmount}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={acceptNavigation}
      >
        <Text style={styles.buttonText}>Accept Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

export default RideCard;

const styles = StyleSheet.create({
  requestCard: {
    backgroundColor: globalColors.lavender,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 12,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  personText: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
    flex: 1,
  },
  tripInfo: {
    alignItems: "flex-end",
  },
  distanceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "700",
    width: 70,
    color: "#444",
  },
  valueText: {
    fontSize: 14,
    flex: 1,
    color: "#333",
  },
  fareContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    width: 70,
  },
  fareAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  declineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButtonText: {
    color: "#ff4d4d",
    fontWeight: "600",
    fontSize: 15,
  },
  offerButton: {
    backgroundColor: "#5E72E4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});