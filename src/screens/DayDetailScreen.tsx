import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../components/ScreenContainer';
import { RootStackParamList } from '../navigation/types';

const dayDetailSchema = z.object({
  workoutNotes: z.string().min(3, 'Please add a short workout note.'),
  calories: z.coerce.number().min(0, 'Calories cannot be negative.'),
  weightKg: z.coerce.number().min(0, 'Weight cannot be negative.'),
});

type DayDetailFormValues = z.infer<typeof dayDetailSchema>;
type Props = NativeStackScreenProps<RootStackParamList, 'DayDetail'>;

export function DayDetailScreen({ route }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { control, handleSubmit, formState } = useForm<DayDetailFormValues>({
    resolver: zodResolver(dayDetailSchema),
    defaultValues: {
      workoutNotes: '',
      calories: 0,
      weightKg: 0,
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Enable photo access to upload media.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = (values: DayDetailFormValues) => {
    Alert.alert('Saved', `Entries for ${route.params.date} have been saved.\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <ScreenContainer>
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

      <Button title="Upload Meal/Workout Photo" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <Button title="Save Day" onPress={handleSubmit(onSubmit)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  preview: {
    height: 180,
    borderRadius: 12,
  },
});
