import { FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, { useState, useEffect } from 'react'
import { getAuth } from '@react-native-firebase/auth'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CalendarModal from './CalendarModal'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const HomeWeekCarousel = () => {
  const [weekDays, setWeekDays] = useState<{day: string; date: string}[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const generateWeek = (offset: number) => {
    const startOfWeek = dayjs().add(offset, 'week').startOf('isoWeek');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = startOfWeek.add(i, 'day');
      days.push({
        date: current.format('YYYY-MM-DD'),
        day: current.format('ddd'),
      });
    }
    setWeekDays(days);
  };

  useEffect(() => {
    generateWeek(weekOffset);
  }, [weekOffset])

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
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('API returned error:', errorText);
        return;
      }

      const data = await response.json();
      setEntries(data)
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
        <TouchableOpacity onPress={() => {
          const newOffset = weekOffset + -1;
          setWeekOffset(newOffset);
          generateWeek(newOffset);
        }}>
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <FlatList 
          horizontal
          data={weekDays}
          keyExtractor={(item) => item.date}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={({ item }) => <Item day={item.day} date={item.date} />} 
        />

        <CalendarModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          selectedDay={selectedDay}
          loading={loading}
          entries={entries}
        />

        <TouchableOpacity onPress={() => {
          const newOffset = weekOffset + 1;
          setWeekOffset(newOffset);
          generateWeek(newOffset);
        }}>
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
  modalContainer: {
    flex: 1,
    marginTop: 100,
    marginBottom: 100,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
})