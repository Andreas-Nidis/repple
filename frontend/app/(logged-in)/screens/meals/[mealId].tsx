import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import Svg, { Circle, G } from 'react-native-svg';

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

const MealScreen = () => {
    const router = useRouter();
    const { mealId } = useLocalSearchParams();
    const [meal, setMeal] = useState<MealData[]>([]);
    const [mealIngredients, setMealIngredients] = useState<MealIngredientData[]>([]);

    const getMealById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/meals/${mealId}`, {
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
            console.log('Meal data:', data);
            setMeal(data);
        } catch (error) {
            console.log('Error fetching meal by ID:', error);
        }
    }

    const getMealIngredients = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/meal-ingredients/${mealId}`, {
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
            console.log('Meal ingredients data:', data);
            setMealIngredients(data);
        } catch (error) {
            console.log('Error fetching meal data:', error);
        }
    }

    useEffect(() => {
        getMealById();
        getMealIngredients();
    }, []);

    const Item = ({ ingredient_name, quantity, unit, protein, fat, carbs }: MealIngredientData) => (
        <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 5, paddingTop: 5 }}>
            <Text style={{ fontSize: 18, width: '50%', textAlign: 'center' }}>{ingredient_name}</Text>
            <Text style={{ fontSize: 18, width: '50%', textAlign: 'center' }}>{quantity}</Text>
        </View>
    );

    const DoughnutChart = () => {

    };


            
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
                    onPress={() => {router.back()}}
                >
                    <Ionicons name='chevron-back' size={24} color='black' />
                </TouchableOpacity>
                <Text style={styles.headerText}>{meal.length > 0 ? meal[0].name : 'Meal'}</Text>
            </View>
            <View style={{ flex: 1, width: '95%', alignItems: 'center' }}>
                { mealIngredients.length > 0 ? ( 
                    <View style={styles.inputsContainer}>
                        <View style={{ flexDirection: 'row', width: '95%'}}>
                            <View style={styles.exerciseHeader}>
                                <Text style={styles.exerciseHeaderText}>Ingredient</Text>
                                <Text style={styles.exerciseHeaderText}>Quantity(g/ml)</Text>
                            </View>
                        </View>
                        <FlatList 
                            data={mealIngredients}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <Item {...item} />}
                            contentContainerStyle={{ padding: 10, alignItems: 'center', width: '100%' }}
                        />
                    </View>
                ) : (
                    <View style={styles.inputsContainer}>
                        <Text style={styles.inputHeader}>Add an ingredient!</Text>
                    </View>
                )}
                <Button title="Add Ingredient" onPress={() => console.log('wow')} />
                <Button title="Save" onPress={() => console.log('wow')} />
                <Button title="Delete" onPress={() => console.log('wow')} />
            </View>
            <View style={{ borderWidth: 1, height: 300, width: '100%', position: 'absolute', bottom: 0, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                {/* <DoughnutChart /> */}
                <Text>Wow</Text>
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
    },
    inputHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    exerciseHeader: {
        flexDirection: 'row',
        width: '100%',
    },
    exerciseHeaderText: {
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        width: '50%',
        fontWeight: '600',
    },
})