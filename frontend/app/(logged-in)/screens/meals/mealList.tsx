import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';

type MealData = {
  name: string;
  id: string;
}

const MealList = () => {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [meals, setMeals] = useState<MealData[]>([]);
    const [mealName, setMealName] = useState('');

    const getMealEntries = async () => {
        try {
        const user = getAuth().currentUser;
        const idToken = await user?.getIdToken();
        const response = await fetch(`${BASE_URL}/api/meals`, {
            headers: {
            Authorization: `Bearer ${idToken}`,
            }
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API returned error:', errorText);
            return;
        };

        const data = await response.json();
        setMeals(data);
        } catch (error) {
        console.log('Error fetching meals data:', error);
        }
    }

    const createNewMeal = async () => {
        try {
        const user = getAuth().currentUser;
        const idToken = await user?.getIdToken();
        const response = await fetch(`${BASE_URL}/api/meals`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
            name: mealName
            })
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API returned error:', errorText);
            return;
        };

        await getMealEntries();
        setModalVisible(false);
        setMealName('');
        } catch (error) {
        console.log('Error creating new meal:', error);
        }
    }

    useFocusEffect(
        useCallback(() => {
        getMealEntries();
        }, [])
    )

    const Item = ({ name, id }: {name: string, id: string}) => (
        <TouchableOpacity style={styles.workoutButton} onPress={() => router.push(`/(logged-in)/screens/meals/${id}`)}>
        <View style={styles.workoutBox}>
            <Text style={styles.boxText}>{name}</Text>
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
                <Text style={styles.headerText}>Meals List</Text>
            </View>
            <View style={{flex: 1}}>
                <View style={styles.flatlist}>
                {meals.length < 1 ? ( <Text>Add an meal!</Text> ) : (
                    <FlatList 
                    data={meals}
                    contentContainerStyle={{ width: '80%' }}
                    renderItem={({ item }) =>  <Item name={item.name} id={item.id} />}
                    />
                )}
                </View>
                <View>
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
                        <Text style={styles.addButtonText}>Add Meal</Text>
                    </TouchableOpacity>
                    <Modal 
                        visible={modalVisible}
                        animationType='slide'
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Meal Name:</Text>
                                <TextInput
                                placeholder="Enter new meal name"
                                keyboardType="default"
                                value={mealName}
                                onChangeText={setMealName}
                                style={styles.input}
                                />
                                <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                                <Button title="Save" onPress={() => createNewMeal()} />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default MealList

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
  workoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: '80%',
  },
  workoutBox: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
    margin: 10,
  }, 
  addButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  addButtonText: {
    margin: 5,
  },
  flatlist: {
    alignItems: 'center',
    padding: 10,
  }
})