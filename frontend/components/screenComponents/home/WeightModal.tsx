// import { StyleSheet, Text, View, Modal, FlatList, TextInput, Button } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { getAuth } from '@react-native-firebase/auth';

// type WeightEntry = {
//   week_start: string;
//   weight: number | string;
// };


// const WeightModal = ({visible, data, onSubmit}) => {
//     const [weights, setWeights] = useState<WeightEntry[]>([]);

//     useEffect(() => {
//         if (visible) {
//             setWeights(data);
//         }
//     }, [visible, data]);


//     const addNewEntry = () => {
        
//     };

//     const updateWeight = (index: number, newWeightText: string) => {
        
//     };

//     const deleteEntry = async (index, weekStart) => {
//         const weekStartDate = new Date(weekStart);
//         const formattedDate = weekStartDate.toISOString().split('T')[0];
//         const weight = weights[index];
//         const user = getAuth().currentUser;
//         const idToken = await user?.getIdToken();
//         const response = await fetch(`http://localhost:3001/api/weights/${formattedDate}`, {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `Bearer ${idToken}`,
//             }
//         })
//         console.log(response);

//         if(response.ok) {
//             console.log("Weight", `${weight.weight}kg`, formattedDate, "deleted successfully");
//         } else {
//             console.log("Error deleting weight");
//         }
//     };

//   return (
//     <Modal visible={visible} animationType='slide' transparent={true}>
//         <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//             <FlatList 
//                 data={weights}
//                 keyExtractor={(item) => item.week_start}
//                 renderItem={({ item, index }) => (
//                     <View style={styles.flatListView}>
//                         <Text style={styles.flatListText}>{item.week_start}</Text>
//                         <TextInput 
//                             style={styles.flatListTextInput}
//                             keyboardType='numeric'
//                             value={item.weight?.toString()}
//                             onChangeText={(text) => updateWeight(index, text)}
//                         />
//                          <Button title="Delete" color="red" onPress={() => deleteEntry(index, item.week_start)} />
//                     </View>
//                 )}
//             />
//             <Button title='Add' onPress={addNewEntry} />
//             <Button 
//                 title='Save' 
//                 onPress={() => onSubmit(
//                     weights.map((entry) => ({
//                         ...entry,
//                         weight: parseFloat(entry.weight as string) || 0,
//                     }))
//                 )} 
//             />
//         </View>
//         </View>
//     </Modal>
//   )
// }

// export default WeightModal

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(255, 255, 255, 0)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     modalContainer: {
//         marginHorizontal: 20,
//         backgroundColor: 'white',
//         borderRadius: 8,
//         padding: 20,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         width: '95%',
//         height: '75%'
//     },
//     flatListView: {
//         padding: 12, 
//         borderBottomWidth: 1, 
//         borderColor: '#ccc',
//     },
//     flatListText: {
//         fontSize: 16, 
//         marginBottom: 4,
//     },
//     flatListTextInput: {
//         height: 40,
//         borderColor: 'black',
//         borderWidth: 1,
//         paddingHorizontal: 8,
//         borderRadius: 8,
//         backgroundColor: 'white',
//     }
// })