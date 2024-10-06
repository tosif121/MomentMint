import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screen/HomeScreen';
import MobileVerificationScreen from './src/screen/MobileVerificationScreen';
import SplashScreen from './src/screen/SplashScreen';
import Toast from 'react-native-toast-message';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchScreen from './src/screen/SearchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/utils/types';
import CameraScreen from './src/screen/Post/CameraScreen';
import ProfileScreen from './src/screen/Profile/ProfileScreen';
import MessagesScreen from './src/screen/MessagesScreen';
import PreviewScreen from './src/screen/Post/PreviewScreen';
import ProfileEditScreen from './src/screen/Profile/ProfileEditScreen';
import ProfilePost from './src/screen/Profile/ProfilePost';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type AppProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName = '';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#7a7a7a',
        tabBarStyle: {
          height: 60,
          backgroundColor: '#0d0d0d',
          borderTopWidth: 0,
          paddingTop: 5,
          paddingBottom: 5,
        },
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Preview" component={PreviewScreen} />
          <Stack.Screen name="EditProfile" component={ProfileEditScreen} />
          <Stack.Screen name="ProfilePost" component={ProfilePost} />
          {!isAuthenticated && (
            <Stack.Screen
              name="MobileVerification"
              component={MobileVerificationScreen}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}

export default App;
