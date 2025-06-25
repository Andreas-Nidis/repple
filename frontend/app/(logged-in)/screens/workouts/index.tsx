import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { useRouter } from 'expo-router';
import { getAuth } from '@react-native-firebase/auth';

type Workout = {
  name: string;
  category: string;
  // add other properties if needed
};

const Index = () => {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [newWorkoutCategory, setNewWorkoutCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const getWorkoutEntries = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch('http://localhost:3001/api/workouts', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      }

      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.log('Error fetching and setting weight data:', error);
    }
  }

  const addWorkoutEntry = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      console.log(newWorkoutName, newWorkoutCategory);
      const response = await fetch('http://localhost:3001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: newWorkoutName,
          category: newWorkoutCategory,
        })
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      }

      await getWorkoutEntries();
      setModalVisible(false);
      setNewWorkoutName('');
      setNewWorkoutCategory('');
    } catch (error) {
      console.log('Error fetching and setting weight data:', error);
    }
  }

  useEffect(() => {
    getWorkoutEntries();
  }, []);

  const Item = ({name, category }: {name: string, category: string}) => (
    <TouchableOpacity onPress={() => router.push('/(logged-in)/screens/workouts/[workoutId]')}>
      <View style={styles.workoutBox}>
        <Text style={styles.boxText}>{name}</Text>
        <Text style={styles.boxText}>{category}</Text>
      </View>
    </TouchableOpacity>
  )
  


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
          onPress={() => {router.back()}}
        >
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.headerText}>Workout Planning</Text>
      </View>

      <View style={{flex: 1}}>
        <View>
          {workouts.length < 1 ? ( <Text>Create a workout!</Text> ) : (
            <FlatList 
              data={workouts}
              contentContainerStyle={{ alignItems: 'center' }}
              renderItem={({ item }) =>  <Item name={item.name} category={item.category} />}
            />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
            <Text>Add Workout</Text>
          </TouchableOpacity>
          <Modal 
            visible={modalVisible}
            animationType='slide'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Workout Name:</Text>
                <TextInput
                  placeholder="Enter new workout name"
                  keyboardType="default"
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                  style={styles.input}
                />
                <Text style={styles.modalTitle}>Add Workout Category:</Text>
                <TextInput
                  placeholder="Push, pull, legs, upper, etc."
                  keyboardType="default"
                  value={newWorkoutCategory}
                  onChangeText={setNewWorkoutCategory}
                  style={styles.input}
                />
                <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                <Button title="Save" onPress={() => addWorkoutEntry()} />
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {router.push('/(logged-in)/screens/workouts/exercises')}}
        >
          <Ionicons name='list-outline' size={24} color='black' />
          <Text style={styles.footerText}>Exercise List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
    height: 40,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    margin: 'auto',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    height: 80,
  },
  footerButton: {
    marginBottom: 10,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
  },
  modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      width: '85%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 16,
      elevation: 10,
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutBox: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  }
})