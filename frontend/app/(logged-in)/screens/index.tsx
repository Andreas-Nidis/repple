import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();
  const user = getAuth().currentUser;
  if(!user) {
  router.replace('/')
  }

  console.log(user);
  console.log('Baco');
  

  return (
     <View style={styles.container}>
        {/* <ProfileIcon> */}
          {/* <Image style={styles.profilePhoto} src={user?.}/> */}
        {/* </ProfileIcon> */}
        <Text>{user?.displayName}!</Text>
        <TouchableOpacity
            onPress={() => {
                getAuth().signOut().then(() => {
                    console.log('User signed out!');
                    router.replace('/')
                }).catch((error) => {
                    console.error('Sign out error:', error);
                });
            }}
        >
            <Text>Sign Out</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
