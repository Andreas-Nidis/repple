import { SafeAreaView, StyleSheet, View } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import HomeHeader from '@/components/screenComponents/home/HomeHeader';
import HomeWeekCarousel from '@/components/screenComponents/home/HomeWeekCarousel';

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
