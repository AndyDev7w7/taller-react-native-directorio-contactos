import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { temporaryContacts } from '../data/temporaryContacts';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'>;

export function ContactListScreen({ navigation }: Props) {
  const isLoading = false;

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={temporaryContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay contactos para mostrar.</Text>}
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
  newButton: { backgroundColor: '#2563eb', padding: 16, margin: 16, marginTop: 0, borderRadius: 8, alignItems: 'center' },
  newButtonText: { color: '#fff', fontWeight: '600' },
});
