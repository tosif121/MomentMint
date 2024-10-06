import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Splash: undefined;
  MobileVerification: undefined;
  MainTabs: undefined;
  Home: undefined;
  EditProfile: undefined;
  ProfilePost: undefined;
  Preview: {imageUri: string};
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Camera: undefined;
  Profile: undefined;
};

export type CameraScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Camera'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export interface CameraScreenProps {
  navigation: CameraScreenNavigationProp;
}

export type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export type MobileVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MobileVerification'
>;

export type ProfilesScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Profile'
>;

export type MobileVerificationScreenProps = {
  navigation: MobileVerificationScreenNavigationProp;
};

export type SplashScreenProps = {
  navigation: SplashScreenNavigationProp;
};

export type ProfileScreenProps = {
  navigation: ProfilesScreenNavigationProp;
};
export interface FullImageScreenProps {
  imageUrl: string;
  activity: string;
  likesCount: number;
  comments: string[];
  onClose: () => void;
}

export interface ProfileHeaderProps {
  data: {
    profileImg?: string;
    displayName?: string;
    userName?: string;
    streak?: number;
    coins?: number;
    followersCount?: number;
    followingCount?: number;
    bio?: string;
  };
  photosCount: number;
  onEditProfile: () => void;
  onWallet: () => void;
}

export interface Photo {
  id: string;
  imageUrl: string;
  activity: string;
  createdAt: string;
  likesCount: number;
  comments: any[];
}

export interface ProfileHeaderProps {
  data: {
    profileImg?: string;
    displayName?: string;
    userName?: string;
    streak?: number;
    coins?: number;
    followersCount?: number;
    followingCount?: number;
    bio?: string;
  };
  photosCount: number;
  onEditProfile: () => void;
  onWallet: () => void;
}

export interface ProfileTabProps {
  photos: Photo[];
  refreshControl: React.ReactElement;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  token?: string;
  error?: string;
}

export interface ApiErrorResponse {
  status: false;
  message: string;
  error: string;
}
