import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { EntryFormCard } from '../components/forms/EntryFormCard';
import { ChoicePill, FormInput, FormLabel, FormSection, InlineError } from '../components/forms/FormPrimitives';
import { useMetrics } from '../providers/MetricsProvider';

const waterSchema = z.object({
  date: z.string().min(1, 'Date is required (YYYY-MM-DD).'),
  ounces: z.coerce.number().min(1, 'Enter at least 1 oz.'),
});

type WaterFormValues = z.infer<typeof waterSchema>;

export function WaterScreen() {
  const { waterEntries, addWaterEntry, updateWaterEntry, deleteWaterEntry } = useMetrics();
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');
  const { control, handleSubmit, reset, setValue, watch, formState } = useForm<WaterFormValues>({
    resolver: zodResolver(waterSchema),
    defaultValues: { date: today, ounces: 16 },
  });
  const ounces = watch('ounces');

  const onSubmit = (values: WaterFormValues) => {
    if (editingId) {
      updateWaterEntry({ id: editingId, ...values });
    } else {
      addWaterEntry(values);
    }
    setEditingId(null);
    reset({ date: today, ounces: 16 });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Water Entry</Text>
      <EntryFormCard
        title={editingId ? 'Edit Water' : 'Quick Add Water'}
        isEditing={Boolean(editingId)}
        onSave={handleSubmit(onSubmit)}
        onDelete={() => {
          if (editingId) {
            deleteWaterEntry(editingId);
          }
          setEditingId(null);
          reset({ date: today, ounces: 16 });
        }}
      >
        <Controller control={control} name="date" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormInput value={value} onChangeText={onChange} /><InlineError message={formState.errors.date?.message} /></FormSection>} />
        <FormSection>
          <FormLabel>Quick Add</FormLabel>
          <View style={styles.row}>
            {[8, 12, 16, 24].map((quickAmount) => (
              <ChoicePill key={quickAmount} label={`${quickAmount} oz`} selected={ounces === quickAmount} onPress={() => setValue('ounces', quickAmount)} />
            ))}
          </View>
        </FormSection>
        <Controller control={control} name="ounces" render={({ field: { onChange, value } }) => <FormSection><FormLabel>Custom Amount (oz)</FormLabel><FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" /><InlineError message={formState.errors.ounces?.message} /></FormSection>} />
      </EntryFormCard>

      {waterEntries.map((entry) => (
        <Pressable key={entry.id} style={styles.listItem} onPress={() => { setEditingId(entry.id); reset(entry); }}>
          <Text style={styles.listTitle}>{entry.date}</Text>
          <Text>{entry.ounces} oz</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f5f7fb' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  listItem: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', padding: 10, gap: 4 },
  listTitle: { fontWeight: '700' },
});
