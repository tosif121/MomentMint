import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfileScreen = ({route}) => {
  const {data} = route.params;
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState(data?.displayName || '');
  const [userName, setUserName] = useState(data?.userName || '');
  const [bio, setBio] = useState(data?.bio || '');
  const [email, setEmail] = useState(data?.email || '');
  const [mobile, setMobile] = useState(data?.mobile || '');
  const [gender, setGender] = useState(data?.gender || 'Male');
  const [dob, setDob] = useState(new Date(data?.dob) || new Date());
  const [profileImage, setProfileImage] = useState(data?.profileImg || null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleImagePicker = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleDobChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  const handleSaveChanges = () => {
    const updatedData = {
      displayName,
      userName,
      bio,
      email,
      mobile,
      gender,
      dob,
      profileImg: profileImage,
    };
    navigation.navigate('Profile', {updatedData});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSaveChanges}>
          <Icon name="checkmark" size={24} color="#2196f3" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.imagePicker}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? {uri: profileImage}
                  : require('../../images/pic.png')
              }
              style={styles.profileImage}
            />
            <View style={styles.editIconContainer}>
              <Icon name="camera" size={20} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>

        <InputField
          label="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your display name"
        />

        <InputField
          label="Username"
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter your username"
        />

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />

        <InputField
          label="Mobile"
          value={mobile}
          editable={false}
          style={styles.disabledInput}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dobPicker}>
            <Text style={styles.dobText}>{dob.toDateString()}</Text>
            <Icon name="calendar-outline" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={handleDobChange}
          />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.genderButton,
                  gender === option && styles.genderButtonActive,
                ]}
                onPress={() => setGender(option)}>
                <Text
                  style={[
                    styles.genderText,
                    gender === option && styles.genderTextActive,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself"
          multiline
          style={styles.textArea}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const InputField = ({label, style, ...props}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#aaa"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2196f3',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196f3',
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  dobPicker: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dobText: {
    color: '#fff',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderColor: '#2196f3',
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#2196f3',
  },
  genderText: {
    color: '#2196f3',
    fontSize: 16,
    fontWeight: '500',
  },
  genderTextActive: {
    color: '#fff',
  },
  disabledInput: {
    opacity: 0.5,
  },
});

export default EditProfileScreen;
