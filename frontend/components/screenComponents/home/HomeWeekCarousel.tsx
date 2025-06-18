import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const HomeWeekCarousel = () => {
  // const [loading, setLoading] = useState(true);
  // setLoading(false);

  const Item = ({day, date}: {day: string, date: string}) => (
    <TouchableOpacity>
      <View style={styles.dayBox}>
        <Text style={styles.boxText}>{date}</Text>
        <Text style={styles.boxText}>{day}</Text>
      </View>
    </TouchableOpacity>
  )
 

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <FlatList 
          horizontal
          data={}
          keyExtractor={}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={} 
        />
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name='chevron-forward' size={24} color='black' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeWeekCarousel

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
  },
  dayBox: {
    width: 40,
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  boxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})