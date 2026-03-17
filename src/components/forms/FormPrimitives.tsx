import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function FormSection({ children }: PropsWithChildren) {
  return <View style={styles.section}>{children}</View>;
}

export function FormLabel({ children }: PropsWithChildren) {
  return <Text style={styles.label}>{children}</Text>;
}

interface FormInputProps {
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}

export function FormInput({ value, onChangeText, keyboardType = 'default', multiline = false }: FormInputProps) {
  return (
    <TextInput
      style={[styles.input, multiline ? styles.multilineInput : undefined]}
      value={value}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      multiline={multiline}
    />
  );
}

export function InlineError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <Text style={styles.error}>{message}</Text>;
}

interface ChoicePillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function ChoicePill({ label, selected, onPress }: ChoicePillProps) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, selected ? styles.pillSelected : undefined]}>
      <Text style={[styles.pillText, selected ? styles.pillTextSelected : undefined]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  multilineInput: {
    minHeight: 84,
    textAlignVertical: 'top',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
  },
  pill: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  pillSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  pillText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#fff',
  },
});
