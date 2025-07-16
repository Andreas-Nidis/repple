import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Button, FlatList, Modal, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { BASE_URL } from '@/utils/api';

type WorkoutData = {
    id: string;
    workout_id: string;
    exercise_id: string;
    name: string;
    sets?: number;
    reps?: number;
    rest_seconds?: number;
}

type ExerciseData = {
    id: string;
    name: string;
    category?: string;
};

const WorkoutScreen = () => {
    const router = useRouter();
    const { workoutId } = useLocalSearchParams();
    const [workout, setWorkout] = useState<WorkoutData[]>([]);
    const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [userExercises, setUserExercises] = useState<ExerciseData[]>([]);
    const [workoutName, setWorkoutName] = useState('');
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [rest, setRest] = useState(0);

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

    const getWorkoutName = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workouts/${workoutId}`, {
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
            console.log('Fetched workout name:', data);
            setWorkoutName(data.name);
        } catch (error) {
            console.log('Error fetching workout name:', error);
        }
    }

    const getWorkoutExercisesById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workout-exercises/${workoutId}`, {
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

    const getUserExercises = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/exercises`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            }

            const data = await response.json();
            console.log('Fetched exercises:', data);
            setUserExercises(data);

        } catch (error) {
            console.log('Error fetching and setting exercises in workout screen:', error);
        }
    }

    const addExercisetoWorkout = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workout-exercises/${workoutId}/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    exerciseId: selectedExerciseId,
                    sets: sets,
                    reps: reps,
                    restSeconds: rest,
                })
            })
        
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            }
        
            await getWorkoutExercisesById();
            setAddModalVisible(false);
            setSelectedExerciseId('');
            setSets(0);
            setReps(0);
            setRest(0);
        } catch (error) {
            console.log('Error adding exercise to workout:', error);
        }
    }

    const updateWorkoutExercise = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workout-exercises/${workoutId}/exercises/${selectedExerciseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    sets: sets,
                    reps: reps,
                    restSeconds: rest,
                })
            });

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            await getWorkoutExercisesById();
            setExerciseModalVisible(false);
            setSelectedExerciseId('');
            setSets(0);
            setReps(0);
            setRest(0);
        } catch (error) {
            console.log('Error updating exercise in workout:', error);
            setExerciseModalVisible(false);
            setSelectedExerciseId('');
            setSets(0);
            setReps(0); 
            setRest(0);
            alert('Error updating exercise. Please try again.');
        }
    }

    const deleteWorkoutExercise = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workout-exercises/${workoutId}/exercises/${selectedExerciseId}`, {
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

            console.log('Exercise deleted successfully');
            await getWorkoutExercisesById();
            setExerciseModalVisible(false);
            setSelectedExerciseId('');
            setSets(0);
            setReps(0);
            setRest(0);
        } catch (error) {
            console.log('Error deleting exercise from workout:', error);
        }
    }

    const updateWorkout = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/workouts/${workoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    name: workoutName,
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
            const response = await fetch(`${BASE_URL}/api/workouts/${workoutId}`, {
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

            console.log('Workout deleted successfully');
        } catch (error) {
            console.log('Error deleting workout:', error);
        }
    }

    useEffect(() => {
        getWorkoutExercisesById();
        getUserExercises();
        getWorkoutName();
    }, []);

    const Item = ({name, sets, reps, rest, exerciseId }: {name: string, sets: number, reps: number, rest: number, exerciseId: string}) => (
        <TouchableOpacity style={styles.exerciseButton} onPress={() => {
            setExerciseModalVisible(true)
            setSelectedExerciseId(exerciseId);
        }}>
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
                <View style={{ alignItems: 'center', marginTop: 10}}>
                    <Text style={{ fontSize: 18, fontWeight: '500', margin: 10 }}>Workout Name:</Text>
                    <TextInput
                        placeholder={workoutName || 'Workout Name'}
                        keyboardType='default'
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        style={{ fontWeight: '600', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, margin: 10 }}
                    />
                </View>
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
                                renderItem={({ item }) =>  <Item name={item.name} sets={item.sets ?? 0} reps={item.reps ?? 0} rest={item.rest_seconds ?? 0} exerciseId={item.exercise_id} />}
                            />

                            <Modal
                                visible={exerciseModalVisible}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setExerciseModalVisible(false)}
                            >
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>Sets:</Text>
                                        <TextInput
                                            placeholder="Sets"
                                            keyboardType="numeric"
                                            value={sets.toString()}
                                            onChangeText={text => setSets(Number(text))}
                                            style={styles.input}
                                        />
                                        <Text style={styles.modalTitle}>Reps:</Text>
                                        <TextInput
                                            placeholder="Reps"
                                            keyboardType="numeric"
                                            value={reps.toString()}
                                            onChangeText={text => setReps(Number(text))}
                                            style={styles.input}
                                        />
                                        <Text style={styles.modalTitle}>Rest (seconds):</Text>
                                        <TextInput
                                            placeholder="Rest Interval (seconds)"
                                            keyboardType="numeric"
                                            value={rest.toString()}
                                            onChangeText={text => setRest(Number(text))}
                                            style={styles.input}
                                        />

                                        
                                        <Button title="Save" onPress={() => {updateWorkoutExercise()}} />
                                        <Button title="Remove" color="red" onPress={() => deleteWorkoutExercise()} />
                                        <Button title="Close" onPress={() => {
                                            setSelectedExerciseId('');
                                            setExerciseModalVisible(false)
                                        }} />
                                    </View>
                                </View>
                            </Modal>
                            
                        </View> 
                    ) : (
                        <Text>Add an exercise!</Text>
                    )
                }
                <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                    <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
                    <Text style={styles.addButtonText}>Add Exercise</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={addModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Exercise:</Text>
                        <FlatList
                            horizontal
                            data={userExercises}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            renderItem={({ item }) => { 
                                const isSelected = item.id === selectedExerciseId;

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
                                        onPress={() => setSelectedExerciseId(item.id)}
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
                        <Text style={styles.modalTitle}>Sets:</Text>
                        <TextInput
                            placeholder="Sets"
                            keyboardType="numeric"
                            value={sets.toString()}
                            onChangeText={text => setSets(Number(text))}
                            style={styles.input}
                        />
                        <Text style={styles.modalTitle}>Reps:</Text>
                        <TextInput
                            placeholder="Reps"
                            keyboardType="numeric"
                            value={reps.toString()}
                            onChangeText={text => setReps(Number(text))}
                            style={styles.input}
                        />
                        <Text style={styles.modalTitle}>Rest (seconds):</Text>
                        <TextInput
                            placeholder="Rest Interval (seconds)"
                            keyboardType="numeric"
                            value={rest.toString()}
                            onChangeText={text => setRest(Number(text))}
                            style={styles.input}
                        />
                        <Button title="Save" onPress={() => {
                                if (!selectedExerciseId || !sets || !reps || !rest) {
                                    alert('Please fill in all fields');
                                    return;
                                };

                                addExercisetoWorkout();
                                setAddModalVisible(false);
                            }
                        } />
                        <Button title="Cancel" color="gray" onPress={() => setAddModalVisible(false)} />
                    </View>
                </View>
            </Modal>

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
})