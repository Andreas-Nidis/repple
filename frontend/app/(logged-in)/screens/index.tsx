import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import HomeHeader from '@/components/screenComponents/home/HomeHeader';
import HomeWeekCarousel from '@/components/screenComponents/home/HomeWeekCarousel';
import WeightChart from '@/components/screenComponents/home/WeightChart';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

export default function HomePage() {
  const router = useRouter();
  const user = getAuth().currentUser;
  if(!user) {
    router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <HomeWeekCarousel />
      <WeightChart />
      <View style={styles.planningContainer}>
        <TouchableOpacity onPress={() => {router.push('/(logged-in)/screens/workouts')}}>
          <View style={styles.planningButton}>
            <Text style={styles.planningText}>
              Workout {'\n'}
              Planning
            </Text>
            <MaterialDesignIcons
                style={{padding: 5}} 
                name="weight-lifter"
                size={30}
                color='black'
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/(logged-in)/screens/meals')}}>
          <View style={styles.planningButton}>
            <Text style={styles.planningText}>
              Meal {'\n'}
              Planning
            </Text>
            <MaterialDesignIcons
                style={{padding: 5}} 
                name="pot-steam-outline"
                size={30}
                color='black'
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  planningContainer: {
    // marginTop: 5,
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 200,
    width: '95%',
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
  }
});
