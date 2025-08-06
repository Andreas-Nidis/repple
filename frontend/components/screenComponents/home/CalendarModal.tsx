import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View, Button, FlatList } from 'react-native';
import dayjs from 'dayjs';
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';
import socket from '@/utils/socket';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

// Type Definitions
type CalendarEntry = {
  id: string;
  workout_id: string;
  is_completed: boolean;
};

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDay: string | null;
  loading: boolean;
  entries: CalendarEntry[];
};

type WorkoutData = {
    id: string;
    workout_id: string;
    exercise_id: string;
    workout_name: string;
    name: string;
    sets?: number;
    reps?: number;
    rest_seconds?: number;
}

type UserWorkout = {
  id: string;
  name: string;
};

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  selectedDay,
  loading,
  entries,
}) => {
  const [workout, setWorkout] = useState<WorkoutData[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const workoutId = entries.length > 0 ? entries[0].workout_id : '';
  const [modalVisible, setModalVisible] = useState(false);
  const [userWorkouts, setUserWorkouts] = useState<UserWorkout[]>([]);
  const [workoutToggle, setWorkoutToggle] = useState<boolean>(false);

  // API call - Get all user workout
  const getUserWorkouts = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`${BASE_URL}/api/workouts`, {
              headers: {
                  Authorization: `Bearer ${idToken}`,
              }
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.log('API returned error:', errorText);
              return;
          }

          const data = await response.json();
          setUserWorkouts(data);
      } catch (error) {
          console.log('Error fetching user workouts in the Calendar:', error);
      }
  };

  // API call - Get workout exercises from selected workout
  const getWorkoutExercisesById = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`${BASE_URL}/api/workout-exercises/${workoutId}`, {
              headers: {
                  Authorization: `Bearer ${idToken}`,
              }
          });

          if(!response.ok) {
              const errorText = await response.text();
              console.log('API returned error:', errorText);
              return;
          }

          const data = await response.json();
          setWorkout(data);

      } catch (error) {
          console.log('Error fetching and setting exercise data in the Calendar:', error);
      }
  }

  // API call - Add workout to calendar day
  const addEntry = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`${BASE_URL}/api/calendar`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                  scheduled_date: selectedDay,
                  workout_id: selectedWorkoutId,
              }),
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.log('API returned error:', errorText);
              return;
          }

          setSelectedWorkoutId(null);
          onClose();
      } catch (error) {
          console.log('Error adding calendar entry:', error);
      }
  }

  // API call - Remove workout from calendar dat
  const removeEntry = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`${BASE_URL}/api/calendar/${entries[0].id}`, {
              method: 'DELETE',
              headers: {
                  Authorization: `Bearer ${idToken}`,
              },
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.log('API returned error:', errorText);
              return;
          }

          onClose();
      } catch (error) {
          console.log('Error removing calendar entry:', error);
      }
  };

  // Function for formatting time in MM:SS (minutes:seconds))
  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  // Rest Timer component that counts down set rest interval
  // Resets when pressed again
  const RestTimer = ({ initialSeconds }: { initialSeconds: number }) => {
      const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
      const [isRunning, setIsRunning] = useState(false);
      const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

      useEffect(() => {
          if (isRunning) {
              intervalRef.current = setInterval(() => {
                  setSecondsLeft(prev => {
                      if (prev <= 1) {
                          clearInterval(intervalRef.current!);
                          return 0;
                      }
                      return prev - 1;
                  });
              }, 1000);
          } else if (intervalRef.current) {
              clearInterval(intervalRef.current);
          }

          return () => {
              if (intervalRef.current) clearInterval(intervalRef.current);
          };
      }, [isRunning]);

      const toggleTimer = () => {
          if (isRunning) {
          // Reset if running
              setIsRunning(false);
              setSecondsLeft(initialSeconds);
          } else {
          // Start if stopped
              setSecondsLeft(initialSeconds);
              setIsRunning(true);
          }
      };

      return (
          <TouchableOpacity style={{ width: '33%', justifyContent: 'center', alignItems: 'center' }} onPress={toggleTimer}>
              <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
          </TouchableOpacity>
      );
  };

  // For rendering selected exercises and their sets, reps, and rest intervals in the FlatList below
  const Item = ({name, sets, reps, rest}: {name: string, sets: number, reps: number, rest: number}) => (
    <View style={styles.exerciseContainer}>
      <View style={styles.exercise}>
        <Text style={styles.boxTextName}>{name}</Text>
        <View style={styles.exerciseSubBox}>
          <Text style={styles.boxText}>{sets}</Text>
          <Text style={styles.boxText}>{reps}</Text>
          <RestTimer initialSeconds={rest} />
        </View>
      </View> 
    </View>
  )

  // Socket Emission for Live In-App Workout Notification for Friends of User
  const socketEmitWorkoutActivity = () => {
    const user = getAuth().currentUser;
    if(!socket.connected) return;
    
    socket.emit('friendsActivity', {
      firebaseId: user?.uid,
      workoutId: workoutId,
      action: workoutToggle ? 'finished' : 'started',
    })
  }

  useEffect(() => {
    getUserWorkouts();

    if (workoutId) {
      getWorkoutExercisesById();
    }
  }, [workoutId, visible]);
  
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>

        {/* Formatted Date Modal Header */}
        <Text style={styles.modalTitle}>
          {dayjs(selectedDay).format('dddd, MMM D')}
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : entries?.length > 0 ? (
          
          // Selected Workout Details
          <View style={{ marginTop: 10, padding: 5 }}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <Text style={styles.workoutTitle}>{workout[0]?.workout_name}</Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '30%' }} />  
                <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseHeaderText}>Sets</Text>
                    <Text style={styles.exerciseHeaderText}>Reps</Text>
                    <Text style={styles.exerciseHeaderText}>Rest</Text>
                </View>
            </View>
            {workout.map((item) => (
              <Item
                key={item.exercise_id}
                name={item.name}
                sets={item.sets ?? 0}
                reps={item.reps ?? 0}
                rest={item.rest_seconds ?? 0}
              />
            ))}

            {/* Start/Finish Workout Live Notification Button */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={styles.toggleButton} onPress={() => {
                setWorkoutToggle(!workoutToggle);
                socketEmitWorkoutActivity();
              }}>
                <Text style={styles.toggleText}>{workoutToggle ? 'Finish Workout' : 'Start Workout'}</Text>
              </TouchableOpacity>
            </View>

            {/* Remove Workout from Calendar Day Button */}
            <TouchableOpacity style={styles.addButton} onPress={removeEntry}>
                <MaterialDesignIcons name='delete-outline' size={26} color='black' />
                <Text style={styles.addButtonText}>Remove Workout</Text>
            </TouchableOpacity>
            
          </View>
        ) : (

          // Display message when no workout is selected
          <View style={styles.entry}>
            <Text>No workout scheduled for this day.</Text>

            {/* Add Workout Modal Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <MaterialDesignIcons name='plus-circle-outline' size={24} color='black' />
              <Text style={styles.addButtonText}>Add Workout</Text>
            </TouchableOpacity>

            {/* Add Workout to Calendar Day Modal */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>

                {/* Existing Workouts FlatList */}
                <Text style={styles.modalTitle}>Select Workout</Text>
                <FlatList
                  horizontal
                  data={userWorkouts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const isSelected = item.id === selectedWorkoutId;
                    
                    return (
                        <TouchableOpacity 
                          style={{
                            backgroundColor: isSelected ? '#222222' : '#eee',
                            padding: 16,
                            marginRight: 10,
                            borderRadius: 10,
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected ? '#222222' : '#bababa',
                            shadowColor: isSelected ? '#222222' : undefined,
                            shadowOpacity: isSelected ? 0.3 : 0,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: isSelected ? 4 : 0,
                            elevation: isSelected ? 4 : 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                            maxHeight: 80,
                          }}     
                          onPress={() => setSelectedWorkoutId(item.id)}
                        >
                          <Text
                            style={{
                              color: isSelected ? 'white' : 'black',
                              fontWeight: isSelected ? 'bold' : 'normal',
                              fontSize: 16,
                            }}
                          >{item.name}</Text>
                        </TouchableOpacity>
                    );
                  }}
                />
                
                {/* Add Workout to Calendar Day Button */}
                <Button
                  title="Select Workout"
                  onPress={() => {
                    addEntry();
                    setModalVisible(false);
                  }}
                />
              </View>
            </Modal>
          </View>
        )}

        {/* Close Modal Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
};

export default CalendarModal;

// Styles for component
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    maxHeight: '75%',
    marginTop: 100,
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
  entry: {
    marginBottom: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    color: 'blue',
  },
  exerciseContainer: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  exercise: {
    flexDirection: 'row',
  },
  boxTextName: {
    fontSize: 16,
    width: '30%',
    padding: 5,
  },
  exerciseSubBox: {
    flexDirection: 'row',
    width: '70%',
  },
  boxText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    width: '33%',
  },
  timerText: {
    fontSize: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    width: '70%',
  },
  exerciseHeaderText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
    width: '33%',
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    width: '50%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  addButton: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  }, 
  addButtonText: {
    margin: 5,
  },
});