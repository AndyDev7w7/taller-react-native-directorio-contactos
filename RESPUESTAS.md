# Taller: Introducción a React Native

## Pregunta 1

### a) Entorno de desarrollo móvil

| Herramienta | ¿Qué papel cumple? |
|---|---|
| Node.js y npm | Node.js ejecuta JavaScript y las herramientas del proyecto en el computador; npm instala las dependencias y ejecuta los scripts definidos en `package.json`. |
| Metro bundler | Resuelve y transforma los módulos de React Native para formar el bundle que recibe la app, además de facilitar la recarga durante el desarrollo. |
| JDK y Android SDK | El JDK y Gradle permiten compilar la parte Java/Kotlin; el Android SDK aporta plataformas, build-tools, `adb` y el emulador para construir, instalar y depurar. |
| Xcode | Es el entorno de Apple con el SDK de iOS, compilador, simulador, firma y herramientas de distribución; solo se instala en macOS. |
| Expo Go | Es una app cliente ya compilada que abre proyectos Expo para aprendizaje y pruebas rápidas, aunque solo acepta los módulos nativos incluidos en ella. |

### b) Compilación para iOS desde Windows o Linux

Ninguno puede hacer un build local de iOS porque este necesita Xcode y Apple solo lo ofrece para macOS; ejecutar el JavaScript en Expo Go desde un iPhone no equivale a compilar ni firmar un `.ipa`. Una alternativa es usar un Mac propio, institucional o remoto con Xcode para probar, firmar y publicar. Otra es usar EAS Build, que compila en equipos macOS en la nube; aun así, para instalar o publicar se requieren las credenciales y la cuenta de Apple correspondientes.

### c) Variables de entorno

Las variables de entorno son valores que el sistema operativo entrega a los procesos para indicar rutas o configuraciones sin escribirlas en el código. `ANDROID_HOME` debe apuntar al Android SDK y `PATH` debe incluir carpetas ejecutables como `platform-tools`; si están mal, Expo, Gradle o la terminal no encuentran el SDK, `adb` o el emulador y el proceso falla. Una variable de usuario solo está disponible para la cuenta actual, mientras una de sistema se aplica a todos los usuarios y normalmente requiere permisos de administrador para cambiarla.

### d) Expo frente a React Native CLI

Expo permite iniciar y recargar rápido, y simplifica el acceso a librerías del SDK y builds en la nube; como límites, Expo Go trae módulos nativos fijos y cualquier cambio nativo exige crear y recompilar un development build. Es una buena opción para este taller, prototipos y aplicaciones que encajen con su flujo. React Native CLI da control directo de `android/`, `ios/`, dependencias y depuración nativa; a cambio exige mantener Gradle, SDK, Xcode y CocoaPods, y el build local de iOS sigue necesitando un Mac. Conviene ante integraciones nativas muy específicas o si el equipo quiere administrar directamente ambos proyectos nativos.

## Pregunta 2

### a) Equivalencias entre web y React Native

| En la web | En React Native |
|---|---|
| `<div>` | `View` |
| `<p> o <span>` | `Text` |
| `<img>` | `Image` |
| `<input>` | `TextInput` |
| Lista larga con scroll | `FlatList` |

### b) Estilos de React Native y CSS

En React Native los estilos se pasan como objetos JavaScript mediante `style` o `StyleSheet.create`, sin selectores ni cascada global; las propiedades usan camelCase, como `backgroundColor`, y las medidas numéricas no llevan `px`, pues representan unidades independientes de densidad. Además, aunque usa Flexbox, no tiene exactamente las mismas propiedades ni valores iniciales de la web: `flexDirection` vale `column` por defecto, mientras en CSS normalmente vale `row`. La columna tiene sentido en una pantalla móvil estrecha porque formularios, tarjetas y listas suelen organizarse de arriba hacia abajo, aunque se puede cambiar a `row` cuando el diseño lo necesite.

### c) Props y estado

Las props son datos que un componente padre entrega a un hijo para configurarlo y el hijo no debe modificarlas; por ejemplo, una fila de productos puede recibir como prop el identificador y el precio del producto. El estado es la memoria propia de una instancia, se conserva entre renders y se actualiza con un setter como el de `useState`; en una pantalla de lista, el texto de búsqueda, el indicador de carga o los productos consultados deberían ser estado. Si varios componentes necesitan modificar el mismo valor, conviene subirlo a un ancestro común o usar un almacén compartido.

## Pregunta 3

### a) Tipos de navegador

| Navegador | ¿Para qué sirve? | Caso de uso |
|---|---|---|
| Stack | Apila pantallas y permite volver a la anterior. | En un directorio: Lista → Detalle → Nuevo. |
| Tabs | Alterna entre secciones principales del mismo nivel mediante pestañas. | Una app con Inicio, Contactos y Perfil. |
| Drawer | Presenta rutas globales en un menú lateral que se abre con gesto o botón. | Una app institucional con Perfil, Ajustes y Ayuda. |

