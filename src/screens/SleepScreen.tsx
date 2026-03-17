import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { z } from 'zod';
import { EntryFormCard } from '../components/forms/EntryFormCard';
import { FormInput, FormLabel, FormSection, InlineError } from '../components/forms/FormPrimitives';
import { useMetrics } from '../providers/MetricsProvider';

const sleepSchema = z.object({
  date: z.string().min(1, 'Date is required (YYYY-MM-DD).'),
  score: z.coerce.number().min(0, 'Score must be at least 0.').max(100, 'Score cannot exceed 100.'),
  durationHours: z.coerce.number().min(0.5, 'Duration must be at least 0.5 hours.'),
  notes: z.string().optional(),
});

type SleepFormValues = z.infer<typeof sleepSchema>;

export function SleepScreen() {
  const { sleepEntries, addSleepEntry, updateSleepEntry, deleteSleepEntry } = useMetrics();
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');
  const { control, handleSubmit, reset, formState } = useForm<SleepFormValues>({
    resolver: zodResolver(sleepSchema),
    defaultValues: { date: today, score: 80, durationHours: 8, notes: '' },
  });

  const onSubmit = (values: SleepFormValues) => {
    if (editingId) {
      updateSleepEntry({ id: editingId, ...values });
    } else {
      addSleepEntry(values);
    }
    setEditingId(null);
    reset({ date: today, score: 80, durationHours: 8, notes: '' });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sleep Entry</Text>
      <EntryFormCard
        title={editingId ? 'Edit Sleep Entry' : 'New Sleep Entry'}
        isEditing={Boolean(editingId)}
        onSave={handleSubmit(onSubmit)}
        onDelete={() => {
          if (editingId) {
            deleteSleepEntry(editingId);
          }
          setEditingId(null);
          reset({ date: today, score: 80, durationHours: 8, notes: '' });
        }}
      >
        <Controller control={control} name="date" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormInput value={value} onChangeText={onChange} /><InlineError message={formState.errors.date?.message} /></FormSection>} />
        <Controller control={control} name="score" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Sleep Score (0-100)</FormLabel><FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" /><InlineError message={formState.errors.score?.message} /></FormSection>} />
        <Controller control={control} name="durationHours" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Duration (hours)</FormLabel><FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" /><InlineError message={formState.errors.durationHours?.message} /></FormSection>} />
        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Notes</FormLabel><FormInput value={value ?? ''} onChangeText={onChange} multiline /></FormSection>} />
      </EntryFormCard>

      {sleepEntries.map((entry) => (
        <Pressable key={entry.id} style={styles.listItem} onPress={() => { setEditingId(entry.id); reset(entry); }}>
          <Text style={styles.listTitle}>{entry.date} • Score {entry.score}</Text>
          <Text>{entry.durationHours} hours</Text>
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
  listItem: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', padding: 10, gap: 4 },
  listTitle: { fontWeight: '700' },
});
