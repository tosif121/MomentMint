import Icon from 'react-native-vector-icons/Ionicons';
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {Photo, ProfileTabProps} from '../../utils/types';
import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

const PostScreen: React.FC<{
  photos: Photo[];
  refreshPhotos: () => Promise<void>;
}> = ({photos, refreshPhotos}) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshPhotos();
    setRefreshing(false);
  }, [refreshPhotos]);

  const renderItem = ({item, index}: {item: Photo; index: number}) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => navigation.navigate('ProfilePost', {photos, index})}
      activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.imageUrl}} style={styles.photo} />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.gradientOverlay}
        />
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {moment(item.createdAt).format('DD')}
          </Text>
          <Text style={styles.monthText}>
            {moment(item.createdAt).format('MMM')}
          </Text>
        </View>
        <LinearGradient
          colors={['#8b5cf6', '#2196f3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.activityContainerOuter}>
          <Text style={styles.activityText}>{item.activity}</Text>
        </LinearGradient>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.interactionBar}>
          <View style={styles.interactionButtonContainer}>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="flame-outline" size={24} color="#FF6B6B" />
              <Text style={styles.interactionText}>{item.likesCount}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.interactionButtonContainer}>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon
                name="chatbubble-ellipses-outline"
                size={24}
                color="#8b5cf6"
              />
              <Text style={styles.interactionText}>{item.comments.length}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.interactionButtonContainer}>
            <TouchableOpacity style={styles.interactionButton}>
              <Icon name="paper-plane-outline" size={24} color="#FFD93D" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      {photos.length === 0 ? (
        <Text style={styles.bio}>No moments to display</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={item =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const TagScreen: React.FC = () => (
  <View style={styles.tagScreenContainer}></View>
);

const ProfileTab: React.FC<ProfileTabProps> = ({photos}) => {
  const [activeTab, setActiveTab] = useState('Post');
  const refreshPhotos = async () => {
    // Add your logic here to refresh the photos
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Post':
        return <PostScreen photos={photos} refreshPhotos={refreshPhotos} />;
      case 'Tag':
        return <TagScreen />;
      default:
        return <PostScreen photos={photos} refreshPhotos={refreshPhotos} />;
    }
  };

  return (
    <View style={styles.profileScreenContainer}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Post' && styles.activeTabItem]}
          onPress={() => setActiveTab('Post')}>
          <Image
            source={require('../../images/pixels.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Tag' && styles.activeTabItem]}
          onPress={() => setActiveTab('Tag')}>
          <Image source={require('../../images/tag.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {React.cloneElement(renderContent())}
    </View>
  );
};

const styles = StyleSheet.create({
  profileScreenContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  tagScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    marginVertical: 5,
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.5,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  dateContainer: {
    position: 'absolute',
    top: 25,
    left: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    padding: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  monthText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
  },
  activityContainerOuter: {
    position: 'absolute',
    top: 25,
    right: 20,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomRow: {
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  bio: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-around',
    borderTopColor: '#444',
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
  },
  activeTabItem: {
    borderBottomColor: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});

export default ProfileTab;
