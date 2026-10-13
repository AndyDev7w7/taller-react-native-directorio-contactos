# Directorio de Contactos

App academica hecha con Expo, React Native, TypeScript, React Navigation y Cloud Firestore.

- Sistema operativo de desarrollo: Windows

## Requisitos

Uso Node.js LTS con npm, una cuenta de Google para Firebase Console y Expo Go en el celular
o un emulador compatible. En Windows tambien hace falta Android Studio si se usara el
emulador.

## Configuracion

1. Ejecuto `npm install` en la raiz del proyecto.
2. Copio `.env.example` como `.env` con `Copy-Item .env.example .env`.
3. En Firebase Console creo o elijo un proyecto, registro una app web y copio al `.env` los valores de `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`.
4. Habilito Cloud Firestore y creo la coleccion exacta `contactos` con tres documentos ficticios. Cada uno lleva `nombre`, `telefono` y `ciudad` como texto.
5. Para este ejercicio sin autenticacion puedo usar temporalmente el modo de prueba y datos ficticios. Antes de una publicacion real cambiaria las reglas por otras restrictivas.

Las variables `EXPO_PUBLIC_` quedan visibles en el bundle. El `.env` evita subirlas al
repositorio, pero no las convierte en secretos. Las Security Rules de Firestore son las que
protegen los datos del cliente.

## Ejecucion

Ejecuto `npx expo start`. Luego abro el codigo QR con Expo Go o inicio el emulador desde las
opciones de Expo. La app necesita un `.env` completo y Firestore configurado. El repositorio
no incluye credenciales.

## Capturas

En `capturas/` estan las evidencias pedidas en el taller:

- `01-lista.png`: lista de contactos.
- `02-detalle.png`: detalle de un contacto.
- `03-nuevo.png`: formulario para crear un contacto.
- `04-firestore-contacto.png`: Firestore con el contacto creado desde la app.
