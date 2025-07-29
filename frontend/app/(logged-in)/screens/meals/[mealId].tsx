import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Modal, Button, Platform, StatusBar } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import { PieChart } from 'react-native-gifted-charts';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BASE_URL } from '@/utils/api';

type MealData = {
    id: string;
    name: string;
}

type MealIngredientData = {
    id: string;
    meal_id: string;
    ingredient_id: string;
    quantity: number;
    unit: string;
    ingredient_name: string;
    protein: number;
    fat: number;
    carbs: number;
}

type IngredientsData = {
    id: string;
    name: string;
}

const MealScreen = () => {
    const router = useRouter();
    const { mealId } = useLocalSearchParams();
    const [meal, setMeal] = useState<MealData[]>([]);
    const [mealIngredients, setMealIngredients] = useState<MealIngredientData[]>([]);
    const [userIngredients, setUserIngredients] = useState<IngredientsData[]>([]); // Assuming you have a way to fetch user ingredients
    const [totalCalories, setTotalCalories] = useState<number>(0);
    const [totalProtein, setTotalProtein] = useState<number>(0);
    const [totalCarbs, setTotalCarbs] = useState<number>(0);
    const [totalFat, setTotalFat] = useState<number>(0);
    const [proteinPercentage, setProteinPercentage] = useState<number>(0);
    const [carbsPercentage, setCarbsPercentage] = useState<number>(0);
    const [fatPercentage, setFatPercentage] = useState<number>(0);
    const [newQuantity, setNewQuantity] = useState<number>(0);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
    const [removeModalVisible, setRemoveModalVisible] = useState<boolean>(false);
    const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
   

    const getMealById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meals/${mealId}`, {
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
            setMeal(data);
        } catch (error) {
            console.log('Error fetching meal by ID:', error);
        }
    }

    const getMealIngredients = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meal-ingredients/${mealId}`, {
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
            // console.log('Meal ingredients data:', data);
            setMealIngredients(data);
        } catch (error) {
            console.log('Error fetching meal data:', error);
        }
    }

    const getUserIngredients = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/ingredients`, {
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
            // console.log('User ingredients data:', data);
            setUserIngredients(data);
        } catch (error) {
            console.log('Error fetching user ingredients:', error);
        }
    }

    const calculateTotals = (ingredients: MealIngredientData[]) => {
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        ingredients.forEach(ingredient => {
            const quantityMultiplier = ingredient.quantity / 100
            totalCalories += ((ingredient.protein * 4) + (ingredient.carbs * 4) + (ingredient.fat * 9))* quantityMultiplier;
            totalProtein += ingredient.protein * quantityMultiplier;
            totalCarbs += ingredient.carbs * quantityMultiplier;
            totalFat += ingredient.fat * quantityMultiplier;
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

    const addIngredient = async () => {
        if (!selectedIngredientId || newQuantity <= 0) {
            console.error('No ingredient selected or invalid quantity');
            return;
        }

        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meal-ingredients/${mealId}/${selectedIngredientId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    quantity: newQuantity 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            };

            await updateMeal();
            setAddModalVisible(false);
            setNewQuantity(0);
            setSelectedIngredientId('');
            await getMealIngredients();
        } catch (error) {
            console.log('Error adding ingredient:', error);
        }
    }

    const removeIngredientFromMeal = async () => {
        if (!selectedIngredientId) {
            console.error('No ingredient selected for removal');
            return;
        }

        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meal-ingredients/${mealId}/${selectedIngredientId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            };

            setRemoveModalVisible(false);
            await getMealIngredients();
        } catch (error) {
            console.log('Error removing ingredient:', error);
        }
    }

    const updateIngredientQuantity = async () => {
        if (!selectedIngredientId || newQuantity <= 0) {
            console.error('No ingredient selected or invalid quantity');
            return;
        }

        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meal-ingredients/${mealId}/${selectedIngredientId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    quantity: newQuantity 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            };

            await updateMeal();
            setRemoveModalVisible(false);
            setNewQuantity(0);
            setSelectedIngredientId('');
            await getMealIngredients();
        } catch (error) {
            console.log('Error updating ingredient quantity:', error);
        }
    }

    const deleteMeal = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meals/${mealId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            };

            router.back();
        } catch (error) {
            console.log('Error deleting meal:', error);
        }
    }

    const updateMeal = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/meals/${mealId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    total_protein: totalProtein,
                    total_carbs: totalCarbs,
                    total_fat: totalFat,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            };
        } catch (error) {
            console.log('Error updating ingredient quantity:', error);
        }
    }

    useEffect(() => {
        getMealById();
        getMealIngredients();
        getUserIngredients();
    }, []);

    useEffect(() => {
        calculateTotals(mealIngredients);
    }, [mealIngredients]);

    const Item = ({ ingredient_name, quantity, ingredient_id }: MealIngredientData) => (
        <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 5, paddingTop: 5 }}>
            <TouchableOpacity 
                style={styles.mealIngredientContainer}
                onPress={() => {
                    setSelectedIngredientId(ingredient_id);
                    setRemoveModalVisible(true);
                }}
            >
                <Text style={[styles.mealIngredientText, { width: '48%' }]}>{ingredient_name}</Text>
                <Text style={[styles.mealIngredientText, { width: '48%' }]}>{quantity}</Text>
            </TouchableOpacity>
        </View>
    );

    const donutData = [
        { value: proteinPercentage, color: '#73008d', text: 'Protein' },
        { value: carbsPercentage, color: '#b36cd3', text: 'Carbs' },
        { value: fatPercentage, color: '#efcaff', text: 'Fat' },
    ];
            
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity 
                    style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
                    onPress={() => {
                        updateMeal();
                        router.back()
                    }}
                >
                    <Ionicons name='chevron-back' size={24} color='black' />
                </TouchableOpacity>
                <Text style={styles.headerText}>{meal.length > 0 ? meal[0].name : 'Meal'}</Text>
            </View>
            
            <View style={{ flex: 1, width: '95%', alignItems: 'center' }}>
                { mealIngredients.length > 0 ? ( 
                    <View style={styles.inputsContainer}>
                        <View style={{ flexDirection: 'row', width: '95%'}}>
                            <View style={styles.mealIngredientsHeader}>
                                <Text style={styles.mealIngredientsHeaderText}>Ingredient</Text>
                                <Text style={styles.mealIngredientsHeaderText}>Quantity(g/ml)</Text>
                            </View>
                        </View>
                        <FlatList 
                            data={mealIngredients}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Item {...item} />}
                            contentContainerStyle={{ padding: 10, alignItems: 'center', width: '100%' }}
                        />
                        <Modal
                            visible={removeModalVisible}
                            transparent={true}
                            animationType='slide'
                            onRequestClose={() => setRemoveModalVisible(false)}
                        >
                            <View style={styles.modalBackground}>
                                <View style={styles.modalContent}>
                                    <TextInput 
                                        style={styles.input} 
                                        value={newQuantity.toString()}
                                        keyboardType='numeric'
                                        onChangeText={(text) => setNewQuantity(Number(text))}
                                        placeholder='Quantity...'
                                    />
                                    <Button title="Update Quantity" onPress={() => {
                                        updateIngredientQuantity();
                                        setRemoveModalVisible(false);
                                    }} />
                                    <Button title="Remove Ingredient" color="red" onPress={() => {
                                        removeIngredientFromMeal();
                                        setRemoveModalVisible(false);
                                    }} />
                                    <Button title="Close" onPress={() => setRemoveModalVisible(false)} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                ) : (
                    <View style={styles.inputsContainer}>
                        <Text style={styles.inputHeader}>Add an ingredient!</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                    <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Add Ingredient</Text>
                </TouchableOpacity>
                <Modal
                    visible={addModalVisible}
                    transparent={true}
                    animationType='slide'
                    onRequestClose={() => setAddModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Ingredient:</Text>
                            <View style={{alignItems: 'center'}}>
                                <FlatList
                                    horizontal
                                    data={userIngredients}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ paddingBottom: 10 }}
                                    renderItem={({ item }) => { 
                                        const isSelected = item.id === selectedIngredientId;
        
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
                                                onPress={() => setSelectedIngredientId(item.id)}
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
                            <Text style={styles.modalTitle}>Quantity:</Text>
                            <TextInput
                                placeholder="Quantity in grams/ml"
                                keyboardType="numeric"
                                value={newQuantity.toString()}
                                onChangeText={text => setNewQuantity(Number(text))}
                                style={styles.input}
                            />

                            <Button title="Add Ingredient" onPress={() => {
                                addIngredient();
                                setAddModalVisible(false);
                            }} />
                            <Button title="Close" onPress={() => setAddModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.footer}>
                <View style={styles.donutAndInfoContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Meal Breakdown</Text>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#73008d' }}>Protein: {proteinPercentage}%</Text>
                            <Text style={{ color: '#b36cd3' }}>Carbs: {carbsPercentage}%</Text>
                            <Text style={{ color: '#efcaff' }}>Fat: {fatPercentage}%</Text>
                        </View>
                    </View>

                    <View style={{borderWidth: 0.5 , height: '100%'}} />
                    
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
                
                <View>
                    <TouchableOpacity style={styles.addButton} onPress={() => deleteMeal()}>
                        <MaterialDesignIcons name='delete-outline' size={26} color='black' />
                        <Text style={styles.addButtonText}>Delete Meal</Text>
                    </TouchableOpacity>
                </View>            
                
            </View>
        </SafeAreaView>
    )
}

export default MealScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
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
    inputsContainer: {
        width: '95%',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        width: '60%',
        textAlign: 'center',
        alignSelf: 'center',
    },
    inputHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    mealIngredientsHeader: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    mealIngredientsHeaderText: {
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        width: '50%',
        fontWeight: '600',
    },
    mealIngredientContainer: { 
        width: '100%',
        alignItems: 'center', 
        justifyContent: 'space-around', 
        flexDirection: 'row',
    },
    mealIngredientText: {
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        fontSize: 16, 
        textAlign: 'center',
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
    footer: { 
        borderWidth: 1, 
        height: 300, 
        width: '100%', 
        position: 'absolute', 
        bottom: 0, 
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
})