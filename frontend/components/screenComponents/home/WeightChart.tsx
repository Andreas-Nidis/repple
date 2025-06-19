import { StyleSheet, View, TouchableOpacity, Dimensions, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LineChart } from 'react-native-chart-kit'; 
import { getAuth } from '@react-native-firebase/auth';
import WeightModal from './WeightModal';

const screenWidth = Dimensions.get('window').width;

type WeightEntry = {
    week_start: string;
    weight: number;
}

const WeightChart = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [weightData, setWeightData] = useState<WeightEntry[]>([]);
    

    useEffect(() => {
        const loadWeights = async () => {
            try {
                const user = getAuth().currentUser;
                const idToken = await user?.getIdToken();
                const response = await fetch(`http://localhost:3001/api/weights`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    }
                })

                if (!response.ok) {
                    const errorText = await response.text(); // Get the real error
                    console.error('API returned error:', errorText);
                    return;
                }

                const data = await response.json();
                setWeightData(data);
            } catch (error) {
                console.log('Error fetching and setting weight data:', error);
            }
        }
        loadWeights();
    }, []);

    const weights = weightData
        .map(data => typeof data.weight === 'number' ? data.weight : parseFloat(data.weight as string))
        .filter(weight => typeof weight === 'number' && !isNaN(weight));
    const labels = weightData
        .filter(data => typeof data.weight === 'number' || !isNaN(parseFloat(data.weight as string)))
        .map(data =>
            new Date(data.week_start).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
            })
        );

    return (
        <View style={styles.chartContainer}>
            <TouchableOpacity style={styles.chartTouchableOpacity} onPress={() => setModalVisible(true)}>
                {weights.length >= 1 ? (
                <LineChart 
                    data={{
                        labels: labels,
                        datasets: [{data: weights}]
                    }}
                    width={screenWidth - 32}
                    height={220}
                    yAxisSuffix='KG'
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundColor: 'white',
                        backgroundGradientFrom: 'white',
                        backgroundGradientTo: 'lightgray',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(122, 45, 85, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        propsForDots: {
                            r: '5',
                            strokeWidth: '2',
                            stroke: '#000000'
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />) : (
                    <Text>Not enough data available.</Text>
                )}
                <WeightModal 
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    data={weightData}
                    onSubmit={async (updatedData: WeightEntry[]) => {
                        try {
                            const user = getAuth().currentUser;
                            const idToken = await user?.getIdToken();

                            for(const entry of updatedData) {
                                const dateOnly = new Date(entry.week_start).toISOString().split('T')[0];
                                const existing = weightData.find(d => d.week_start === dateOnly);
                                const method = existing ? 'PUT' : 'POST';
                                console.log(method);
                                const url = method === 'POST'
                                    ? `http://localhost:3001/api/weights`
                                    : `http://localhost:3001/api/weights/${entry.week_start}`;
                                console.log(url);

                                await fetch(url, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${idToken}`,
                                    },
                                    body: JSON.stringify({
                                        weekStart: entry.week_start,
                                        weight: parseFloat(entry.weight as unknown as string),
                                    }),
                                });
                            }

                           
                            const response = await fetch(`http://localhost:3001/api/weights`, {
                                headers: {
                                    Authorization: `Bearer ${idToken}`,
                                },
                            });

                            const freshData = await response.json();
                            setWeightData(freshData);
                            setModalVisible(false);
                        } catch (error) {
                            console.error("Failed to save weights:", error);
                        }
                    }}
                
                />
            </TouchableOpacity>
        </View>
    )
}

export default WeightChart

const styles = StyleSheet.create({
    chartContainer: {
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
        width: '95%',
    },
    chartTouchableOpacity: {
        height: '100%', 
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})