import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { z } from 'zod';
import { EntryFormCard } from '../components/forms/EntryFormCard';
import { FormInput, FormLabel, FormSection, InlineError } from '../components/forms/FormPrimitives';
import { useMetrics } from '../providers/MetricsProvider';

const bibleSchema = z.object({
  date: z.string().min(1, 'Date is required (YYYY-MM-DD).'),
  minutes: z.coerce.number().min(1, 'Minutes must be at least 1.'),
  notes: z.string().optional(),
});

type BibleFormValues = z.infer<typeof bibleSchema>;

export function BibleReadingScreen() {
  const { bibleEntries, addBibleEntry, updateBibleEntry, deleteBibleEntry } = useMetrics();
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');
  const { control, handleSubmit, reset, formState } = useForm<BibleFormValues>({
    resolver: zodResolver(bibleSchema),
    defaultValues: { date: today, minutes: 10, notes: '' },
  });

  const onSubmit = (values: BibleFormValues) => {
    if (editingId) {
      updateBibleEntry({ id: editingId, ...values });
    } else {
      addBibleEntry(values);
    }

    setEditingId(null);
    reset({ date: today, minutes: 10, notes: '' });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bible Reading</Text>
      <EntryFormCard
        title={editingId ? 'Edit Reading Entry' : 'New Reading Entry'}
        isEditing={Boolean(editingId)}
        onSave={handleSubmit(onSubmit)}
        onDelete={() => {
          if (editingId) {
            deleteBibleEntry(editingId);
          }
          setEditingId(null);
          reset({ date: today, minutes: 10, notes: '' });
        }}
      >
        <Controller control={control} name="date" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormInput value={value} onChangeText={onChange} /><InlineError message={formState.errors.date?.message} /></FormSection>} />
        <Controller control={control} name="minutes" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Minutes</FormLabel><FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" /><InlineError message={formState.errors.minutes?.message} /></FormSection>} />
        <Controller control={control} name="notes" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Passage Notes (optional)</FormLabel><FormInput value={value ?? ''} onChangeText={onChange} multiline /></FormSection>} />
      </EntryFormCard>

      {bibleEntries.map((entry) => (
        <Pressable key={entry.id} style={styles.listItem} onPress={() => { setEditingId(entry.id); reset(entry); }}>
          <Text style={styles.listTitle}>{entry.date} • {entry.minutes} min</Text>
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
