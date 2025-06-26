import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import { useLocalSearchParams } from 'expo-router';

type WorkoutData = {
  name: string;
  category: string;
  id: string;
};

const WorkoutScreen = () => {
    const { workoutId } = useLocalSearchParams();
    console.log(workoutId);
    const [workoutData, setWorkoutData] = useState<WorkoutData>()

    const getWorkoutById = async () => {
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
            setWorkoutData(data);
        } catch (error) {
            console.log('Error fetching and setting weight data:', error);
        }
    }

    useEffect(() => {
        getWorkoutById();
    }, []);

    return (
        <View style={styles.container}>
            <Text>{workoutData?.id}</Text>
        </View>
    )
}

export default WorkoutScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})