import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Button, Platform, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter, useFocusEffect } from 'expo-router';
import { PieChart } from 'react-native-gifted-charts';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BASE_URL } from '@/utils/api';
import { getAuth } from '@react-native-firebase/auth';

type MealData = {
  id: string,
  name: string,
  total_protein: number,
  total_carbs: number,
  total_fat: number,
  selected: boolean,
}

const Index = () => {
  const router = useRouter();
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalProtein, setTotalProtein] = useState<number>(0);
  const [totalCarbs, setTotalCarbs] = useState<number>(0);
  const [totalFat, setTotalFat] = useState<number>(0);
  const [proteinPercentage, setProteinPercentage] = useState<number>(0);
  const [carbsPercentage, setCarbsPercentage] = useState<number>(0);
  const [fatPercentage, setFatPercentage] = useState<number>(0);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
  const [meals, setMeals] = useState<MealData[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<MealData[]>([]);
  const [unselectedMeals, setUnselectedMeals] = useState<MealData[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<string>('');

  const calculateTotals = (selectedMeals: MealData[]) => {
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    selectedMeals.forEach(meal => {
      const protein = Number(meal.total_protein);
      const carbs = Number(meal.total_carbs);
      const fat = Number(meal.total_fat);
      totalCalories += ((protein * 4) + (carbs * 4) + (fat * 9))
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
    });

    const proteinPct = totalCalories === 0 ? 0 : Math.round((totalProtein * 4 / totalCalories) * 100);
    const carbsPct = totalCalories === 0 ? 0 : Math.round((totalCarbs * 4 / totalCalories) * 100);
    const fatPct = totalCalories === 0 ? 0 : 100 - proteinPct - carbsPct;

    setTotalCalories(totalCalories);
    setTotalProtein(totalProtein);
    setTotalCarbs(totalCarbs);
    setTotalFat(totalFat);

    setProteinPercentage(proteinPct);
    setCarbsPercentage(carbsPct);
    setFatPercentage(fatPct);
  }

  const getMeals = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/meals`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      };

      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.log('Error fetching meals by user:', error);
    }
  }

  const updateMealSelection = async () => {
    let index = 0;
    for (let i = 0; i < meals.length; i++) {
      if (meals[i].id === selectedMealId) {
        index = i;
      }
    }
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/meals/${selectedMealId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selected: !meals[index].selected,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      };

      setSelectedMealId('');
      setAddModalVisible(false);
      await getMeals();
    } catch (error) {
      console.log('Error adding meal to Meal Planning landing screen:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getMeals();
    }, [])
  )

  useEffect(() => {
    const selected = meals.filter(meal => meal.selected);
    setSelectedMeals(selected);
    const unselected = meals.filter(meal => !meal.selected);
    setUnselectedMeals(unselected);
    calculateTotals(selected);
  }, [meals]);

  const donutData = [
    { value: proteinPercentage, color: '#73008d', text: 'Protein' },
    { value: carbsPercentage, color: '#b36cd3', text: 'Carbs' },
    { value: fatPercentage, color: '#efcaff', text: 'Fat' },
  ];

  const Item = ({ id, name }: MealData) => (
    <View style={{ flexDirection: 'column', width: '100%', paddingBottom: 5, paddingTop: 5 }}>
      <TouchableOpacity 
        style={styles.workoutButton}
        onPress={() => {
            setSelectedMealId(id);
            setRemoveModalVisible(true);
        }}
      >
        <View style={styles.workoutBox}>
          <Text style={styles.boxText}>{name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
          onPress={() => {router.back()}}
        >
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meal Planning</Text>
      </View>

      <View style={styles.breakdownSection}>
        <View style={styles.donutAndInfoContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoHeader}>Total Breakdown</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#73008d' }}>Protein: {proteinPercentage}%</Text>
                    <Text style={{ color: '#b36cd3' }}>Carbs: {carbsPercentage}%</Text>
                    <Text style={{ color: '#efcaff' }}>Fat: {fatPercentage}%</Text>
                </View>
            </View>

            <View style={{borderWidth: 0.5 , height: '125%'}} />
            
            <View style={styles.donutContainer}>
                {(totalCalories === 0) ? 
                    <Text>Piechart waiting for data</Text> 
                    : 
                    <PieChart
                        data={donutData}
                        donut
                        radius={65}
                        innerRadius={50}
                        centerLabelComponent={() => {
                            return <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>Total Calories {totalCalories}</Text>;
                        }}
                    />
                }
            </View>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View>
          <FlatList 
            data={selectedMeals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item {...item} />}
            contentContainerStyle={{ padding: 10, alignItems: 'center', width: '100%' }}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
        <Modal
          visible={addModalVisible}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setAddModalVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Meal:</Text>
                    <View style={{alignItems: 'center'}}>
                        <FlatList
                            horizontal
                            data={unselectedMeals}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            renderItem={({ item }) => { 
                                const isSelected = item.id === selectedMealId;

                                return (
                                  <TouchableOpacity 
                                      style={{
                                          backgroundColor: isSelected ? '#222222' : '#eee',
                                          padding: 16,
                                          marginRight: 10,
                                          borderRadius: 10,
                                          borderWidth: isSelected ? 2 : 1,
                                          borderColor: isSelected ? '#222222' : '#bababa',
                                          shadowColor: isSelected ? '#222222' : undefined,
                                          shadowOpacity: isSelected ? 0.3 : 0,
                                          shadowOffset: { width: 0, height: 2 },
                                          shadowRadius: isSelected ? 4 : 0,
                                          elevation: isSelected ? 4 : 0,
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                      }}     
                                      onPress={() => setSelectedMealId(item.id)}
                                  >
                                      <Text
                                          style={{
                                              color: isSelected ? 'white' : 'black',
                                              fontWeight: isSelected ? 'bold' : 'normal',
                                              fontSize: 16,
                                          }}
                                      >{item.name}</Text>
                                  </TouchableOpacity>
                                )}
                            }
                        />
                    </View>

                    <Button title="Add Meal" onPress={() => {
                        updateMealSelection();
                        setAddModalVisible(false);
                    }} />
                    <Button title="Close" onPress={() => setAddModalVisible(false)} />
                </View>
            </View>
        </Modal>
        <Modal
          visible={removeModalVisible}
          transparent={true}
          animationType='slide'
          onRequestClose={() => setRemoveModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Button title="Remove Meal" color='red' onPress={() => {
                updateMealSelection();
                setRemoveModalVisible(false);
              }} />
              <Button title="Close" onPress={() => setRemoveModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {router.push('/(logged-in)/screens/meals/ingredients')}}
        >
          <Ionicons name='list-outline' size={24} color='black' />
          <Text style={styles.footerText}>Ingredients List</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {router.push('/(logged-in)/screens/meals/mealList')}}
        >
          <Ionicons name='list-outline' size={24} color='black' />
          <Text style={styles.footerText}>Meals List</Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    height: 120,
  },
  footerButton: {
    marginBottom: 20,
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
  breakdownSection: { 
    borderBottomWidth: 0.5, 
    height: 200, 
    width: '100%', 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  donutAndInfoContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  infoContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoHeader: {
    fontSize: 16, 
    fontWeight: '600', 
    textAlign: 'center', 
    marginTop: 10,
  },
  donutContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  addButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  }, 
  addButtonText: {
    margin: 5,
    fontSize: 16,
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
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
})