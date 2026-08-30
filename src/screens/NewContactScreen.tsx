import { useEffect, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Nuevo'>;

export function NewContactScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const isActiveRef = useRef(true);

  useEffect(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const handleSave = async () => {
    const trimmedNombre = nombre.trim();
    const trimmedTelefono = telefono.trim();
    const trimmedCiudad = ciudad.trim();

    if (!trimmedNombre || !trimmedTelefono || !trimmedCiudad) {
      Alert.alert('Campos incompletos', 'Completa nombre, teléfono y ciudad.');
      return;
    }

    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    try {
      await addDoc(collection(db, 'contactos'), {
        nombre: trimmedNombre,
        telefono: trimmedTelefono,
        ciudad: trimmedCiudad,
      });

      if (isActiveRef.current) {
        navigation.goBack();
      }
    } catch {
      if (isActiveRef.current) {
        isSavingRef.current = false;
        setIsSaving(false);
        Alert.alert('Error al guardar', 'No fue posible guardar el contacto.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre" style={styles.input} />
      <TextInput value={telefono} onChangeText={setTelefono} placeholder="Teléfono" keyboardType="phone-pad" style={styles.input} />
      <TextInput value={ciudad} onChangeText={setCiudad} placeholder="Ciudad" style={styles.input} />
      <Pressable
        accessibilityRole="button"
        disabled={isSaving}
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>{isSaving ? 'Guardando...' : 'Guardar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  input: { borderWidth: 1, borderColor: '#9ca3af', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
