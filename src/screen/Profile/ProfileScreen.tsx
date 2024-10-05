import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {showToast} from '../../utils/toast';
import {ApiResponse, ProfileScreenProps, Photo} from '../../utils/types';
import apiClient from '../../utils/api';
import ProfileHeader from './ProfileHeader';
import ProfileTab from './ProfileTab';

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const response: ApiResponse<{photos: Photo[]; userData: any}> =
        await apiClient.get('/myPosts');
      if (response.data.status) {
        setPhotos(response.data?.data);
        setUserData(response.data?.data[0]?.user);
      } else {
        throw new Error(
          response.data.message || 'Failed to fetch profile data',
        );
      }
    } catch (err: unknown) {
      showToast('error', 'An error occurred while fetching your profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleEditProfile = useCallback(() => {
    navigation.navigate('EditProfile');
  }, [navigation]);

  const handleWallet = useCallback(() => {
    // Implement wallet functionality
    // For example: navigation.navigate('Wallet');
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        data={userData}
        photosCount={photos.length}
        onEditProfile={handleEditProfile}
        onWallet={handleWallet}
      />
      <ProfileTab
        photos={photos}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d0d',
  },
});

export default ProfileScreen;
