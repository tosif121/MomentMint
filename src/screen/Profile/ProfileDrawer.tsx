import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../utils/types';
import {showToast} from '../../utils/toast';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItemProps {
  iconName: string;
  title: string;
  value?: string;
  isRed?: boolean;
  onPress?: () => void;
  link?: string;
}

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  iconName,
  title,
  value,
  isRed,
  onPress,
  link,
}) => {
  const handlePress = async () => {
    if (link) {
      try {
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        }
      } catch (error) {
        console.error('Error opening link:', error);
      }
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.settingItem} onPress={handlePress}>
      <View style={styles.settingItemLeft}>
        <Icon name={iconName} size={24} color={isRed ? '#ff0000' : '#fff'} />
        <Text style={[styles.settingItemText, isRed && styles.redText]}>
          {title}
        </Text>
      </View>
      {value && (
        <View style={styles.settingItemRight}>
          <Text style={styles.settingItemValue}>{value}</Text>
          <Icon name="chevron-forward" size={20} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const SettingsGroup: React.FC<SettingsGroupProps> = ({title, children}) => (
  <View style={styles.settingsGroup}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.groupContent}>{children}</View>
  </View>
);

const ProfileDrawer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const animatedValue = new Animated.Value(300);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              navigation.reset({
                index: 0,
                routes: [{name: 'MobileVerification'}],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              showToast('error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const handleBack = (): void => {
    Animated.timing(animatedValue, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.drawer, {transform: [{translateX: animatedValue}]}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings and privacy</Text>
        </View>

        <ScrollView>
          <SettingsGroup title="Your account">
            <SettingItem iconName="pencil" title="Edit Profile" />
          </SettingsGroup>

          <SettingsGroup title="How you use Moment Mint">
            <SettingItem iconName="notifications" title="Notifications" />
            <SettingItem iconName="bookmark" title="Saved" />
          </SettingsGroup>

          <SettingsGroup title="Who can see your content">
            <SettingItem
              iconName="lock-closed"
              title="Edit Privacy"
              value="Public"
            />
            <SettingItem iconName="star" title="Close friends" />
            <SettingItem iconName="person-remove" title="Blocked User" />
            <SettingItem iconName="people" title="Subscribed" />
          </SettingsGroup>

          <SettingsGroup title="Your app and media">
            <SettingItem iconName="phone-portrait" title="Device Permissions" />
          </SettingsGroup>

          <SettingsGroup title="About">
            <SettingItem
              iconName="logo-instagram"
              title="Instagram"
              link="https://www.instagram.com/moment_mint_app/"
            />
            <SettingItem
              iconName="logo-twitter"
              title="Twitter"
              link="https://x.com/moment_mint_app"
            />
            <SettingItem iconName="share-social" title="Share Moment Mint" />
            <SettingItem iconName="star" title="Rate Us" />
            <SettingItem iconName="document-text" title="Terms of services" />
            <SettingItem iconName="information-circle" title="Privacy policy" />
          </SettingsGroup>
          <SettingsGroup title="Account Actions">
            <SettingItem iconName="trash" title="Delete account" />
            <SettingItem
              iconName="log-out"
              title="Logout"
              isRed={true}
              onPress={handleLogout}
            />
          </SettingsGroup>
          <Text style={styles.version}>v0.0.1</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default ProfileDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    color: '#666',
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 8,
  },
  groupContent: {
    backgroundColor: '#111',
    borderRadius: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  redText: {
    color: '#ff0000',
  },
  settingItemValue: {
    color: '#666',
    fontWeight: '500',
    marginRight: 8,
  },
  version: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
});
