import { StyleSheet, View, TouchableOpacity, Dimensions, Text, TextInput, Modal, Button, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LineChart } from 'react-native-chart-kit'; 
import { getAuth } from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker'
import { BASE_URL } from '@/utils/api';

const screenWidth = Dimensions.get('window').width;

type WeightEntry = {
    entry_date: string;
    weight: number;
}

const WeightChart = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [weightData, setWeightData] = useState<WeightEntry[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weightInput, setWeightInput] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    function formatDateLocal(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const getWeightEntries = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/weights`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                }
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                return;
            }

            const data = await response.json();
            setWeightData(data);
        } catch (error) {
            console.log('Error fetching and setting weight data:', error);
        }
    };

    const handleAddEntry = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();

            const isoDate = formatDateLocal(selectedDate);
            const weightNumber = parseFloat(weightInput);

            if (isNaN(weightNumber)) {
                alert("Please enter a valid number.");
                return;
            }

            const response = await fetch(`${BASE_URL}/api/weights`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    entryDate: isoDate,
                    weight: weightNumber
                })
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("Error posting weight:", error);
                return;
            }

            await getWeightEntries(); // Refresh the chart
            setModalVisible(false);
            setWeightInput('');
        } catch (error) {
            console.error('Failed to add weight entry:', error);
        }
    };

    

    const entryExistsForDate = (date: Date) => {
        const selectedDateStr = formatDateLocal(date);
        return weightData.some(entry => entry.entry_date === selectedDateStr);
    };

    useEffect(() => {
        getWeightEntries();
    }, []);

    // useEffect(() => {
    //     console.log('Current weightData dates:', weightData.map(e => e.entry_date));
    // }, [weightData]);

    const weights = weightData
        .map(data => typeof data.weight === 'number' ? data.weight : parseFloat(data.weight as string))
        .filter(weight => typeof weight === 'number' && !isNaN(weight));
    const labels = weightData
        .filter(data => typeof data.weight === 'number' || !isNaN(parseFloat(data.weight as string)))
        .map(data =>
            new Date(data.entry_date).toLocaleDateString('en-GB', {
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
                <Modal
                    visible={modalVisible}
                    animationType='slide'
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Weight Entry</Text>

                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {selectedDate.toDateString()}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) setSelectedDate(date);
                                    }}
                                />
                            )}

                            <TextInput
                                placeholder="Enter weight (kg)"
                                keyboardType="numeric"
                                value={weightInput}
                                onChangeText={setWeightInput}
                                style={styles.input}
                            />

                            <View style={styles.buttonRow}>
                                <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                                <Button title="Save" onPress={handleAddEntry} />
                                {entryExistsForDate(selectedDate) && (
                                    <Button title="Delete Entry" color="red" onPress={async () => {
                                        try {
                                            const user = getAuth().currentUser;
                                            const idToken = await user?.getIdToken();
                                            const isoDate = formatDateLocal(selectedDate);

                                            const response = await fetch(`${BASE_URL}/api/weights/${isoDate}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    Authorization: `Bearer ${idToken}`
                                                }
                                            });

                                            if (!response.ok) {
                                                const error = await response.text();
                                                console.error("Failed to delete entry:", error);
                                                return;
                                            }

                                            await getWeightEntries();
                                            setModalVisible(false);
                                            setWeightInput('');
                                        } catch (error) {
                                            console.error("Delete error:", error);
                                        }
                                    }} />
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
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
    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center'
    },
    datePickerText: {
        color: '#000',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})