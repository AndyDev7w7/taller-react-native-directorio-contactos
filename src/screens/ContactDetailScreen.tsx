import { useLayoutEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { temporaryContacts } from '../data/temporaryContacts';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

export function ContactDetailScreen({ navigation, route }: Props) {
  const { contactId } = route.params;
  const contact = temporaryContacts.find((item) => item.id === contactId);

  useLayoutEffect(() => {
    if (contact) {
      navigation.setOptions({ title: contact.nombre });
    }
  }, [contact, navigation]);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Contacto no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <Text style={styles.value}>{contact.nombre}</Text>
      <Text style={styles.label}>Teléfono</Text>
      <Text style={styles.value}>{contact.telefono}</Text>
      <Text style={styles.label}>Ciudad</Text>
      <Text style={styles.value}>{contact.ciudad}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 6 },
  label: { fontSize: 14, color: '#4b5563', marginTop: 12 },
  value: { fontSize: 18 },
});
