import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Friend = {
    name: string;
    picture: string;
};

const Friends = () => {
    const router = useRouter();
    const [friends, setFriends] = useState<Friend[]>([]);

    const getFriends = async () => {
        try {
            const user = getAuth().currentUser;
            const idToken = await user?.getIdToken();
            const response = await fetch(`${BASE_URL}/api/friends`, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            })

            if(!response.ok) {
                const errorText = await response.text();
                console.log('API returned error:', errorText);
                return;
            }

            const data = await response.json();
            setFriends(data)
        } catch (error) {
            console.log('Error fetching friends data', error);
        }
    }

    useEffect(() => {
        getFriends();
    }, []);


    const Item = ({name, picture}: {name: string, picture: string}) => {
        return (
            <View style={styles.profileContainer}>
                <Image style={styles.profilePhoto} src={picture}/>
                <Text style={styles.displayName}>{name}</Text>
            </View>
        )
    }


    return (
        <View style={styles.friendsContainer}>
            <TouchableOpacity style={styles.friendsTitle} onPress={() => {router.push('/(logged-in)/screens/friends')}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.friendsTitleText}>Friends</Text>
                    <Ionicons name='chevron-forward' size={18} color='black' />
                </View>
                <View style={styles.underline} />
            </TouchableOpacity>

            <View>
                <FlatList 
                    data={friends}
                    horizontal
                    contentContainerStyle={{ paddingTop: 20 }}
                    renderItem={({ item }) =>  <Item name={item.name} picture={item.picture} />}
                />
            </View>
        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    friendsContainer: {
        flexDirection: 'column',
        flex: 1,
        width: '95%',
        bottom: 10,
    },
    friendsTitle: {
        padding: 5,
        width: '100%',
    },
    friendsTitleText: {
        fontWeight: '600',
        fontSize: 18,
    },
    underline: {
        marginTop: 1,
        height: 1.5,
        backgroundColor: 'black',
        width: 65,
    },
    profileContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    profilePhoto: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 1,
    },
    displayName: {
        marginTop: 5,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})