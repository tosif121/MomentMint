import React from 'react';
import {Image, StyleSheet, View, Text, ScrollView} from 'react-native';

// Your activities object
const activities = {
  'At College': {
    url: require('./../images/activities/At_College.png'),
  },
  'At Farm': {
    url: require('./../images/activities/At_Farm.png'),
  },
  'At Home': {
    url: require('./../images/activities/At_Home.png'),
  },
  'At Temple': {
    url: require('./../images/activities/At_Temple.png'),
  },
  'At Traffic': {
    url: require('./../images/activities/At_Traffic.png'),
  },
  Attending: {
    url: require('./../images/activities/Attending.png'),
  },
  Baking: {
    url: require('./../images/activities/Baking.png'),
  },
  Celebration: {
    url: require('./../images/activities/Celebration.png'),
  },
  Chilling: {
    url: require('./../images/activities/Chilling.png'),
  },
  'Class Bunk': {
    url: require('./../images/activities/Class_Bunk.png'),
  },
  Cleaning: {
    url: require('./../images/activities/Cleaning.png'),
  },
  Communting: {
    url: require('./../images/activities/Communting.png'),
  },
  Going: {
    url: require('./../images/activities/Going.png'),
  },
  Grooming: {
    url: require('./../images/activities/Grooming.png'),
  },
  Hangout: {
    url: require('./../images/activities/Hangout.png'),
  },
  'Independence Day': {
    url: require('./../images/activities/Independence_Day.png'),
  },
  Janmashtami: {
    url: require('./../images/activities/janmashtami.png'),
  },
  Learning: {
    url: require('./../images/activities/learning.png'),
  },
  Listening: {
    url: require('./../images/activities/Listening.png'),
  },
  Meditating: {
    url: require('./../images/activities/Meditating.png'),
  },
};

const SearchScreen: React.FC = () => {
  return (
    <ScrollView 
      contentContainerStyle={styles.contentContainer} // Use contentContainerStyle here
    >
      {activities &&
        Object.entries(activities).map(([key, value]) => (
          <View key={key} style={styles.activityContainer}>
            <Image source={value.url} style={styles.image} />
            <Text style={styles.text}>{key}</Text>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: { // New style for contentContainer
    flexGrow: 1, // Ensure the content can grow
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  activityContainer: {
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
