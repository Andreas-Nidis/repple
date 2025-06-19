import { StyleSheet, Text, View, Modal, FlatList, TextInput, Button } from 'react-native'
import React, { useState, useEffect } from 'react'

type WeightEntry = {
  week_start: string;
  weight: number;
};


const WeightModal = ({visible, onClose, data, onSubmit}) => {
    const [weights, setWeights] = useState<WeightEntry[]>([]);

    useEffect(() => {
        if (visible) {
            setWeights(data);
        }
    }, [visible, data]);

    const updateWeight = (index: number, newWeight: number) => {
        const newData = [...weights];
        newData[index].weight = newWeight;
        setWeights(newData);
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
                            onChangeText={(text) => updateWeight(index, parseFloat(text))}
                        />
                    </View>
                )}
            />
            <Button title='Save' onPress={() => onSubmit(weights)} />
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
        marginTop: 100,
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
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