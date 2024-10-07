import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import apiClient from '../utils/api';
import {activities} from '../utils/activity';

const {width, height} = Dimensions.get('window');
const ITEM_SIZE = width * 0.9;
const SPACING = 10;

interface User {
  id: string;
  name: string;
  profilePicture: string;
}

interface Photo {
  id: number;
  imageUrl: string;
  activity: string;
  createdAt: string;
  user: User;
  likesCount: number;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Photo[];
}

const HomeScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiClient.get('/posts');
      const apiResponse = response.data as ApiResponse;
      if (apiResponse.status && Array.isArray(apiResponse.data)) {
        setPhotos(apiResponse.data);
      } else {
        throw new Error(apiResponse.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const renderItem = ({item, index}: {item: Photo; index: number}) => {
    const inputRange = [
      (index - 1) * (ITEM_SIZE + SPACING),
      index * (ITEM_SIZE + SPACING),
      (index + 1) * (ITEM_SIZE + SPACING),
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    const activity = item.activity;

    const relatedImage = activities[activity]?.url;
    return (
      <Animated.View
        style={[
          styles.postContainer,
          {
            transform: [{scale}],
            opacity,
          },
        ]}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradientCard}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProfilePost', {photos: [item], index: 0})
            }>
            <Image source={{uri: item.imageUrl}} style={styles.postImage} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <View style={styles.userInfoContainer}>
              <Image
                source={
                  item.user?.profilePicture
                    ? {uri: item.user.profilePicture}
                    : require('../images/pic.png')
                }
                style={styles.profilePic}
              />
              <View>
                <Text style={styles.userName}>
                  {item.user?.name || 'Anonymous'}
                </Text>
                <Text style={styles.timeStamp}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>
            </View>
            <View style={styles.activityContainerOuter}>
              {relatedImage ? (
                <Image
                  source={relatedImage}
                  style={styles.relatedActivityImage}
                />
              ) : (
                <></>
              )}
              <Text style={styles.activityText}>{item.activity}</Text>
            </View>
            <View style={styles.interactionBar}>
              <View style={styles.interactionButtonContainer}>
                <TouchableOpacity style={styles.interactionButton}>
                  <Icon name="flame-outline" size={24} color="#FF6B6B" />
                  <Text style={styles.interactionText}>0</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.interactionButtonContainer}>
                <TouchableOpacity style={styles.interactionButton}>
                  <Icon
                    name="chatbubble-ellipses-outline"
                    size={24}
                    color="#8b5cf6"
                  />
                  <Text style={styles.interactionText}>0</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.interactionButtonContainer}>
                <TouchableOpacity style={styles.interactionButton}>
                  <Icon name="paper-plane-outline" size={24} color="#FFD93D" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="images-outline" size={48} color="#2196f3" />
        <Text style={styles.emptyText}>No posts found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          {paddingTop: SPACING, paddingBottom: SPACING},
        ]}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        snapToInterval={ITEM_SIZE + SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2196f3"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#2196f3',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContainer: {
    paddingHorizontal: width * 0.05,
  },
  postContainer: {
    width: ITEM_SIZE,
    marginBottom: SPACING,
  },
  gradientCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: ITEM_SIZE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2196f3',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },

  contentContainer: {
    padding: 15,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeStamp: {
    fontSize: 12,
    color: '#888888',
  },

  activityContainerOuter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  relatedActivityImage: {
    width: 34,
    height: 34,
    marginRight: 5,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DDDDDD',
  },
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  interactionButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  interactionText: {
    color: '#BBBBBB',
    marginLeft: 5,
    fontSize: 12,
  },
});

export default HomeScreen;
