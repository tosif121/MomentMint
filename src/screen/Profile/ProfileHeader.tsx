import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
  Button,
} from 'react-native';
import {ProfileHeaderProps} from '../../utils/types';
import {useNavigation} from '@react-navigation/native';

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  data,
  photosCount,
  onEditProfile,
  onWallet,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            data?.profileImg
              ? {uri: data.profileImg}
              : (require('../../images/pic.png') as ImageSourcePropType)
          }
          style={styles.profileImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.username}>
            {data?.displayName || 'Anonymous'}
          </Text>
          <Text style={styles.handle}>@{data?.userName}</Text>
        </View>
        <View style={styles.iconsContainer}>
          <View style={styles.streakContainer}>
            <Image
              source={require('../../images/flash.png')}
              style={styles.icon}
            />
            <Text style={styles.iconText}>{data?.streak ?? 0}</Text>
          </View>
          <View style={styles.streakContainer}>
            <Image
              source={require('../../images/star.png')}
              style={styles.icon}
            />
            <Text style={styles.iconText}>{data?.coins ?? 0}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileDrawer')}
        style={styles.menu}>
        <Icon name="menu-outline" size={30} color="#fff" />
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{photosCount}</Text>
          <Text style={styles.statLabel}>Moments</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{data?.followersCount ?? 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{data?.followingCount ?? 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{data?.bio || 'Mint for the moment'}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile', {data})}
          accessibilityLabel="Edit Profile"
          accessibilityRole="button">
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={onWallet}
          accessibilityLabel="Connect Wallet"
          accessibilityRole="button">
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonPlus}
          accessibilityLabel="Add Friend"
          accessibilityRole="button">
          <Icon name="person-add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  handle: {
    color: '#aaa',
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 16,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  bioContainer: {
    marginVertical: 20,
  },
  bioText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 25,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    flex: 1,
    borderColor: '#333',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPlus: {
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 50,
    width: 45,
    height: 45,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  menu: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileHeader;
