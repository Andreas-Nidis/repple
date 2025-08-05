import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Platform, StatusBar} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import HomeHeader from '@/components/screenComponents/home/HomeHeader';
import HomeWeekCarousel from '@/components/screenComponents/home/HomeWeekCarousel';
import WeightChart from '@/components/screenComponents/home/WeightChart';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import Friends from '@/components/screenComponents/home/Friends';
import socket from '@/utils/socket';
import { useEffect } from 'react';


export default function HomePage() {
  const router = useRouter();
  const user = getAuth().currentUser;

  // Redirect if user is not logged in
  useEffect(() => {
    if(!user) {
      router.replace('/');
      return;
    }

    // Socket connection setup
    const handleConnect = () => {
      console.log('Socket connected! ID:', socket.id);
      socket.emit('identify', user.uid);
    };

     // Socket disconnection error logging setup
    const handleDisconnect = (reason: any, details: any) => {
      console.log(reason);
      console.log(details?.message);
      console.log(details?.description);
      console.log(details?.context);
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);


    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      
      {/* Logout Button, Profile Picture, and First Name Component */}
      <View style={styles.flexSection}><HomeHeader /></View>

      {/* Weekly Calendar for Exercise Organization */}
      <View style={styles.flexSection}><HomeWeekCarousel /></View>

      {/* Weight Tracker Line Chart */}
      <View style={styles.flexSection}><WeightChart /></View>

      {/* Workout Planning and Meal Planning Buttons */}
      <View style={[styles.flexSection, styles.planningContainer]}>

        {/* Workout Planning Button */}
        <TouchableOpacity onPress={() => {router.push('/(logged-in)/screens/workouts')}}>
          <View style={styles.planningButton}>
            <Text style={styles.planningText}>
              Workout {'\n'}
              Planning
            </Text>
            <MaterialDesignIcons
                style={{padding: 5}} 
                name="weight-lifter"
                size={32}
                color='black'
            />
          </View>
        </TouchableOpacity>

        {/* Meal Planning Button */}
        <TouchableOpacity style={{margin: 0, padding: 0}} onPress={() => {router.push('/(logged-in)/screens/meals')}}>
          <View style={styles.planningButton}>
            <Text style={styles.planningText}>
              Meal {'\n'}
              Planning
            </Text>
            <MaterialDesignIcons
                style={{padding: 5}} 
                name="pot-steam-outline"
                size={32}
                color='black'
            />
          </View>
        </TouchableOpacity>

      </View>

      {/* Friends List Navigation Button & Online Friends FlatList Component */}
      <View style={styles.flexSection}><Friends /></View>
      
    </SafeAreaView>
  );
}

// Styles for component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'space-evenly',
  },
  planningContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  planningButton: {
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 110,
    width: 150,
  },
  planningText: {
    textAlign: 'center',
  },
  flexSection: {
    justifyContent: 'center',  // center content vertically in each section
    width: '95%',      // make them full width for alignment
  },
});
