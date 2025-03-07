import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { globalColors } from '../../constants/colors';
import { useState } from 'react';

export default function CNICDetail({ navigation }){
  const [CNICFront , setCNICFront] = useState('');
  const [CNICBack , setCNICBack] = useState('');
  const [CNICNumber , setCNICNumber] = useState('')

  function submitHandler(){
    navigation.goBack('details')
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>CNIC (front side)</Text>
          <Image 
            source={{uri: 'https://example.com/your-image-front.png'}} 
            style={styles.image}
          />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardSection}>
          <Text style={styles.cardTitle}>CNIC (back side)</Text>
          <Image 
            source={{uri: 'https://example.com/your-image-back.png'}} 
            style={styles.image}
          />
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add a photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CNIC Number</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter CNIC number" 
          />
        </View>
      <TouchableOpacity style={styles.doneButton} onPress={submitHandler}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
  },
  backButton: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    marginVertical: 20,
  },
  cardSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: globalColors.violetBlue
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: globalColors.violetBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  inputSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: globalColors.violetBlue
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    borderWidth: 2,
    borderColor: globalColors.violetBlue
  },
  doneButton: {
    alignItems: "center",
    backgroundColor: globalColors.violetBlue,
    borderRadius: 24,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    color: 'white',
  },
});