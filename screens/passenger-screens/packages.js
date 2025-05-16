import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserData } from '../../data-service/auth';
import { getBackendUrl } from '../../constants/ipConfig';

const PackagesScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState(0);
  const [amount, setAmount] = useState(0);
  const [currentSubscription, setCurrentSubscription] = useState({
    hasSubscription: false,
    subscription: {
      planName: '',
      validity: ''
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setUserId(data?.userId);
        setWallet(data?.wallet || 0);
        setEmail(data?.email || '');
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
    fetchUser();
  }, []);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${getBackendUrl()}packages`);
        if (!response.ok) throw new Error('Failed to load packages');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load packages.');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchSubscription = async () => {
      if (!userId) {
        console.warn("UserId is missing! API call skipped.");
        return;
      }
      const apiUrl = `${getBackendUrl()}subscription/currentSubscription/${userId}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok && data.hasSubscription) {
          setCurrentSubscription(data);
          console.log("current sub", currentSubscription);
        }
      } catch (error) {
        console.error(' Error fetching subscription:', error);
      }
    };
    fetchSubscription();
  }, [userId]);

  const handleSelectPlan = (plan) => setSelectedPlan(plan);

  const calculateValidity = (duration) => {
    const currentDate = new Date();
    const startDate = currentDate.toISOString().split('T')[0];
    let durationDays = 0;
    if (duration.includes("week")) {
      durationDays = parseInt(duration) * 7;
    } else if (duration.includes("month")) {
      durationDays = parseInt(duration) * 30;
    } else {
      console.error("Unknown duration format:", duration);
      return { startDate: null, endDate: null };
    }
    const endDateObj = new Date();
    endDateObj.setDate(currentDate.getDate() + durationDays);
    const endDate = endDateObj.toISOString().split('T')[0];
    return { startDate, endDate };
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a subscription plan before proceeding.');
      return;
    }
    console.log("Selected Plan:", selectedPlan);

    if (currentSubscription.hasSubscription) {
      alert('You already have an active subscription.');
      return;
    }

    if (wallet < selectedPlan.fee) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance in your wallet.');
      return;
    }
    const { startDate, endDate } = calculateValidity(selectedPlan.duration);
    try {
      const response = await fetch(`${getBackendUrl()}subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          packageName: selectedPlan.name,
          validFrom: startDate,
          validTo: endDate,
          paymentStatus: 'completed',
        }),
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      const amountToDeduct = Number(selectedPlan.fee);
      const updatedWallet = Number(wallet) - amountToDeduct;

      console.log("Updated wallet:", updatedWallet);
      console.log("Amount to deduct:", amountToDeduct);

      if (isNaN(updatedWallet) || isNaN(amountToDeduct)) {
        console.error("Invalid wallet or fee value! Aborting API request.");
        return;
      }

      await fetch(`${getBackendUrl()}passenger/updateWallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount: -amountToDeduct })
      });

      setWallet(updatedWallet);
      setCurrentSubscription({ planName: selectedPlan.name, validity: `${startDate} - ${endDate}` });

      Alert.alert('Subscription Successful', `You have subscribed to ${selectedPlan.name}. Validity: ${startDate} - ${endDate}`);
    } catch (error) {
      Alert.alert('Subscription Failed', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading packages...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#EDE9F6" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Packages</Text>
      </View>

      <View style={styles.packageInfoBox}>
        <Text style={styles.infoHeader}>Current Subscription</Text>
        <Text style={styles.infoDetails}>Package Name:{currentSubscription.subscription.planName}</Text>
        <Text style={styles.infoDetails}>Validity:{currentSubscription.subscription.validity} </Text>
      </View>

      <ScrollView>
        <Text style={styles.sectionHeader}>Choose Your Plan</Text>

        {packages.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.packageCard, selectedPlan === plan && styles.selectedPackageCard]}
            onPress={() => handleSelectPlan(plan)}
          >
            <Text style={styles.packageTitle}>{plan.name} Plan</Text>
            <Text style={styles.packageDetails}>- {plan.discount}% discount on rides</Text>
            <Text style={styles.packageDetails}>- Valid for {plan.duration} </Text>
            <Text style={styles.packageDetails}>- Fee: PKR {plan.fee}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.proceedButton, currentSubscription && styles.disabledButton]}
          onPress={handleProceedToPayment}
          // disabled={!!currentSubscription.subscription}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDE9F6', paddingHorizontal: 15, paddingTop: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 20, height: 40, backgroundColor: '#3B3B98', borderRadius: 6 },
  backButton: { marginLeft: 12 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#EDE9F6', marginLeft: 110 },
  packageInfoBox: { backgroundColor: '#E5E7EB', padding: 16, borderRadius: 10, marginBottom: 20 },
  infoHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  infoDetails: { fontSize: 14, color: '#374151', marginBottom: 5 },
  sectionHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, color: '#1E40AF', textAlign: 'center' },
  packageCard: { backgroundColor: '#F3F4F6', padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center', elevation: 5, borderWidth: 1, borderColor: '#D1D5DB' },
  selectedPackageCard: { backgroundColor: '#BFDBFE', borderWidth: 2, borderColor: '#1E40AF' },
  proceedButton: { backgroundColor: '#1E40AF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  proceedButtonText: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#A5B4FC' },
  loadingText: { fontSize: 18, color: '#374151', textAlign: 'center', marginTop: 20 },
});

export default PackagesScreen;