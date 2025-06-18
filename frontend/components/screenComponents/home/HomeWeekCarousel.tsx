import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons'

type WorkoutDay = {
    date: string;
    isCompleted: boolean;
}

type Props = {
    fetchWeekData: (startOfWeek: string) => Promise<WorkoutDay[]>;
    onSelectDay: (day: WorkoutDay) => void;
}

const HomeWeekCarousel = ({fetchWeekData, onSelectDay}: Props) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [weekData, setWeekData] = useState<WorkoutDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const startOfWeek = dayjs().startOf('week').add(currentWeekOffset, 'week');

  useEffect(() => {
    setLoading(true);
    fetchWeekData(startOfWeek.toISOString())
      .then((data) => setWeekData(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));

  }, [currentWeekOffset]);

  const handleArrowPress = (direction: 'prev' | 'next') => {
    setCurrentWeekOffset((prev) => prev + (direction==='next' ? 1 : -1));
    setSelectedIndex(null);
  }

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => handleArrowPress('prev')}>
          <Ionicons name='chevron-back' size={24} color='#7a2d55' />
        </TouchableOpacity>
        <Text>
          {startOfWeek.format('MMM D')} - {startOfWeek.add(6, 'day').format('MMM D')}
        </Text>
        <TouchableOpacity onPress={() => handleArrowPress('next')}>
          <Ionicons name='chevron-forward' size={24} color='#7a2d55' />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size='small' />
      ) : (
        <FlatList
          horizontal
          data={weekData}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.carousel}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const dayName = dayjs(item.date).format('ddd');
            const dayNum = dayjs(item.date).format('D');
            const isSelected = selectedIndex === index;

            return (
              <TouchableOpacity
                style={[
                  styles.dayBox,
                  isSelected && styles.selectedBox,
                  item.isCompleted && styles.completedBox,
                ]}
                onPress={() => {
                  setSelectedIndex(index);
                  onSelectDay(item);
                }}
              >
                <Text>{dayName}</Text>
                <Text>{dayNum}</Text>
              </TouchableOpacity>

            )
          }}
      )}
    </View>
  )
}

export default HomeWeekCarousel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  }
})