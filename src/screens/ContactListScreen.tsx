import { useCallback, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Contact, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

export function ContactListScreen({ navigation }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadContacts = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const snapshot = await getDocs(collection(db, 'contactos'));
          const loadedContacts = snapshot.docs.map((document) => {
            const data = document.data();

            return {
              id: document.id,
              nombre: data.nombre,
              telefono: data.telefono,
              ciudad: data.ciudad,
            };
          });

          if (isActive) {
            setContacts(loadedContacts);
          }
        } catch {
          if (isActive) {
            setError('No fue posible cargar los contactos.');
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      void loadContacts();

      return () => {
        isActive = false;
      };
    }, []),
  );

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={error ? null : <Text style={styles.empty}>No hay contactos para mostrar.</Text>}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={styles.row}
            onPress={() => navigation.navigate('Detalle', { contactId: item.id })}
          >
            <Text style={styles.name}>{item.nombre}</Text>
            <Text>{item.telefono}</Text>
          </Pressable>
        )}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable accessibilityRole="button" style={styles.newButton} onPress={() => navigation.navigate('Nuevo')}>
        <Text style={styles.newButtonText}>Agregar contacto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 10, flexGrow: 1 },
  loader: { flex: 1 },
  row: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 14, gap: 4 },
  name: { fontSize: 18, fontWeight: '600' },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 24 },
  error: { color: '#b91c1c', textAlign: 'center', marginHorizontal: 16, marginBottom: 12 },
  newButton: { backgroundColor: '#2563eb', padding: 16, margin: 16, marginTop: 0, borderRadius: 8, alignItems: 'center' },
  newButtonText: { color: '#fff', fontWeight: '600' },
});
