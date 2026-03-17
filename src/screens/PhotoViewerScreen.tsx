import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../navigation/types';
import { useMetrics } from '../providers/MetricsProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoViewer'>;

export function PhotoViewerScreen({ route }: Props) {
  const { getPhotosForDate } = useMetrics();
  const photo = useMemo(
    () => getPhotosForDate(route.params.date).find((item) => item.id === route.params.photoId),
    [getPhotosForDate, route.params.date, route.params.photoId],
  );

  if (!photo) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text>Photo not found.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="contain" />
        <Text style={styles.caption}>{new Date(photo.timestamp).toLocaleString()}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: '100%',
    height: '85%',
  },
  caption: {
    color: '#475569',
  },
});
