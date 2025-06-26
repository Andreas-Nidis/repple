import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ExerciseData = {
  id: string;
  name: string;
  category?: string;
  equipment?: string;
  description?: string;
  tutorial_url?: string;
}

const ExerciseScreen = () => {
    const router = useRouter();
    const { exerciseId } = useLocalSearchParams();
    const [exercise, setExercise] = useState<ExerciseData[]>([]);

    // const formatRest = () => {

    // } 

    const getExerciseById = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/exercises/${exerciseId}`, {
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
            // console.log(data);
            setExercise(data);
        } catch (error) {
            console.log('Error fetching and setting weight data:', error);
        }
    }

    useEffect(() => {
        getExerciseById();
    }, []);

    // const Item = ({name, sets, reps, formattedRest }: {name: string, sets: number, reps: number, formattedRest: number}) => (
    //     <TouchableOpacity style={styles.workoutButton} onPress={() => setModalVisible(true)}>
    //         <View style={styles.workoutBox}>
    //             <Text style={styles.boxText}>{name}</Text>
    //             <Text style={styles.boxText}>{sets}</Text>
    //             <Text style={styles.boxText}>{reps}</Text>
    //             <Text style={styles.boxText}>{formattedRest}</Text>
    //         </View>
    //     </TouchableOpacity>
    // )

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
                <Text>{exercise[0]?.name}</Text>
            </View>
        </SafeAreaView>
    )
}

export default ExerciseScreen

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