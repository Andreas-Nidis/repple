import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '@/utils/api';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';


const IngredientScreen = () => {
    const router = useRouter();
    const { ingredientId } = useLocalSearchParams();
    const [ingredientName, setIngredientName] = useState('');
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    // Function to fetch ingredient data by ID and set local states
    const getIngredientById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/ingredients/${ingredientId}`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            const data = await response.json();
            // console.log('Fetched ingredient data:', data);
            setIngredientName(data.name || '');
            setProtein(data.protein || 0);
            setFat(data.fat || 0);
            setCarbs(data.carbs || 0);
        } catch (error) {
            console.log('Error fetching and setting ingredient data:', error);
        }
    }

    // Update ingredient function to send PUT request with updated values
    const updateIngredient = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/ingredients/${ingredientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    protein: protein,
                    fat: fat,
                    carbs: carbs,
                })
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            await getIngredientById();
            router.back();
        } catch (error) {
            console.log('Error updating exercise:', error);
        }
    }

    // Delete ingredient function to send DELETE request
    const deleteIngredient = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/ingredients/${ingredientId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            router.back()
        } catch (error) {
            console.log('Error deleting exercise:', error);
        }
    }

    useEffect(() => {
        getIngredientById();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
                    onPress={() => {router.back()}}
                >
                    <Ionicons name='chevron-back' size={24} color='black' />
                </TouchableOpacity>
                <Text style={styles.headerText}>{ingredientName}</Text>
            </View>
            <View style={styles.inputsContainer}>
                <Text style={styles.inputHeader}>Protein</Text>
                <TextInput
                    placeholder={protein.toString() || "Protein"}
                    keyboardType="numeric"
                    value={protein.toString()}
                    onChangeText={text => setProtein(Number(text))}
                    style={styles.input}
                />
                <Text style={styles.inputHeader}>Fat</Text>
                <TextInput
                    placeholder={fat.toString() || "Fat"}
                    keyboardType="numeric"
                    value={fat.toString()}
                    onChangeText={text => setFat(Number(text))}
                    style={styles.input}
                />
                <Text style={styles.inputHeader}>Carbohydrates</Text>
                <TextInput
                    placeholder={carbs.toString() || "Carbs"}
                    keyboardType="numeric"
                    value={carbs.toString()}
                    onChangeText={text => setCarbs(Number(text))}
                    style={styles.input}
                />

                <Text style={styles.inputHeader}>***per 100g/ml</Text>
                <TouchableOpacity style={styles.addButton} onPress={ async () => {
                    await updateIngredient()
                }}>
                    <Ionicons name='save-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Save Ingredient</Text>
                </TouchableOpacity>
                    
                <TouchableOpacity style={styles.addButton} onPress={ async () => {
                    await deleteIngredient()
                }}>
                    <MaterialDesignIcons name='delete-outline' size={26} color='black' />
                    <Text style={styles.addButtonText}>Delete Ingredient</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default IngredientScreen

// Styles for the component
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
  },
  inputHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
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
  },
})