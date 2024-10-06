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

const {height} = Dimensions.get('window');

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

  // Render each photo item
  const renderItem = ({item, index}: {item: Photo; index: number}) => (
    <View style={styles.photoContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('SingleImage', {photos, index})}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.imageUrl}} style={styles.photo} />

          {/* Date overlay */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {moment(item.createdAt).format('DD')}
            </Text>
            <Text style={styles.monthText}>
              {moment(item.createdAt).format('MMM')}
            </Text>
          </View>

          <View style={styles.activityContainerOuter}>
            <View style={styles.activityContainerInner}>
              <Text style={styles.activityText}>{item.activity}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomRow}>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <Icon name="heart" size={20} color="#FF4724" />
            <Text style={styles.iconText}>{item.likesCount}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon name="chatbubble-outline" size={20} color="#2196f3" />
            <Text style={styles.iconText}>{item.comments.length}</Text>
          </View>
        </View>
      </View>
    </View>
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
  dateContainer: {
    position: 'absolute',
    top: 100,
    left: -60,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  monthText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '400',
  },
  activityContainerOuter: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  activityContainerInner: {
    flexDirection: 'row',
    backgroundColor: '#2196f3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  activityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  screenContainer: {
    flex: 1,
    paddingEnd: 15,
  },
  tagScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '80%',
    alignSelf: 'flex-end',
  },
  photo: {
    width: '100%',
    height: height * 0.5,
    borderRadius: 10,
  },
  bottomRow: {
    paddingTop: 10,
    marginLeft: 60,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-around',
    elevation: 3,
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
    borderBottomColor: '#ffffff',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ProfileTab;
