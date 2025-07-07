import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import dayjs from 'dayjs';
import { getAuth } from '@react-native-firebase/auth';


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

  const getWorkoutExercisesById = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`http://localhost:3001/api/workout-exercises/${workoutId}`, {
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
          console.log(data);
          setWorkout(data);

      } catch (error) {
          console.log('Error fetching and setting exercise data in [workoutId] page:', error);
      }
  }

  const addEntry = async () => {
      try {
          const user = getAuth().currentUser;
          const idToken = await user?.getIdToken();
          const response = await fetch(`http://localhost:3001/api/calendar-entries`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                  date: selectedDay,
                  workout_id: selectedWorkoutId,
              }),
          });

          if (!response.ok) {
              const errorText = await response.text();
              console.log('API returned error:', errorText);
              return;
          }

          onClose();
      } catch (error) {
          console.log('Error adding calendar entry:', error);
      }
  }

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
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

  useEffect(() => {
    getWorkoutExercisesById();
  }, []);
  
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {dayjs(selectedDay).format('dddd, MMM D')}
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : entries?.length > 0 ? (
 
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
          </View>
        ) : (
          <View style={styles.entry}>
            <Text>No workout scheduled for this day.</Text>
            <Button title="Add Workout" onPress={addEntry} />
          </View>
        )}

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CalendarModal;

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
});