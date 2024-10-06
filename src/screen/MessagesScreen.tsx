import { StyleSheet, Text, View, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure you have this package installed

const messagesData = [
  {
    id: '1',
    name: 'Alice',
    message: 'Hey! How are you?',
    time: '2m ago',
    avatar: require('../images/pic.png'), // Use require for local images
  },
  {
    id: '2',
    name: 'Bob',
    message: 'Let’s meet up!',
    time: '5m ago',
    avatar: require('../images/pic.png'),
  },
  {
    id: '3',
    name: 'Charlie',
    message: 'Are you coming to the party?',
    time: '10m ago',
    avatar: require('../images/pic.png'),
  },
  {
    id: '4',
    name: 'David',
    message: 'Got your message!',
    time: '15m ago',
    avatar: require('../images/pic.png'),
  },
  {
    id: '5',
    name: 'Eva',
    message: 'What’s the update?',
    time: '20m ago',
    avatar: require('../images/pic.png'),
  },
];

const MessagesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messagesData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginVertical: 6,
  },
  searchContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 12,
    color: '#ccc',
  },
  time: {
    fontSize: 11,
    color: '#999',
  },
});
