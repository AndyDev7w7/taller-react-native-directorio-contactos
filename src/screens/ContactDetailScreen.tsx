import { useEffect, useLayoutEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Contact, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;

export function ContactDetailScreen({ navigation, route }: Props) {
  const { contactId } = route.params;
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadContact = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const contactDocument = await getDoc(doc(db, 'contactos', contactId));

        if (!isActive) {
          return;
        }

        if (!contactDocument.exists()) {
          setContact(null);
          return;
        }

        const data = contactDocument.data();
        setContact({
          id: contactDocument.id,
          nombre: data.nombre,
          telefono: data.telefono,
          ciudad: data.ciudad,
        });
      } catch {
        if (isActive) {
          setError('No fue posible cargar el contacto.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadContact();

    return () => {
      isActive = false;
    };
  }, [contactId]);

  useLayoutEffect(() => {
    if (contact) {
      navigation.setOptions({ title: contact.nombre });
    }
  }, [contact, navigation]);

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>No se encontró el contacto.</Text>
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
  loader: { flex: 1 },
});
