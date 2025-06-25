import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();

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

      <View style={{flex: 1}}>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => {router.push('/(logged-in)/screens/workouts/exercises')}}
        >
          <Ionicons name='list-outline' size={24} color='black' />
          <Text style={styles.footerText}>Exercise List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default index

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
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    height: 80,
  },
  footerButton: {
    marginBottom: 10,
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
  }
})