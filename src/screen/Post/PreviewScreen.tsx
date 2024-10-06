import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {CameraScreenProps} from '../../utils/types';
import {showToast} from '../../utils/toast';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {activities} from '../../utils/activity';

const {width, height} = Dimensions.get('window');

const PreviewScreen: React.FC<CameraScreenProps> = ({route, navigation}) => {
  const {imageUri} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState(
    Object.keys(activities),
  );

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleActivitySelect = (activityName: string) => {
    const trimmedQuery = searchQuery.trim();
    if (activityName === 'Custom Activity' && !trimmedQuery) {
      showToast('error', 'Please enter a valid custom activity.');
      return;
    }
    setSelectedActivity(
      activityName === 'Custom Activity' ? trimmedQuery : activityName,
    );
    setIsModalVisible(false);
    setSearchQuery('');
  };

  useEffect(() => {
    setFilteredActivities(
      Object.keys(activities).filter(activity =>
        activity.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }, [searchQuery]);

  const uploadImageAndSaveData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('uploadType', 'posts');
      formData.append('activity', selectedActivity);

      const response = await axios.post(
        'http://15.207.26.134:7012/api/createPosts',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.message === 'Post created successfully.') {
        showToast('success', 'Post created successfully.');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to upload image. Please try again.';
      showToast('error', errorMessage);
      console.error('Upload error:', error); // Log the error for debugging
      throw new Error(errorMessage);
    }
  };

  const handleConfirm = async () => {
    if (!selectedActivity) {
      setIsModalVisible(true);
      return;
    }

    setIsLoading(true);
    try {
      const postData = await uploadImageAndSaveData();
      navigation.navigate('Profile', {newPost: postData});
    } catch (error) {
      console.error('Error saving image and activity:', error);
      showToast(
        'error',
        error.message || 'Failed to save data. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.imageContainer}>
        <Image
          source={{uri: imageUri}}
          style={styles.image}
          resizeMode="cover"
        />
        {selectedActivity && (
          <TouchableOpacity
            style={styles.activityBadge}
            onPress={() => setIsModalVisible(true)}>
            <LinearGradient
              colors={['#8b5cf6', '#2196f3']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.activityBadgeGradient}>
              {activities[selectedActivity]?.url && (
                <Image
                  source={activities[selectedActivity].url}
                  style={styles.activityBadgeImage}
                />
              )}
              <Text style={styles.activityBadgeText}>{selectedActivity}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirm}
          style={[styles.button, isLoading && styles.disabledButton]}
          disabled={isLoading}>
          <LinearGradient
            colors={['#8b5cf6', '#2196f3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientButton}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Post</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>What are you doing?</Text>
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              size={24}
              color="#ffffff"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Activities..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView style={styles.scrollView}>
            {filteredActivities.map(activity => (
              <TouchableOpacity
                key={activity}
                style={styles.activityButton}
                onPress={() => handleActivitySelect(activity)}>
                <View style={styles.activityRow}>
                  <Text style={styles.activityText}>{activity}</Text>
                  <TouchableOpacity
                    onPress={() => handleActivitySelect(activity)}>
                    <Image
                      source={activities[activity].url}
                      style={[
                        styles.activityThumbnail,
                        selectedActivity === activity && styles.selectedImage,
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {searchQuery &&
              !filteredActivities.some(
                a => a.toLowerCase() === searchQuery.toLowerCase(),
              ) && (
                <TouchableOpacity
                  style={styles.activityButton}
                  onPress={() => handleActivitySelect('Custom Activity')}>
                  <View style={styles.activityTextContainer}>
                    <Text style={styles.activityText}>{searchQuery}</Text>
                    <Icon name="add" size={24} color="#2196f3" />
                  </View>
                </TouchableOpacity>
              )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  activityBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 10,
  },
  activityBadgeGradient: {
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  activityBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    width: '48%',
    alignItems: 'center',
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    marginTop: 100,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#333',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#444',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
  },
  scrollView: {
    maxHeight: height * 0.7,
  },
  activityButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 10,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  activityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
  activityThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  activityBadgeImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },

  activityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default PreviewScreen;
