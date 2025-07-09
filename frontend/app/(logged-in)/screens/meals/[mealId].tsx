import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import { PieChart } from 'react-native-gifted-charts';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';


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
    const [totalCalories, setTotalCalories] = useState<number>(0);
    const [totalProtein, setTotalProtein] = useState<number>(0);
    const [totalCarbs, setTotalCarbs] = useState<number>(0);
    const [totalFat, setTotalFat] = useState<number>(0);
    const [proteinPercentage, setProteinPercentage] = useState<number>(0);
    const [carbsPercentage, setCarbsPercentage] = useState<number>(0);
    const [fatPercentage, setFatPercentage] = useState<number>(0);
   

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
            // console.log('Meal data:', data);
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
            // console.log('Meal ingredients data:', data);
            setMealIngredients(data);
        } catch (error) {
            console.log('Error fetching meal data:', error);
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

        const proteinPct = Math.round((totalProtein * 4 / totalCalories) * 100);
        const carbsPct = Math.round((totalCarbs * 4 / totalCalories) * 100);
        const fatPct = 100 - proteinPct - carbsPct;

        console.log('Total Calories:', totalCalories);
        console.log('Total Protein in Grams:', totalProtein);
        console.log('Total Carbs in Grams:', totalCarbs);
        console.log('Total Fat in Grams:', totalFat);

        setTotalCalories(totalCalories);
        setTotalProtein(totalProtein);
        setTotalCarbs(totalCarbs);
        setTotalFat(totalFat);

        setProteinPercentage(proteinPct);
        setCarbsPercentage(carbsPct);
        setFatPercentage(fatPct);
    }

    useEffect(() => {
        getMealById();
        getMealIngredients();
    }, []);

    useEffect(() => {
        if (mealIngredients.length > 0) {
            calculateTotals(mealIngredients);
        }
    }, [mealIngredients]);

    const Item = ({ ingredient_name, quantity}: MealIngredientData) => (
        <View style={{ flexDirection: 'row', width: '100%', paddingBottom: 5, paddingTop: 5 }}>
            <Text style={{ fontSize: 18, width: '50%', textAlign: 'center' }}>{ingredient_name}</Text>
            <Text style={{ fontSize: 18, width: '50%', textAlign: 'center' }}>{quantity}</Text>
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
                <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add Ingredient')}>
                    <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Add Ingredient</Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 1, height: 300, width: '100%', position: 'absolute', bottom: 0, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View>
                        <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>Meal Breakdown</Text>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#73008d' }}>Protein {proteinPercentage}</Text>
                            <Text style={{ color: '#b36cd3' }}>Carbs {carbsPercentage}</Text>
                            <Text style={{ color: '#efcaff' }}>Fat {fatPercentage}</Text>
                        </View>
                    </View>

                    <View style={{ margin: 10, borderWidth: 0.5 , height: '100%'}} />
                    
                    <View>
                        <PieChart
                            data={donutData}
                            donut
                            radius={65}
                            innerRadius={50}
                            centerLabelComponent={() => {
                                return <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>Total Calories {totalCalories}</Text>;
                            }}
                        />
                    </View>
                </View>
                
                <View>
                    <TouchableOpacity style={styles.saveButton} onPress={() => console.log('Save Changes to Meal')}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.addButton} onPress={() => console.log('Delete Meal')}>
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
    addButton: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    }, 
    addButtonText: {
        margin: 5,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#e6e6e6',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
})