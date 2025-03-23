import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserData } from '../../data-service/auth';

const WalletScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setEmail(data?.email || "");
        setWallet(data?.wallet || 0);
      } catch (error) {
        console.log('Error fetching user data:', error.message);
      }
    };

    fetchUser();
  }, []);

  const handlePaymentNavigation = () => {
    Alert.alert("Add Funds", "Redirecting to JazzCash payment gateway...");
    navigation.navigate("Payment");
  };

  const handleCardNavigation = () =>{
    navigation.navigate("Add Card");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Wallet</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.walletText}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>PKR {wallet}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <Text style={styles.cardsTitle}></Text>
        <View style={styles.cardBox}>
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Funds</Text>
            <TouchableOpacity style={styles.addCardButton} onPress={handlePaymentNavigation}>
              <Text style={styles.addCardButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>Cards</Text>
            <TouchableOpacity style={styles.addCardButton} onPress={handleCardNavigation}>
              <Text style={styles.addCardButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Your payment info is stored securely</Text>
      </View>
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
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EDE9F6',
    flex: 1,
    textAlign: 'center',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  walletText: {
    color: '#374151',
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 30,
    color: '#374151',
    marginVertical: 10,
  },
  cardsContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  cardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  cardBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 15,
  },
  subCard: {
    alignItems: 'center',
    flex: 1,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
  },
  addCardButton: {
    backgroundColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  addCardButtonText: {
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 15,
  },
  footerText: {
    color: '#6B7280',
  },
});

export default WalletScreen;