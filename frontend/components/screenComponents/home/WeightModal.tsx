import { Text, View, Modal, FlatList, TextInput, Button } from 'react-native'
import React, { useState } from 'react'

const WeightModal = ({visible, onClose, data, onSubmit}) => {
    const [weights, setWeights] = useState(data)

    const updateWeight = (index, newWeight) => {
        const newData = [...weights];
        newData[index].weight = newWeight;
        setWeights(newData);
    };

  return (
    <Modal visible={visible} animationType='slide'>
        <FlatList 
            data={weights}
            keyExtractor={(item) => item.week_start}
            renderItem={({ item, index }) => (
                <View>
                    <Text>{item.week_start}</Text>
                    <TextInput 
                        keyboardType='numeric'
                        value={item.weight?.toString()}
                        onChangeText={(text) => updateWeight(index, parseFloat(text))}
                    />
                </View>
            )}
        />
        <Button title='Save' onPress={() => onSubmit(weights)} />
        <Button title='Close' onPress={onClose} />
    </Modal>
  )
}

export default WeightModal