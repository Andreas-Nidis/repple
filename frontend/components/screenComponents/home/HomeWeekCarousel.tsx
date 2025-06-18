import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import Ionicons from 'react-native-vector-icons/Ionicons'

const HomeWeekCarousel = () => {
  const [weekDays, setWeekDays] = useState<{day: string; date: string}[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = dayjs();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = today.add(i, 'day');
      days.push({
        date: current.format('YYYY-MM-DD'),
        day: current.format('ddd'),
      });
    }
    setWeekDays(days);
  }, [])

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
        {/* <FlatList 
          horizontal
          data={}
          keyExtractor={}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={} 
        /> */}
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