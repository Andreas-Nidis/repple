import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { getAuth } from '@react-native-firebase/auth';
import { BASE_URL } from '@/utils/api';

type User = {
  name: string;
  picture: string;
  friend_code: string;
}

const Item = ({name, picture}: {name: string, picture: string}) => {
  return (
    <View style={styles.profileContainer}>
      <Image style={styles.profilePhoto} src={picture}/>
      <Text style={styles.displayName}>{name}</Text>
    </View>
  )
}

const Index = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.searchBox}>
          <Ionicons style={styles.searchIcon} name='search-outline' size={18} color='black' />
          <TextInput 
            placeholder='Search...'
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>
        
        <View>
          <FlatList 
            data={users}
            contentContainerStyle={{ paddingTop: 20 }}
            keyExtractor={(item) => item.friend_code}
            renderItem={({ item }) =>  <Item name={item.name} picture={item.picture} />}
          />
        </View>
      </View>

    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
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
    height: 25,
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
  }
})