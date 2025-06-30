import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

type WorkoutData = {
  id: string;
  workout_id: string;
  exercise_id: string;
  name: string;
  sets?: number;
  reps?: number;
  rest_seconds?: number;
}

const WorkoutScreen = () => {
    const router = useRouter();
    const { workoutId } = useLocalSearchParams();
    const [workout, setWorkout] = useState<WorkoutData[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const RestTimer = ({ initialSeconds }: { initialSeconds: number }) => {
        const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
        const [isRunning, setIsRunning] = useState(false);
        const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

        useEffect(() => {
            if (isRunning) {
                intervalRef.current = setInterval(() => {
                    setSecondsLeft(prev => {
                        if (prev <= 1) {
                            clearInterval(intervalRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }, [isRunning]);

        const toggleTimer = () => {
            if (isRunning) {
            // Reset if running
                setIsRunning(false);
                setSecondsLeft(initialSeconds);
            } else {
            // Start if stopped
                setSecondsLeft(initialSeconds);
                setIsRunning(true);
            }
        };

        return (
            <TouchableOpacity style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }} onPress={toggleTimer}>
                <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
            </TouchableOpacity>
        );
    };


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

        } catch (error) {
            console.log('Error fetching and setting exercise data in [workoutId] page:', error);
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

            await getWorkoutExercisesById();
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

    const Item = ({name, sets, reps, rest }: {name: string, sets: number, reps: number, rest: number}) => (
        <TouchableOpacity style={styles.exerciseButton} onPress={() => setModalVisible(true)}>
            <View style={styles.exercise}>
                <Text style={styles.boxTextName}>{name}</Text>
                <View style={styles.exerciseSubBox}>
                    <Text style={styles.boxText}>{sets}</Text>
                    <Text style={styles.boxText}>{reps}</Text>
                    <RestTimer initialSeconds={rest} />
                </View>
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
            <View style={styles.container}>
                {workout[0]?.workout_id ? 
                    (
                        <View style={{ marginTop: 10, padding: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: '30%' }} />  
                                <View style={styles.exerciseHeader}>
                                    <Text style={styles.exerciseHeaderText}>Sets</Text>
                                    <Text style={styles.exerciseHeaderText}>Reps</Text>
                                    <Text style={styles.exerciseHeaderText}>Rest</Text>
                                </View>
                            </View>
                            <FlatList  
                                data={workout}
                                contentContainerStyle={{ paddingTop: 20 }}
                                renderItem={({ item }) =>  <Item name={item.name} sets={item.sets ?? 0} reps={item.reps ?? 0} rest={item.rest_seconds ?? 0} />}
                            />
                        </View> 
                    ) : (
                        <Text>Add an exercise!</Text>
                    )
                }
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Add Exercise</Text>
                </TouchableOpacity>
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
    exerciseButton: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    exercise: {
        flexDirection: 'row',
    },
    boxTextName: {
        fontSize: 16,
        width: '30%',
        padding: 5,
    },
    exerciseSubBox: {
        flexDirection: 'row',
        width: '70%',
    },
    boxText: {
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        width: '33%',
    },
    timerText: {
        fontSize: 16,
    },
    exerciseHeader: {
        flexDirection: 'row',
        width: '70%',
    },
    exerciseHeaderText: {
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        width: '33%',
    },
    addButton: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    }, 
    addButtonText: {
        margin: 5,
    },
})