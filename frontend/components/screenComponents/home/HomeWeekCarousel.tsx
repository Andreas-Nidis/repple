import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getAuth } from '@react-native-firebase/auth'
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

  const handleDayPress = async (date:string) => {
    setSelectedDay(date);
    setModalVisible(true);
    setLoading(true);

    const params = new URLSearchParams({
      startDate: date,
      endDate: date,
    }).toString();

    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`http://localhost:3001/api/calender?${params}`, {
        headers: {
          Authorization: `Bearer: ${idToken}`,
        },
      });
      const data = await response.json();
      setEntries(data.rows)
    } catch (error) {
      console.log('Error fetching or setting data from within handleDayPress', error);
    } finally {
      setLoading(false)
    }
  }
  
  const Item = ({day, date}: {day: string, date: string}) => (
    <TouchableOpacity onPress={() => handleDayPress(date)}>
      <View style={styles.dayBox}>
        <Text style={styles.boxText}>{day}</Text>
        <Text style={styles.boxText}>{dayjs(date).format('D')}</Text>
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
          data={weekDays}
          keyExtractor={(item) => item.date}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item }) => <Item day={item.day} date={item.date} />} 
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