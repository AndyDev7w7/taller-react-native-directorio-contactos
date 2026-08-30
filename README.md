# Directorio de Contactos

Aplicación académica desarrollada con Expo, React Native, TypeScript, React Navigation y Cloud Firestore.

- Autor: Juan Andres Taborda Rodriguez
- Sistema operativo de desarrollo: Windows

## Requisitos

Se necesitan Node.js LTS con npm, una cuenta de Google para Firebase Console y un teléfono con Expo Go o un emulador compatible. En Windows también se requiere Android Studio si se usará el emulador.

## Configuración

1. Ejecutar `npm install` en la raíz del proyecto.
2. Copiar `.env.example` como `.env` con `Copy-Item .env.example .env`.
3. En Firebase Console, crear o seleccionar un proyecto, registrar una app web y copiar al `.env` los seis valores de su configuración: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` y `appId`. No se deben inventar valores ni subir el `.env` al repositorio.
4. Habilitar Cloud Firestore y crear la colección exacta `contactos` con tres documentos ficticios iniciales. Cada documento debe tener los campos de texto `nombre`, `telefono` y `ciudad`.
5. Para este ejercicio sin autenticación se puede elegir temporalmente el modo de prueba y usar solo datos ficticios. Sus reglas abiertas exponen los datos y expiran, por lo que deben reemplazarse por reglas restrictivas después de la evaluación y antes de cualquier publicación real.

Las variables `EXPO_PUBLIC_` quedan visibles en el bundle del cliente; el archivo `.env` evita versionarlas, pero no las vuelve secretas. Las Security Rules de Firestore, apoyadas por autenticación cuando corresponda, son las que protegen los datos.

## Ejecución

Ejecutar `npx expo start`, abrir el código QR con Expo Go o iniciar el emulador desde las opciones de Expo. La conexión real depende de completar el `.env` y de configurar Firestore; este repositorio no incluye credenciales.

## Capturas

Durante la prueba de la app en un dispositivo o emulador, el estudiante debe crear desde la app un contacto ficticio y tomar las siguientes capturas en `capturas/`:

- `01-lista.png`: pantalla Lista con los contactos.
- `02-detalle.png`: pantalla Detalle del contacto seleccionado.
- `03-nuevo.png`: pantalla Nuevo con el formulario.
- `04-firestore-contacto.png`: Firebase Console mostrando el contacto creado desde el dispositivo.

Las imágenes, la publicación del repositorio y la entrega en Virtual TdeA requieren verificación manual.
