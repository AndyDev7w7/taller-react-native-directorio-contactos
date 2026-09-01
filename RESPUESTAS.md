# Taller: Introduccion a React Native

## Pregunta 1

### a) Entorno de desarrollo movil

| Herramienta | Que papel cumple? |
|---|---|
| Node.js y npm | Node.js ejecuta JavaScript y las herramientas del proyecto en el computador. npm instala dependencias y ejecuta los scripts de `package.json`. |
| Metro bundler | Metro resuelve y transforma los modulos de React Native para generar el bundle de la app. Tambien ayuda con la recarga durante el desarrollo. |
| JDK y Android SDK | El JDK y Gradle compilan la parte Java/Kotlin. El Android SDK aporta plataformas, build-tools, `adb` y el emulador para construir, instalar y depurar. |
| Xcode | Xcode incluye el SDK de iOS, compilador, simulador, firma y herramientas de distribucion de Apple. Solo se instala en macOS. |
| Expo Go | Expo Go es una app ya compilada para abrir proyectos Expo en pruebas y aprendizaje. Solo trae los modulos nativos incluidos en la app. |

### b) Compilacion para iOS desde Windows o Linux

Ni Windows ni Linux pueden hacer un build local de iOS porque necesitan Xcode, que Apple
solo ofrece para macOS. Abrir JavaScript en Expo Go desde un iPhone no es lo mismo que
compilar o firmar un `.ipa`. Se puede usar un Mac propio, institucional o remoto con Xcode.
Otra opcion es EAS Build, que compila en equipos macOS en la nube. Para instalar o
publicar siguen haciendo falta las credenciales y la cuenta de Apple.

### c) Variables de entorno

Las variables de entorno son valores que el sistema entrega a los procesos para indicar
rutas o configuraciones sin escribirlas en el codigo. `ANDROID_HOME` apunta al Android SDK
y `PATH` debe incluir carpetas como `platform-tools`. Si estan mal configuradas, Expo,
Gradle o la terminal no encuentran el SDK, `adb` o el emulador. Una variable de usuario
solo sirve para la cuenta actual. Una de sistema aplica a todos y suele pedir permisos de
administrador para cambiarla.

### d) Expo frente a React Native CLI

Para este taller usaria Expo porque permite iniciar y recargar rapido, y simplifica el uso
del SDK y los builds en la nube. Expo Go trae modulos nativos fijos, asi que un cambio nativo
requiere crear y recompilar un development build. React Native CLI da control directo sobre
`android/`, `ios/`, dependencias y depuracion nativa. A cambio hay que mantener Gradle, SDK,
Xcode y CocoaPods, y para iOS local todavia hace falta un Mac. Lo usaria si necesito una
integracion nativa muy especifica o administrar los dos proyectos nativos.

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

En React Native paso los estilos como objetos JavaScript con `style` o
`StyleSheet.create`. No hay selectores ni cascada global. Las propiedades usan camelCase,
como `backgroundColor`, y las medidas numericas no llevan `px` porque son independientes de
la densidad. Aunque usa Flexbox, no comparte todas las propiedades ni los mismos valores que
CSS: `flexDirection` vale `column` por defecto y en CSS suele valer `row`. En una pantalla
movil esto funciona bien para formularios, tarjetas y listas que van de arriba hacia abajo.

### c) Props y estado

Las props son datos que un componente padre le pasa a un hijo y el hijo no debe cambiarlas.
Por ejemplo, una fila puede recibir el identificador y el precio de un producto. El estado es
la memoria de una instancia: se conserva entre renders y cambia con un setter como el de
`useState`. En una lista, el texto de busqueda, el indicador de carga o los productos
consultados deberian estar en el estado. Si varios componentes cambian el mismo valor, lo
subiria a un ancestro comun o usaria un almacen compartido.

## Pregunta 3

### a) Tipos de navegador

| Navegador | Para que sirve? | Caso de uso |
|---|---|---|
| Stack | Apila pantallas y permite volver a la anterior. | En un directorio: Lista → Detalle → Nuevo. |
| Tabs | Cambia entre secciones principales del mismo nivel con pestañas. | Una app con Inicio, Contactos y Perfil. |
| Drawer | Muestra rutas globales en un menu lateral que abre con un gesto o boton. | Una app institucional con Perfil, Ajustes y Ayuda. |

### b) Contenedor de navegacion

