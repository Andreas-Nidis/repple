import { SafeAreaView, StyleSheet} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import HomeHeader from '@/components/screenComponents/home/HomeHeader';
import HomeWeekCarousel from '@/components/screenComponents/home/HomeWeekCarousel';
import WeightChart from '@/components/screenComponents/home/WeightChart';

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    margin: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center',
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
});
