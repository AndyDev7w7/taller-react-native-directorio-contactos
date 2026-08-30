import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContactDetailScreen } from './src/screens/ContactDetailScreen';
import { ContactListScreen } from './src/screens/ContactListScreen';
import { NewContactScreen } from './src/screens/NewContactScreen';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" component={ContactListScreen} options={{ title: 'Contactos' }} />
        <Stack.Screen name="Detalle" component={ContactDetailScreen} options={{ title: 'Detalle' }} />
        <Stack.Screen name="Nuevo" component={NewContactScreen} options={{ title: 'Nuevo contacto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
