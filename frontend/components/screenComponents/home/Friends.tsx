import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '@/utils/socket';

type Friend = {
    friend_id: string;
    name: string;
    picture: string;
};

const Friends = () => {
    const router = useRouter();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [onlineFriends, setOnlineFriends] = useState<string[]>([]);

    // API call - Get all friends of user
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

    useFocusEffect(
        useCallback(() => {
            getFriends();
        }, [])
    );

    useEffect(() => {
        // Initial list of currently online users
        socket.on('onlineUsers', (userIds: string[]) => {
            setOnlineFriends(userIds);
        });

        // Listen to unified status updates
        socket.on('updateUserStatus', ({ userId, status }) => {
            setOnlineFriends(prev => {
                if (status === 'online') {
                    // Add to list if not present
                    return prev.includes(userId) ? prev : [...prev, userId];
                } else {
                    // Remove from list
                    return prev.filter(id => id !== userId);
                }
            });
        });

        return () => {
            socket.off('onlineUsers');
            socket.off('updateUserStatus');
        };
    }, []);

    // For rendering individual friends in the Flatlist below
    const Item = ({id, name, picture}: {id: string, name: string, picture: string}) => {
        const isOnline = onlineFriends.includes(id);

        return (
            <View style={styles.profileContainer}>
                <View>

                    {/* Profile Picture */}
                    <Image style={styles.profilePhoto} src={picture}/>

                    {/* Online Status */}
                    <View 
                        style={[
                            styles.statusIndicator, 
                            { backgroundColor: isOnline ? 'green' : 'red' }
                        ]}
                    />

                </View>

                {/* Name */}
                <Text style={styles.displayName}>{name}</Text>
            </View>
        )
    }

    return (
        <View style={styles.friendsContainer}>
            
            {/* Navigation Header */}
            <TouchableOpacity style={styles.friendsTitle} onPress={() => {router.push('/(logged-in)/screens/friends')}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.friendsTitleText}>Friends</Text>
                    <Ionicons name='chevron-forward' size={18} color='black' />
                </View>
                <View style={styles.underline} />
            </TouchableOpacity>

            {/* Friends FlatList */}
            <View>
                <FlatList 
                    data={friends}
                    horizontal
                    contentContainerStyle={{ paddingTop: 20 }}
                    renderItem={({ item }) =>  <Item id= {item.friend_id} name={item.name} picture={item.picture} />}
                />
            </View>

        </View>
    )
}

export default Friends

// Styles for component
const styles = StyleSheet.create({
    friendsContainer: {
        flexDirection: 'column',
        width: '95%',
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
    },
    statusIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 15,
        height: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white',
    },
})