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

const activities = {
  'At Collage': '🎓',
  'At Farm': '🌾',
  'At Home': '🏠',
  'At Temple': '🕌',
  'At Traffic': '🚦',
  Attending: '🎟️',
  Baking: '🍞',
  Celebration: '🎉',
  Chilling: '🛋️',
  'Class Bunk': '🏫❌',
  Cleaning: '🧹',
  Communting: '🚇',
  Going: '🚶‍♂️',
  Grooming: '💇‍♂️',
  Hangout: '👯‍♂️',
  'Independence Day': '🇮🇳',
  Janmashtami: '🎊',
  Learning: '📚',
  Listening: '🎧',
  Meditating: '🧘‍♂️',
  Cooking: '🍳',
  Cycling: '🚴‍♀️',
  Dancing: '💃',
  Designing: '🎨',
  Drinking: '🍹',
  Eating: '🍽️',
  Engagement: '💍',
  Enjoying: '😊',
  Exercising: '🏋️‍♂️',
  Gaming: '🎮',
  'Ganesh Chaturthi': '🐘',
  Gardening: '🌿',
  Meeting: '👥',
  Nothing: '😴',
  Partying: '🥳',
  'Playing Garba': '🪔',
  Playing: '🎲',
  Praying: '🙏',
  Rafting: '🚣‍♂️',
  Reading: '📖',
};

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
    setSelectedActivity(
      activityName === 'Custom Activity' ? searchQuery.trim() : activityName,
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

      if (!token) {
        showToast('error', 'Authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
      formData.append('uploadType', 'posts');
      formData.append('activity', selectedActivity);

      const response = await axios.post(
        'http://15.207.26.134:7012/api/uploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.message === 'Image uploaded successfully.') {
        showToast('success', 'Image uploaded successfully.');

        return response.data;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Network error occurred';
        console.error('Axios Error:', errorMessage);
        throw new Error(errorMessage);
      }

      console.error('Error:', error);
      throw error;
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
      showToast('success', 'Post created successfully!');
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
            <Text style={styles.activityBadgeText}>
              {activities[selectedActivity]} {selectedActivity}
            </Text>
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
          style={[
            styles.button,
            styles.postButton,
            isLoading && styles.disabledButton,
          ]}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Post</Text>
          )}
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
                <Text style={styles.activityText}>
                  {activities[activity]} {activity}
                </Text>
              </TouchableOpacity>
            ))}
            {searchQuery && !filteredActivities.includes(searchQuery) && (
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
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width,
    height,
  },
  activityBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#00c6ff',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activityBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4c4c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#2196f3',
    width: '48%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  gradient: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    paddingLeft: 10,
  },
  scrollView: {
    maxHeight: height * 0.5,
  },
  activityButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activityText: {
    fontSize: 16,
    color: '#ffffff',
  },
  activityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchIcon: {
    marginRight: 10,
  },
});

export default PreviewScreen;
