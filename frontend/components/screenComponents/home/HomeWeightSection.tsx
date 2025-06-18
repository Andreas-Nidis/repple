import { StyleSheet, Text, View } from 'react-native'
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

const HomeWeightSection = () => {
  return (
    <View style={styles.container}>
      <Text>HomeWeightSection</Text>
    </View>
  )
}

export default HomeWeightSection

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
        height: '50%',
        backgroundColor: 'lightgray',
    }
})