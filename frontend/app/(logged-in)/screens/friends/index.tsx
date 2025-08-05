import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Platform, StatusBar } from 'react-native'
import React, { useCallback, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';
import socket from '@/utils/socket';

// Type definitions for User and FriendButtonProps
type User = {
  id: string;
  name: string;
  picture: string;
  friend_code: string;
  status: string;
  request_sender_id: string;
}

type FriendButtonProps = {
  status: string;
  sender: string;
  profileUser: string;
};

const Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');


  // Emit socket events for friend requests and acceptances
  const socketEmitFriendRequest = (friendId: string) => {
    if(!socket.connected) return;
    
    socket.emit('friendRequest', {
      userId: userId,
      friendId: friendId,
    })
  }

  const socketEmitAcceptRequest = (friendId: string) => {
    if(!socket.connected) return;
    
    socket.emit('acceptFriendRequest', {
      userId: userId,
      friendId: friendId,
    })
  }

  // Fetch users from API and set local state
  const getUsers = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/users`, {
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
      setAllUsers(data);
      setUsers(data);
    } catch (error) {
      console.log('Error fetching users data', error);
    }
  }

  // Fetch user ID from API for friend requests
  const getUserId = async () => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
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
      setUserId(data.user.id);
    } catch (error) {
      console.log('Error fetching userId data', error);
    }
  }

  // Functions to handle friend relationship actions
  // Remove friend, add friend, accept request, reject request
  const removeFriend = async (friendId: string) => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/friends/remove/${friendId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if(!response.ok) {
        const errorText = await response.text();
        console.log('API returned error:', errorText);
        return;
      }

      await getUsers();
    } catch (error) {
      console.log('Error removing friend', error);
    }
  }

  const addFriend = async (friendId: string) => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/friends/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if(!response.ok) {
        const errorText = await response.text();
        console.log('API returned error:', errorText);
        return;
      }

      socketEmitFriendRequest(friendId);
      await getUsers();
    } catch (error) {
      console.log('Error removing friend', error);
    }
  }

  const acceptFriendRequest = async (friendId: string) => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/friends/accept/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if(!response.ok) {
        const errorText = await response.text();
        console.log('API returned error:', errorText);
        return;
      }

      socketEmitAcceptRequest(friendId);
      await getUsers();
    } catch (error) {
      console.log('Error removing friend', error);
    }
  }

  const rejectFriendRequest = async (friendId: string) => {
    try {
      const user = getAuth().currentUser;
      const idToken = await user?.getIdToken();
      const response = await fetch(`${BASE_URL}/api/friends/reject/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if(!response.ok) {
        const errorText = await response.text();
        console.log('API returned error:', errorText);
        return;
      }

      await getUsers();
    } catch (error) {
      console.log('Error removing friend', error);
    }
  }

  // Handles search bar functionality
  // Filters users based on search query
  // If serach box is cleared, shows all users again
  // If search query is not empty, filters users by FRIEND CODE
  // Note: FRIEND CODE is used as a unique identifier for users (created when user signs up)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    if (formattedQuery === '') {
      // If search box is cleared, show all users again
      setUsers(allUsers);
    } else {
      const filteredData = allUsers.filter(user =>
        user.friend_code.toLowerCase().includes(formattedQuery)
      );
      setUsers(filteredData);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getUsers();
      getUserId();
    }, [])
  );

  // Friend Button component to handles different friend statuses
  // Displays different buttons based on the status of the friend relationship
  const FriendButton: React.FC<FriendButtonProps> = ({ status, sender, profileUser }) => {
    if(status === 'accepted') {
      return (
        <View>
          <TouchableOpacity style={styles.friendButton} onPress={() => removeFriend(profileUser)}>
            <Text style={styles.friendButtonText}>Remove Friend</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if(status === 'pending' && sender === userId) {
      return (
        <View>
          <TouchableOpacity style={styles.friendButton}>
            <Text style={styles.friendButtonText}>Request Sent</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if(status === 'pending' && sender !== userId) {
      return (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.friendButton} onPress={() => acceptFriendRequest(profileUser)}>
            <Text style={styles.friendButtonText}>Accept Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendButton} onPress={() => rejectFriendRequest(profileUser)}>
            <Text style={styles.friendButtonText}>Reject Request</Text>
          </TouchableOpacity>
        </View>
      )
    }
    if(!status) {
      return (
        <View>
          <TouchableOpacity style={styles.friendButton} onPress={() => addFriend(profileUser)}>
            <Text style={styles.friendButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      )
    } 
  }

  // Item component to render each user in the FlatList
  // Displays user's name, picture, and the FriendButton component
  const Item = ({name, picture, status, sender, profileUser}: {name: string, picture: string, status: string, sender: string, profileUser: string}) => {
    return (
      <View style={styles.profileContainer}>
        <Image style={styles.profilePhoto} src={picture}/>
        <View style={styles.friendButtonContainer}>
          <Text style={styles.displayName}>{name}</Text>
          <FriendButton status={status} sender={sender} profileUser={profileUser} />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={{ marginRight: 8, marginLeft: 8, position: 'absolute' }}
          onPress={() => {router.back()}}
        >
          <Ionicons name='chevron-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.headerText}>Friends</Text>
      </View>

      <View style={{flex: 1}}>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons style={styles.searchIcon} name='search-outline' size={18} color='black' />
          <TextInput 
            placeholder='Search...'
            style={{textAlign: 'center', textAlignVertical: 'center', fontSize: 12, paddingVertical: 0}}
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>
        
        {/* Friends FlatList */}
        <View>
          <FlatList 
            data={users}
            contentContainerStyle={{ paddingTop: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>  <Item name={item.name} picture={item.picture} status={item.status} sender={item.request_sender_id} profileUser={item.id} />}
          />
        </View>
        
      </View>

    </SafeAreaView>
  )
}

export default Index

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
    height: 40,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    margin: 'auto',
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    margin: 10,
    borderRadius: 20,
    width: '80%',
    height: 35,
    alignItems: 'center',
    alignSelf: 'center',
  },
  searchIcon: {
    marginLeft: 7,
    marginRight: 7
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    margin: 10,
  },
  profilePhoto: {
    height: 60,
    width: 60,
    marginRight: 10,
    borderRadius: 30,
    borderWidth: 1,
  },
  displayName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  friendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendButton: {
    backgroundColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 15,
  },
  friendButtonText: {
    padding: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  }
})