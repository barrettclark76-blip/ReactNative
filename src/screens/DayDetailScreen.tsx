import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../navigation/types';
import { useMetrics } from '../providers/MetricsProvider';

type ImageSource = 'camera' | 'library';

const dayDetailSchema = z.object({
  workoutNotes: z.string().min(3, 'Please add a short workout note.'),
  calories: z.coerce.number().min(0, 'Calories cannot be negative.'),
  weightKg: z.coerce.number().min(0, 'Weight cannot be negative.'),
});

type DayDetailFormValues = z.infer<typeof dayDetailSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'DayDetail'>;

export function DayDetailScreen({ route, navigation }: Props) {
  const { addPhotoEntry, getPhotosForDate } = useMetrics();
  const photos = useMemo(() => getPhotosForDate(route.params.date), [getPhotosForDate, route.params.date]);

  const { control, handleSubmit, formState } = useForm<DayDetailFormValues>({
    resolver: zodResolver(dayDetailSchema),
    defaultValues: {
      workoutNotes: '',
      calories: 0,
      weightKg: 0,
    },
  });

  const savePhoto = async (source: ImageSource) => {
    if (source === 'camera') {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        Alert.alert(
          'Camera access denied',
          'You can still add a photo from your library, or enable camera permissions in settings.',
        );
        return;
      }
    }

    if (source === 'library') {
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libraryPermission.granted) {
        Alert.alert('Photo access denied', 'Enable photo library access in settings to choose a picture.');
        return;
      }
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.65,
            exif: false,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.65,
            allowsEditing: true,
            exif: false,
          });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];
    addPhotoEntry({
      date: route.params.date,
      uri: asset.uri,
      timestamp: new Date().toISOString(),
      width: asset.width,
      height: asset.height,
    });
  };

  const onSubmit = (values: DayDetailFormValues) => {
    if (photos.length === 0) {
      Alert.alert('Photo required', 'Please add at least one progress photo to complete the day.');
      return;
    }

    Alert.alert('Saved', `Entries for ${route.params.date} have been saved.\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Day: {route.params.date}</Text>

        <Controller
          control={control}
          name="workoutNotes"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text>Workout Notes</Text>
              <TextInput style={styles.input} value={value} onBlur={onBlur} onChangeText={onChange} />
              {formState.errors.workoutNotes && (
                <Text style={styles.error}>{formState.errors.workoutNotes.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="calories"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text>Calories</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(value)}
                onBlur={onBlur}
                onChangeText={onChange}
              />
              {formState.errors.calories && <Text style={styles.error}>{formState.errors.calories.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="weightKg"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(value)}
                onBlur={onBlur}
                onChangeText={onChange}
              />
              {formState.errors.weightKg && <Text style={styles.error}>{formState.errors.weightKg.message}</Text>}
            </View>
          )}
        />

        <View style={styles.row}>
          <Button title="Capture Photo" onPress={() => savePhoto('camera')} />
          <Button title="Choose from Library" onPress={() => savePhoto('library')} />
        </View>

        <View style={styles.photoHeaderRow}>
          <Text style={styles.photoHeading}>Day photos ({photos.length})</Text>
          {photos.length === 0 && <Text style={styles.photoMissing}>At least 1 photo required</Text>}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryStrip}>
          {photos.map((photo, index) => (
            <Pressable
              key={photo.id}
              onPress={() => navigation.navigate('PhotoViewer', { date: route.params.date, photoId: photo.id })}
            >
              <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
              <Text style={styles.thumbLabel}>#{index + 1}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Button title="Save Day" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  error: {
    color: '#dc2626',
    marginTop: 4,
  },
  photoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoHeading: {
    fontWeight: '600',
  },
  photoMissing: {
    color: '#dc2626',
    fontSize: 12,
  },
  galleryStrip: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 10,
  },
  thumbLabel: {
    textAlign: 'center',
    marginTop: 4,
    color: '#475569',
  },
});
