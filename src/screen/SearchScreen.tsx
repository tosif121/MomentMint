import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ApiResponse} from '../utils/types';
import apiClient from '../utils/api';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {activities} from '../utils/activity';

const PhotoGridScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Moments');
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();

  const tabs = ['Moments', 'People', 'Activity'];

  // Filter photos based on search query
  const filteredPhotos = useMemo(() => {
    if (!searchQuery.trim()) return photos;

    const lowerCaseQuery = searchQuery.toLowerCase().trim();

    return photos.filter(photo => {
      const userName = photo.user?.userName?.toLowerCase() || '';
      const activities = photo.activities?.map(a => a.toLowerCase()) || [];

      return (
        userName.includes(lowerCaseQuery) ||
        activities.some(activity => activity.includes(lowerCaseQuery))
      );
    });
  }, [photos, searchQuery]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/posts');
      const apiResponse = response.data as ApiResponse;

      if (apiResponse.status && Array.isArray(apiResponse.data)) {
        setPhotos(apiResponse.data);
      } else {
        throw new Error(apiResponse.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const data = Object.keys(activities).map(activity => ({
    key: activity,
    url: activities[activity].url,
  }));

  const renderItem = ({item}) => (
    <View style={styles.activityContainer}>
      <Image source={item.url} style={styles.activityImage} />
      <Text style={styles.activityText} numberOfLines={1} ellipsizeMode="tail">
        {item.key}
      </Text>
    </View>
  );

  const renderMomentsItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfilePost', {photos, index})}
        style={[styles.photoContainer]}>
        <Image source={{uri: item.imageUrl}} style={styles.photo} />
        <View style={styles.photoOverlay}>
          {item.user && (
            <View style={styles.profilePicContainer}>
              <Image
                source={
                  item.user?.profilePicture
                    ? {uri: item.user.profilePicture}
                    : require('../images/pic.png')
                }
                style={styles.profilePic}
              />
            </View>
          )}
          {item.user?.userName && (
            <Text style={styles.userName}>{item.user.userName}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Moments':
        return (
          <FlatList
            data={filteredPhotos}
            renderItem={renderMomentsItem}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#fff"
              />
            }
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyResultContainer}>
                <Text style={styles.emptyResultText}>
                  No results found for "{searchQuery}"
                </Text>
              </View>
            )}
          />
        );

      case 'People':
        return (
          <View style={styles.emptyTabContainer}>
            <Text style={styles.emptyTabText}>No people to display</Text>
          </View>
        );

      case 'Activity':
        return (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            numColumns={3}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyResultContainer}>
                <Text style={styles.emptyResultText}>
                  No results found for "{searchQuery}"
                </Text>
              </View>
            )}
          />
        );

      default:
        return null;
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
              index < tabs.length - 1 && styles.tabWithMargin,
            ]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    backgroundColor: '#333',
    width: 100,
    height: 100,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  activityImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  userName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },

  emptyResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyResultText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerContainer: {
    paddingTop: 10,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },

  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  tabWithMargin: {
    marginRight: 75,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 1,
  },
  photoContainer: {
    margin: 15,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 100,
    height: 100,
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 8,
    justifyContent: 'space-between',
  },
  profilePicContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },

  emptyTabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTabText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PhotoGridScreen;
