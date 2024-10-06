import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

interface Photo {
  imageUrl: string;
  activity: string;
  createdAt: string;
}

const SingleImage: React.FC<{
  route: { params: { photos: Photo[]; index: number } };
}> = ({ route }) => {
  const { photos, index: initialIndex } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList<Photo>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
    fadeIn();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.gradientOverlay} />
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {moment(item.createdAt).format('DD')}
          </Text>
          <Text style={styles.monthText}>
            {moment(item.createdAt).format('MMM')}
          </Text>
        </View>
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>{item.activity}</Text>
        </View>
        <View style={styles.iconContainer}>
          {['heart', 'chatbubble', 'paper-plane', 'ellipsis-vertical'].map((iconName, index) => (
            <TouchableOpacity key={index} style={styles.iconButton}>
              <Icon name={`${iconName}-outline`} size={28} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const getItemLayout = (_: any, index: number) => ({
    length: height,
    offset: height * index,
    index,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      fadeIn();
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={photos}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        vertical
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  dateContainer: {
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
  },
  dateText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  monthText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  activityContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
  },
  activityText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    padding: 10,
  },
});

export default SingleImage;