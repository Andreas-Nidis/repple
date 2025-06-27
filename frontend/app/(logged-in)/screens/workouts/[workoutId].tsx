import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

type WorkoutData = {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets?: number;
  reps?: number;
  rest_seconds?: number;
}

type ExerciseData = {
    exercise_id: string;
    sets?: number;
    reps?: number;
    rest_seconds?: number;
}

const WorkoutScreen = () => {
    const router = useRouter();
    const { workoutId } = useLocalSearchParams();
    const [workout, setWorkout] = useState<WorkoutData[]>([]);
    const [exercises, setExercises] = useState<ExerciseData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const formatRest = (restInSeconds) => {
        
    } 

    const getWorkoutExercisesById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/workout-exercises/${workoutId}`, {
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
            console.log(data);
            setWorkout(data);

            // for (let i; i < workout.)

        } catch (error) {
            console.log('Error fetching and setting weight data:', error);
        }
    }

    const addExercisetoWorkout = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/workout-exercises/${workoutId}/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    // name: newWorkoutName,
                    // category: newWorkoutCategory,
                })
            })
        
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            }
        
            await getWorkoutExercisesById();
            setModalVisible(false);
            // setNewExercise();
            // setNewSets();
            // setNewReps();
            // setNewRestInterval();
        } catch (error) {
            console.log('Error fetching and setting weight data:', error);
        }
    }

    const updateWorkout = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/exercises/${workoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    // name: ,
                    // sets: ,
                    // reps: ,
                    // rest_seconds: ,
                })
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            await getWorkoutById();
        } catch (error) {
            console.log('Error updating exercise:', error);
        }
    }

    const deleteWorkout = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/workouts/${workoutId}`, {
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
            console.log('Error deleting workout:', error);
        }
    }

    useEffect(() => {
        getWorkoutExercisesById();
    }, []);

    const Item = ({name, sets, reps, rest }: {name: string, sets: number, reps: number, formattedRest: number}) => (
        <TouchableOpacity style={styles.exerciseButton} onPress={() => setModalVisible(true)}>
            <View style={styles.exerciseBox}>
                <Text style={styles.boxText}>{name}</Text>
                <Text style={styles.boxText}>{sets}</Text>
                <Text style={styles.boxText}>{reps}</Text>
                <Text style={styles.boxText}>{formatRest(rest)}</Text>
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
            <View>
                {workout[0]?.workout_id ? <Text>Hehehe, amazing exercises</Text> : <Text>We need cheese</Text>}
            </View>
            <View>
                <FlatList  data={}
                    contentContainerStyle={{ width: '80%' }}
                    renderItem={({ item }) =>  <Item name={item.name} sets={item.sets} reps={item.reps} rest={item.rest_interval} />}
                />
            </View>

            <Button title="Save" onPress={() => updateWorkout()} />
            <Button title="Delete" onPress={ async () => {
                await deleteWorkout()
                router.back()
            }} />
        </SafeAreaView>
    )
}

export default WorkoutScreen

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
})