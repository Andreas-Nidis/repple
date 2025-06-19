import { TouchableOpacity, Dimensions, Text } from 'react-native'
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
                console.log('Token Id: ', idToken);
                const response = await fetch(`http://localhost:3001/api/weights`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    }
                })
                console.log(response);

                if (!response.ok) {
                    const errorText = await response.text(); // Get the real error
                    console.error('API returned error:', errorText);
                    return;
                }

                const data = await response.json();
                console.log(data);
                setWeightData(data);
            } catch (error) {
                console.log('Error fetching and setting weight data:', error);
            }
        }
        loadWeights();
    }, []);

    const weights = weightData.map(data => data.weight);
    const labels = weightData.map(data => new Date(data.week_start).toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit'
    }));

    return (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            {weights.length >= 2 ? (
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
                    const user = getAuth().currentUser;
                    const idToken = await user?.getIdToken();

                    for(const entry of updatedData) {
                        await fetch(`http://localhost:3001/api/weights`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({
                                weekStart: entry.week_start,
                                weight: entry.weight,
                            }),
                        });
                    }
                    
                    setWeightData(updatedData);
                    setModalVisible(false);
                }}
            
            />
        </TouchableOpacity>
    )
}

export default WeightChart

// const styles = StyleSheet.create({
//     container: {
//         width: '95%',
//         height: '50%',
//         backgroundColor: 'lightgray',
//     }
// })