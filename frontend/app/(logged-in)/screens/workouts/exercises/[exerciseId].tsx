import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Platform, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from '@/utils/api';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';


const ExerciseScreen = () => {
    const router = useRouter();
    const { exerciseId } = useLocalSearchParams();
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState('');
    const [equipment, setEquipment] = useState('');
    const [description, setDescription] = useState('');
    const [tutorialLink, setTutorialLink] = useState('');

    // API call - Get specific exercise by ID
    const getExerciseById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/exercises/${exerciseId}`, {
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
            setExerciseName(data[0].name || '');
            setCategory(data[0].category || '');
            setEquipment(data[0].equipment || '');
            setDescription(data[0].description || '');
            setTutorialLink(data[0].tutorial_url || '');
        } catch (error) {
            console.log('Error fetching and setting exercise data:', error);
        }
    }

    // API call - Update exercise
    const updateExercise = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/exercises/${exerciseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    name: exerciseName,
                    category: category,
                    equipment: equipment,
                    description: description,
                    tutorial_url: tutorialLink,
                })
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            await getExerciseById();
        } catch (error) {
            console.log('Error updating exercise:', error);
        }
    }

    // API call - Delete exercise
    const deleteExercise = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/exercises/${exerciseId}`, {
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

        } catch (error) {
            console.log('Error deleting exercise:', error);
        }
    }

    useEffect(() => {
        getExerciseById();
    }, []);

    return (
        <SafeAreaView style={styles.container}>

            {/* Navigation Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
                    onPress={() => {router.back()}}
                >
                    <Ionicons name='chevron-back' size={24} color='black' />
                </TouchableOpacity>
                <Text style={styles.headerText}>Workout Planning</Text>
            </View>

            {/* Exercise Information - see specific placeholders */}
            <View style={styles.inputsContainer}>
                <TextInput
                    placeholder={exerciseName || "Exercise Name"}
                    keyboardType="default"
                    value={exerciseName}
                    onChangeText={setExerciseName}
                    style={styles.input}
                />
                <TextInput
                    placeholder={category || "Category"}
                    keyboardType="default"
                    value={category}
                    onChangeText={setCategory}
                    style={styles.input}
                />
                <TextInput
                    placeholder={equipment || "Equipment"}
                    keyboardType="default"
                    value={equipment}
                    onChangeText={setEquipment}
                    style={styles.input}
                />
                <TextInput
                    placeholder={description || "Description"}
                    keyboardType="default"
                    value={description}
                    onChangeText={setDescription}
                    style={styles.input}
                />
                <TextInput
                    placeholder={tutorialLink || "Tutorial Link"}
                    keyboardType="default"
                    value={tutorialLink}
                    onChangeText={setTutorialLink}
                    style={styles.input}
                />

                {/* Update Exercise Information Button */}
                <TouchableOpacity style={styles.addButton} onPress={ async () => {
                    await updateExercise();
                    router.back();
                }}>
                    <Ionicons name='save-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Save Workout</Text>
                </TouchableOpacity>

                {/* Delete Exercise Button */}
                <TouchableOpacity style={styles.addButton} onPress={ async () => {
                    await deleteExercise()
                    router.back()
                }}>
                    <MaterialDesignIcons name='delete-outline' size={26} color='black' />
                    <Text style={styles.addButtonText}>Delete Workout</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

export default ExerciseScreen

// Styles for component
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    addButton: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
    }, 
    addButtonText: {
        margin: 5,
    },
})