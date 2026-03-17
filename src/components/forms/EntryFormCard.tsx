import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface EntryFormCardProps {
  title: string;
  isEditing: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function EntryFormCard({ title, isEditing, onSave, onDelete, children }: PropsWithChildren<EntryFormCardProps>) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
      <View style={styles.footer}>
        {isEditing && onDelete ? (
          <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        ) : null}
        <Pressable style={[styles.button, styles.saveButton]} onPress={onSave}>
          <Text style={styles.buttonText}>{isEditing ? 'Update' : 'Save'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    gap: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#16a34a',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
