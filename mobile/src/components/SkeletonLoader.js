import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HERO = {
  card: 'rgba(39, 39, 42, 0.4)',
  border: 'rgba(255, 255, 255, 0.08)',
};

export const SkeletonLoader = ({ type = 'card', style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (type === 'card') {
    return (
      <Animated.View style={[styles.cardSkeleton, style, { opacity }]}>
        <View style={styles.imageSkeleton} />
        <View style={styles.contentSkeleton}>
          <View style={styles.brandSkeleton} />
          <View style={styles.titleSkeleton} />
          <View style={styles.priceSkeleton} />
        </View>
      </Animated.View>
    );
  }

  if (type === 'list') {
    return (
      <Animated.View style={[styles.listSkeleton, style, { opacity }]}>
        <View style={styles.listImageSkeleton} />
        <View style={styles.listContentSkeleton}>
          <View style={styles.listTitleSkeleton} />
          <View style={styles.listSubtitleSkeleton} />
        </View>
      </Animated.View>
    );
  }

  return null;
};

export const SkeletonGrid = ({ count = 4 }) => {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader key={index} type="card" />
      ))}
    </View>
  );
};

const CARD_WIDTH = (width - 48 - 15) / 2;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 15,
  },
  
  // Card Skeleton
  cardSkeleton: {
    width: CARD_WIDTH,
    backgroundColor: HERO.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: HERO.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageSkeleton: {
    height: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  contentSkeleton: {
    padding: 12,
    gap: 8,
  },
  brandSkeleton: {
    height: 10,
    width: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  titleSkeleton: {
    height: 14,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  priceSkeleton: {
    height: 16,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
    marginTop: 4,
  },

  // List Skeleton
  listSkeleton: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: HERO.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: HERO.border,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  listImageSkeleton: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 12,
  },
  listContentSkeleton: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  listTitleSkeleton: {
    height: 14,
    width: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
  listSubtitleSkeleton: {
    height: 12,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  },
});

export default SkeletonLoader;
