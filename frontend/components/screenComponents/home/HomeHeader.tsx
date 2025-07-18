import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeHeader = () => {
    const router = useRouter();
    const user = getAuth().currentUser;
    if(!user) {
    router.replace('/')
    }

    const firstName = user?.displayName?.split(' ')[0];

    return (
        <View style={styles.headerContainer}>
            <View style={styles.exitContainer}>
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
                <Ionicons
                    style={{ transform: [{ rotate: '180deg' }], marginRight: 10}} 
                    name="exit-outline"
                    size={30}
                    color='black'
                />
                </TouchableOpacity>
            </View>
            <Image style={styles.profilePhoto} src={user?.photoURL || ''}/>
            <Text style={styles.displayName}>{firstName || 'Nameless'}!</Text>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    marginRight: 35,
  },
  exitContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  profilePhoto: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});