`NavigationContainer` conecta el navegador raiz con la app. Maneja el estado global de
navegacion, los enlaces profundos y el boton de regreso de Android. Debe haber solo uno en
la raiz, porque varios contenedores crean arboles y estados separados que no navegan entre
ellos. Dentro de ese unico contenedor si puedo anidar Stack, Tabs o Drawer.

### c) Paso de parametros

Desde el origen puedo enviar un valor con
`navigation.navigate('Detalle', { contactoId: id })`. La pantalla destino lee
`route.params.contactoId` y consulta el documento. Enviaria solo el identificador, no el
objeto completo. Asi los parametros son pequenos y serializables, no quedan copias viejas y
Firestore o la cache siguen siendo la fuente de verdad. Tambien se facilita recuperar el
estado de navegacion y usar enlaces profundos.

### d) Estado al regresar a una pantalla

Al pasar de A a B, normalmente A sigue montada. Cuando regreso, B se desmonta y A conserva
su estado. Por eso una consulta que corre solo al montar A no se repite despues de crear un
registro en B. Si la lista debe actualizarse, puedo recargarla cuando obtiene el foco con
`useFocusEffect` o dejar una suscripcion de Firestore con `onSnapshot`. Luego B hace
`goBack()` al guardar y A muestra los datos nuevos.

### e) Regresar en Android e iOS

Android tiene boton o gesto de regreso. React Navigation lo integra y saca la pantalla
actual de la pila, o deja salir si no hay una anterior. iOS no tiene un boton fisico igual:
usa el boton del encabezado y el gesto desde el borde. La libreria mantiene la misma pila
para traducir esas acciones. Solo las interceptaria si la app necesita un caso especial.

## Pregunta 4

### a) Preparacion de Firebase

Creo el proyecto en Firebase Console y registro una app web para obtener sus seis valores
de configuracion. Habilito Cloud Firestore, elijo ubicacion y reglas iniciales, creo la
coleccion `contactos` y agrego tres documentos ficticios con `nombre`, `telefono` y
`ciudad`. Instalo `firebase`, guardo los valores en un `.env` ignorado y dejo un
`.env.example` con los nombres de las variables vacios. En un unico modulo creo
`firebaseConfig`, inicio Firebase, exporto `db = getFirestore(app)` y reviso las reglas
antes de probar lecturas y escrituras.

### b) Claves del objeto de configuracion

| Clave | Que identifica? |
|---|---|
| `apiKey` | Identifica y dirige las solicitudes del cliente al proyecto y a sus API permitidas. Por si sola no da acceso a los datos. |
| `projectId` | Es el identificador unico del proyecto de Firebase y Google Cloud donde estan los recursos. |
| `appId` | Identifica de forma unica la app web registrada dentro del proyecto de Firebase. |
| `storageBucket` | Indica el bucket predeterminado de Cloud Storage. No es la base de datos Firestore. |

### c) Visibilidad de apiKey

La `apiKey` de Firebase es publica por diseno. Identifica y dirige solicitudes, pero no da
permiso para leer o cambiar datos. La proteccion del cliente esta en Firebase Authentication
y las Security Rules de Firestore, Storage o Realtime Database. App Check puede validar el
origen de las solicitudes y los servidores usan IAM. Guardarla en `.env` evita subirla por
accidente, pero una variable `EXPO_PUBLIC_` sigue visible en el bundle. Nunca debe guardar
secretos de servidor ni claves privadas.

### d) Modo de prueba y modo de produccion

El modo de prueba deja reglas abiertas por un tiempo para empezar rapido desde SDK moviles
o web. Cualquiera que conozca la configuracion podria leer o sobrescribir datos, y las reglas
de la consola expiran. El modo de produccion niega lecturas y escrituras del cliente hasta
definir permisos, por ejemplo con autenticacion y validacion de campos. Publicar con reglas
de prueba expone la confidencialidad e integridad: alguien podria leer, crear, modificar o
borrar contactos, y tambien generar uso y costos.

### e) Cloud Firestore frente a Realtime Database

Firestore organiza datos en colecciones y documentos, tiene consultas indexadas mas
completas y escala automaticamente. Realtime Database usa un arbol JSON, sus consultas son
mas limitadas y suele pedir mas desnormalizacion. Los dos sincronizan en tiempo real y
funcionan sin conexion en movil. Realtime Database va bien para presencia y cambios de
estado muy frecuentes con baja latencia. Firestore cobra principalmente por operaciones. Realtime Database
toma en cuenta almacenamiento y ancho de banda, y sus reglas funcionan distinto. Para este
directorio elegiria Firestore porque `contactos` funciona como coleccion de documentos y
facilita listar, consultar y crear.
