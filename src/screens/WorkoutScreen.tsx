import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { EntryFormCard } from '../components/forms/EntryFormCard';
import { ChoicePill, FormInput, FormLabel, FormSection, InlineError } from '../components/forms/FormPrimitives';
import { useMetrics } from '../providers/MetricsProvider';

const workoutSchema = z.object({
  date: z.string().min(1, 'Date is required (YYYY-MM-DD).'),
  type: z.string().min(2, 'Type is required.'),
  durationMinutes: z.coerce.number().min(1, 'Duration must be at least 1 minute.'),
  intensity: z.enum(['Low', 'Moderate', 'High']),
  notes: z.string().optional(),
});

type WorkoutFormValues = z.infer<typeof workoutSchema>;

export function WorkoutScreen() {
  const { workoutEntries, addWorkoutEntry, updateWorkoutEntry, deleteWorkoutEntry } = useMetrics();
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');
  const { control, handleSubmit, reset, formState } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: { date: today, type: '', durationMinutes: 30, intensity: 'Moderate', notes: '' },
  });

  const onSubmit = (values: WorkoutFormValues) => {
    if (editingId) {
      updateWorkoutEntry({ id: editingId, ...values });
    } else {
      addWorkoutEntry(values);
    }

    setEditingId(null);
    reset({ date: today, type: '', durationMinutes: 30, intensity: 'Moderate', notes: '' });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Workout Entry</Text>
      <EntryFormCard
        title={editingId ? 'Edit Workout' : 'New Workout'}
        isEditing={Boolean(editingId)}
        onSave={handleSubmit(onSubmit)}
        onDelete={() => {
          if (editingId) {
            deleteWorkoutEntry(editingId);
          }
          setEditingId(null);
          reset({ date: today, type: '', durationMinutes: 30, intensity: 'Moderate', notes: '' });
        }}
      >
        <Controller control={control} name="date" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormInput value={value} onChangeText={onChange} /><InlineError message={formState.errors.date?.message} /></FormSection>} />
        <Controller control={control} name="type" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Type</FormLabel><FormInput value={value} onChangeText={onChange} /><InlineError message={formState.errors.type?.message} /></FormSection>} />
        <Controller control={control} name="durationMinutes" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Duration (minutes)</FormLabel><FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" /><InlineError message={formState.errors.durationMinutes?.message} /></FormSection>} />
        <Controller
          control={control}
          name="intensity"
          render={({ field: { value, onChange } }) => (
            <FormSection>
              <FormLabel>Intensity</FormLabel>
              <View style={styles.row}>
                {(['Low', 'Moderate', 'High'] as const).map((option) => (
                  <ChoicePill key={option} label={option} selected={value === option} onPress={() => onChange(option)} />
                ))}
              </View>
            </FormSection>
          )}
        />
        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Notes</FormLabel><FormInput value={value ?? ''} onChangeText={onChange} multiline /></FormSection>} />
      </EntryFormCard>

      {workoutEntries.map((entry) => (
        <Pressable
          key={entry.id}
          style={styles.listItem}
          onPress={() => {
            setEditingId(entry.id);
            reset(entry);
          }}
        >
          <Text style={styles.listTitle}>{entry.date} • {entry.type}</Text>
          <Text>{entry.durationMinutes} min • {entry.intensity}</Text>
          {entry.notes ? <Text numberOfLines={1}>{entry.notes}</Text> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f5f7fb' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  listItem: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', padding: 10, gap: 4 },
  listTitle: { fontWeight: '700' },
});
