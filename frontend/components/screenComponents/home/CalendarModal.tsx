import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import dayjs from 'dayjs';

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

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  selectedDay,
  loading,
  entries,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          Entries for {dayjs(selectedDay).format('dddd, MMM D')}
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : entries?.length > 0 ? (
          entries.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <Text>Workout ID: {entry.workout_id}</Text>
              <Text>Completed: {entry.is_completed ? '✅' : '❌'}</Text>
            </View>
          ))
        ) : (
          <Text>No entries</Text>
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
});