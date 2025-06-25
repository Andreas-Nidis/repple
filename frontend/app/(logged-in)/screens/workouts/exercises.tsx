import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const exercises = () => {
  return (
    <View style={styles.container}>
      <Text>exercises</Text>
    </View>
  )
}

export default exercises

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})