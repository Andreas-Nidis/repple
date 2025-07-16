import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Modal, TextInput, Button } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';

type IngredientData = {
  name: string;
  id: string;
}

const Index = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientData[]>([]);
  const [ingredientName, setIngredientName] = useState('');

  const getIngredientEntries = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/ingredients`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      };

      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.log('Error fetching ingredients data:', error);
    }
  }

  const createNewIngredient = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: ingredientName
        })
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API returned error:', errorText);
        return;
      };

      await getIngredientEntries();
      setModalVisible(false);
      setIngredientName('');
    } catch (error) {
      console.log('Error creating new ingredient:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getIngredientEntries();
    }, [])
  )

  const Item = ({ name, id }: {name: string, id: string}) => (
    <TouchableOpacity style={styles.workoutButton} onPress={() => router.push(`/(logged-in)/screens/meals/ingredients/${id}`)}>
      <View style={styles.workoutBox}>
        <Text style={styles.boxText}>{name}</Text>
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
        <Text style={styles.headerText}>Ingredients List</Text>
      </View>
      <View style={{flex: 1}}>
        <View style={styles.flatlist}>
          {ingredients.length < 1 ? ( <Text>Add an ingredient!</Text> ) : (
            <FlatList 
              data={ingredients}
              contentContainerStyle={{ width: '80%' }}
              renderItem={({ item }) =>  <Item name={item.name} id={item.id} />}
            />
          )}
        </View>
        <View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
            <Text style={styles.addButtonText}>Add Ingredient</Text>
          </TouchableOpacity>
          <Modal 
            visible={modalVisible}
            animationType='slide'
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ingredient Name:</Text>
                <TextInput
                  placeholder="Enter new exercise name"
                  keyboardType="default"
                  value={ingredientName}
                  onChangeText={setIngredientName}
                  style={styles.input}
                />
                <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                <Button title="Save" onPress={() => createNewIngredient()} />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Index

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
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  workoutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // width: '80%',
  },
  workoutBox: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 30,
    margin: 10,
  }, 
  addButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }, 
  addButtonText: {
    margin: 5,
  },
  flatlist: {
    alignItems: 'center',
    padding: 10,
  }
})