### b) Contenedor de navegación

`NavigationContainer` conecta el navegador raíz con la aplicación y administra el estado global de navegación, los enlaces profundos y la integración con el botón de regreso de Android. Debe existir uno solo en la raíz porque varios contenedores crean árboles y estados aislados que no pueden navegar entre sí y duplican la integración con la plataforma. Lo que sí se puede hacer es anidar Stack, Tabs o Drawer dentro de ese contenedor único.

### c) Paso de parámetros

El origen puede enviar un valor con `navigation.navigate('Detalle', { contactoId: id })` y el destino lo lee desde `route.params.contactoId` para consultar el documento. Conviene enviar únicamente el identificador y no el objeto completo: así los parámetros siguen siendo pequeños y serializables, se evitan copias desactualizadas y Firestore o la caché continúan siendo la fuente de verdad. También se facilitan los enlaces profundos y la recuperación del estado de navegación.

### d) Estado al regresar a una pantalla

Al pasar de A a B, normalmente A queda montada; cuando se regresa, B se desmonta y A conserva su estado en vez de crearse desde cero. Por eso una consulta ejecutada solo al montar A no se repite automáticamente después de crear un registro en B. Si A muestra una lista que debe actualizarse, se puede recargar cuando obtiene el foco con `useFocusEffect` o mantener una suscripción de Firestore con `onSnapshot`; después de guardar, B hace `goBack()` y A refleja los nuevos datos.

### e) Regresar en Android e iOS

Android ofrece un botón o gesto de regreso del sistema; React Navigation lo integra y desapila la pantalla actual o permite salir si ya no hay una anterior. iOS no tiene un botón físico equivalente: usa el botón del encabezado y el gesto desde el borde para volver. La librería mantiene la misma pila para traducir estas interacciones a la acción de regresar de forma coherente, y solo hace falta interceptarlas si la aplicación tiene un caso especial.

## Pregunta 4

### a) Preparación de Firebase

Creo el proyecto en Firebase Console y registro una app web para obtener sus seis valores de configuración. Habilito Cloud Firestore, elijo ubicación y reglas iniciales, creo la colección `contactos` y agrego tres documentos ficticios con `nombre`, `telefono` y `ciudad`. Instalo `firebase`, guardo los valores en un `.env` ignorado y dejo un `.env.example` con los nombres de las variables y valores vacíos. En un único módulo construyo `firebaseConfig`, inicializo Firebase, exporto `db = getFirestore(app)` y verifico las reglas de seguridad antes de probar lecturas y escrituras.

### b) Claves del objeto de configuración

| Clave | ¿Qué identifica? |
|---|---|
| `apiKey` | Identifica y enruta las solicitudes del cliente hacia el proyecto y sus API permitidas; por sí sola no autoriza el acceso a los datos. |
| `projectId` | Es el identificador único del proyecto de Firebase y Google Cloud al que pertenecen los recursos. |
| `appId` | Identifica de forma única la app web registrada dentro del proyecto de Firebase. |
| `storageBucket` | Indica el bucket predeterminado de Cloud Storage; no representa la base de datos Firestore. |

### c) Visibilidad de apiKey

La `apiKey` de Firebase es pública por diseño: sirve para identificar y dirigir solicitudes, pero no concede permiso para leer o cambiar los datos. La protección real del cliente está en Firebase Authentication y las Security Rules de Firestore, Storage o Realtime Database; App Check puede ayudar a validar el origen de las solicitudes y los servidores usan IAM. Guardarla en `.env` evita subirla por accidente, pero una variable `EXPO_PUBLIC_` sigue visible en el bundle y nunca debe contener secretos de servidor ni claves privadas.

### d) Modo de prueba y modo de producción

El modo de prueba deja reglas abiertas temporalmente para empezar con rapidez desde SDK móviles o web; cualquiera que conozca la configuración puede leer o sobrescribir los datos y las reglas generadas por la consola expiran. El modo de producción niega inicialmente las lecturas y escrituras del cliente hasta definir permisos explícitos, por ejemplo con autenticación y validación de campos. Publicar con reglas de prueba expone la confidencialidad e integridad: una persona anónima podría leer, crear, modificar o borrar contactos, además de generar uso y costos.

### e) Cloud Firestore frente a Realtime Database

Firestore organiza los datos en colecciones y documentos, ofrece consultas indexadas más completas y escala automáticamente; Realtime Database usa un árbol JSON, tiene consultas más limitadas y suele requerir mayor desnormalización. Ambos sincronizan en tiempo real y ofrecen soporte móvil sin conexión, pero Realtime Database destaca para presencia y cambios de estado muy frecuentes con baja latencia. Firestore cobra principalmente por operaciones, mientras Realtime Database considera almacenamiento y ancho de banda, y sus reglas también se comportan distinto. Para este directorio elegiría Firestore porque `contactos` encaja como colección de documentos y facilita consultar, listar y crear contactos con una estructura clara.
