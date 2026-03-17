import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';
import { EntryFormCard } from '../components/forms/EntryFormCard';
import { FormInput, FormLabel, FormSection, InlineError } from '../components/forms/FormPrimitives';
import { NUTRITION_GOALS } from '../domain/metrics';
import { useMetrics } from '../providers/MetricsProvider';

const dietSchema = z.object({
  date: z.string().min(1, 'Date is required (YYYY-MM-DD).'),
  calories: z.coerce.number().min(0, 'Calories cannot be negative.'),
  proteinGrams: z.coerce.number().min(0, 'Protein cannot be negative.'),
  carbsGrams: z.coerce.number().min(0, 'Carbs cannot be negative.'),
  fatGrams: z.coerce.number().min(0, 'Fat cannot be negative.'),
});

type DietFormValues = z.infer<typeof dietSchema>;

export function DietScreen() {
  const { dietEntries, addDietEntry, updateDietEntry, deleteDietEntry, getDashboardSummaryForDate } = useMetrics();
  const [editingId, setEditingId] = useState<string | null>(null);
  const today = dayjs().format('YYYY-MM-DD');
  const { control, handleSubmit, reset, formState } = useForm<DietFormValues>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      date: today,
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatGrams: 0,
    },
  });

  const totals = useMemo(() => getDashboardSummaryForDate(today), [getDashboardSummaryForDate, today, dietEntries]);

  const onSubmit = (values: DietFormValues) => {
    if (editingId) {
      updateDietEntry({ id: editingId, ...values });
    } else {
      addDietEntry(values);
    }

    setEditingId(null);
    reset({ date: today, calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 });
  };

  const startEdit = (id: string) => {
    const entry = dietEntries.find((item) => item.id === id);
    if (!entry) {
      return;
    }

    setEditingId(id);
    reset(entry);
  };

  const removeCurrent = () => {
    if (editingId) {
      deleteDietEntry(editingId);
    }
    setEditingId(null);
    reset({ date: today, calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 });
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Diet Entry</Text>
      <Text style={styles.subtle}>Daily goal comparison updates immediately after save.</Text>
      <View style={styles.goalCard}>
        <Text>Calories: {totals.calories}/{NUTRITION_GOALS.calories}</Text>
        <Text>Protein: {totals.proteinGrams}g/{NUTRITION_GOALS.proteinGrams}g</Text>
        <Text>Carbs: {totals.carbsGrams}g/{NUTRITION_GOALS.carbsGrams}g</Text>
        <Text>Fat: {totals.fatGrams}g/{NUTRITION_GOALS.fatGrams}g</Text>
      </View>

      <EntryFormCard
        title={editingId ? 'Edit Diet Entry' : 'New Diet Entry'}
        isEditing={Boolean(editingId)}
        onSave={handleSubmit(onSubmit)}
        onDelete={removeCurrent}
      >
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <FormSection>
              <FormLabel>Date (YYYY-MM-DD)</FormLabel>
              <FormInput value={value} onChangeText={onChange} />
              <InlineError message={formState.errors.date?.message} />
            </FormSection>
          )}
        />
        {(['calories', 'proteinGrams', 'carbsGrams', 'fatGrams'] as const).map((field) => (
          <Controller
            key={field}
            control={control}
            name={field}
            render={({ field: { onChange, value } }) => (
              <FormSection>
                <FormLabel>{field}</FormLabel>
                <FormInput value={String(value)} onChangeText={onChange} keyboardType="numeric" />
                <InlineError message={formState.errors[field]?.message} />
              </FormSection>
            )}
          />
        ))}
      </EntryFormCard>

      {dietEntries.map((entry) => (
        <Pressable key={entry.id} style={styles.listItem} onPress={() => startEdit(entry.id)}>
          <Text style={styles.listTitle}>{entry.date}</Text>
          <Text>{entry.calories} cal • P{entry.proteinGrams} C{entry.carbsGrams} F{entry.fatGrams}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f5f7fb' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  subtle: { color: '#475569' },
  goalCard: { backgroundColor: '#e2e8f0', borderRadius: 10, padding: 10, gap: 2 },
  listItem: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dbeafe', padding: 10, gap: 4 },
  listTitle: { fontWeight: '700' },
});
