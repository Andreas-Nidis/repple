import { StyleSheet, Text, View, Modal, FlatList, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getAuth } from '@react-native-firebase/auth';

type WeightEntry = {
  week_start: string;
  weight: number | string;
};


const WeightModal = ({visible, onClose, data, onSubmit}) => {
    const [weights, setWeights] = useState<WeightEntry[]>([]);

    useEffect(() => {
        if (visible) {
            setWeights(data);
        }
    }, [visible, data]);

    const updateWeight = (index: number, newWeightText: string) => {
        if (/^\d*\.?\d*$/.test(newWeightText)) {
            const newData = weights.map((entry, i) =>
                i === index ? { ...entry, weight: newWeightText } : entry
            );
            setWeights(newData);
        }
    };
    
    const addNewEntry = () => {
        const today = new Date();
        const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // ISO week starts on Monday
        const week_start = monday.toISOString().split('T')[0];

        // Prevent duplicates
        if (weights.find(w => w.week_start === week_start)) return;

        setWeights(prev => [...prev, { week_start, weight: 0 }]);
    };

    const deleteEntry = async (index: number) => {
        try {
            const entry = weights[index];
            const dateOnly = new Date(entry.week_start).toISOString().split('T')[0];
            console.log(dateOnly)
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`http://localhost:3001/api/weights/${dateOnly}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete weight');
            }
            const newWeights = [...weights];
            newWeights.splice(index, 1);
            setWeights(newWeights);
        } catch (error) {
            console.error('Delete entry error', error);
        }
    };

  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
        <View style={styles.overlay}>
        <View style={styles.modalContainer}>
            <FlatList 
                data={weights}
                keyExtractor={(item) => item.week_start}
                renderItem={({ item, index }) => (
                    <View style={styles.flatListView}>
                        <Text style={styles.flatListText}>{item.week_start}</Text>
                        <TextInput 
                            style={styles.flatListTextInput}
                            keyboardType='numeric'
                            value={item.weight?.toString()}
                            onChangeText={(text) => updateWeight(index, text)}
                        />
                         <Button title="Delete" color="red" onPress={() => deleteEntry(index)} />
                    </View>
                )}
            />
            <Button title='Add' onPress={addNewEntry} />
            <Button 
                title='Save' 
                onPress={() => onSubmit(
                    weights.map((entry) => ({
                        ...entry,
                        weight: parseFloat(entry.weight as string) || 0,
                    }))
                )} 
            />
            <Button title='Close' onPress={onClose} />
        </View>
        </View>
    </Modal>
  )
}

export default WeightModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '95%',
        height: '75%'
    },
    flatListView: {
        padding: 12, 
        borderBottomWidth: 1, 
        borderColor: '#ccc',
    },
    flatListText: {
        fontSize: 16, 
        marginBottom: 4,
    },
    flatListTextInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: 'white',
    }
})