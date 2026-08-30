# Directorio de Contactos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y documentar el taller individual "Introducción a React Native" a nombre de Juan Andres Taborda Rodriguez, con las tres pantallas obligatorias y conexión a Cloud Firestore.

**Architecture:** Aplicación Expo SDK 54 con TypeScript y un `NativeStackNavigator`. Cada pantalla accede directamente a la instancia centralizada de Firestore porque el alcance no justifica capas de servicios; Lista recarga mediante `useFocusEffect`, Detalle consulta por `contactId` y Nuevo valida y crea el documento.

**Tech Stack:** Expo SDK 54, React Native, TypeScript, React Navigation Native Stack, Firebase JS SDK modular (12+), Cloud Firestore.

**Spec:** `C:\Users\adame\Downloads\Taller_Introduccion_React_Native (2).pdf`

## Global Constraints

- El PDF original y su rúbrica prevalecen sobre este plan.
- Usar Expo SDK 54 porque la documentación vigente indica que es la versión compatible con Expo Go distribuido en las tiendas para aprendizaje.
- Implementar solamente lo obligatorio; no añadir suscripción en tiempo real, eliminación, Tabs ni reglas del reto opcional.
- Colección Firestore exacta: `contactos`. Campos exactos: `nombre`, `telefono`, `ciudad`.
- Código e identificadores internos en inglés cuando sea natural; interfaz, README y respuestas en español.
- El archivo `.env` local queda ignorado; `.env.example` contiene nombres y valores vacíos.
- No afirmar ejecución en dispositivo, conexión real con Firebase ni capturas sin evidencia manual.
- Cada literal de `RESPUESTAS.md` tendrá como máximo 8 líneas fuente, sin contar las filas internas de las tablas.
- No publicar, hacer push ni entregar en Virtual TdeA sin autorización explícita.

## File Structure

- `App.tsx`: contenedor único de navegación y configuración del Stack.
- `src/types.ts`: tipos de contacto y parámetros del Stack.
- `src/firebaseConfig.ts`: única inicialización de Firebase/Firestore desde variables Expo.
- `src/screens/ContactListScreen.tsx`: consulta, carga, vacío, lista eficiente y navegación.
- `src/screens/ContactDetailScreen.tsx`: consulta individual por ID, contenido y título dinámico.
- `src/screens/NewContactScreen.tsx`: formulario, validación, escritura y regreso.
- `.env`: valores locales aportados por el estudiante; ignorado por Git.
- `.env.example`: nombres públicos de variables con valores vacíos.
- `RESPUESTAS.md`: preguntas 1 a 4 con todos sus literales y tablas.
- `README.md`: autor, Windows y pasos reales de configuración/ejecución.
- `capturas/.gitkeep`: conserva la carpeta hasta incorporar las cuatro capturas reales.

---

### Task 1: Scaffold Expo and repository safety

**Files:**
- Create: `.git/`, Expo SDK 54 blank TypeScript scaffold, `.env`, `.env.example`
- Modify: `.gitignore`, `package.json`, `app.json`

**Interfaces:**
- Produces: proyecto Expo mínimo ejecutable; variables `EXPO_PUBLIC_FIREBASE_*` disponibles mediante acceso estático a `process.env`.

- [ ] **Step 1: Generate the minimal Expo project without overwriting the existing diagnostic files**

Run from the workspace root:

```powershell
npx create-expo-app@latest expo-scaffold --template blank-typescript@sdk-54 --no-agents-md
```

Verify `expo-scaffold` resolves inside the workspace, copy its generated files into the workspace root without copying a nested `.git`, remove only the verified `expo-scaffold` directory, and then run `git init` at the root. Expected: `package.json`, `App.tsx`, `app.json` and `tsconfig.json` exist at the root; Expo dependency belongs to SDK 54 and the diagnostic plan remains present.

Before generating, run `node --version`; Expo SDK 54 requires Node 20.19.x or newer. If the runtime is older, stop this task instead of generating a broken project.

- [ ] **Step 2: Install only required dependencies**

```powershell
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context firebase
```

Expected: all packages resolve without `ERESOLVE` or unsupported Firebase versions; Firebase is 12.0.0 or newer.

- [ ] **Step 3: Personalize the initial screen and record the device-only check**

Before navigation is introduced, replace the generated `App.tsx` content with a centered `Text` reading `Directorio de Contactos`. Verify it with `npx tsc --noEmit`. Opening it in Expo Go/emulator and confirming Fast Refresh in under two seconds remains `PENDIENTE DE VERIFICACIÓN MANUAL` until the user performs it.

- [ ] **Step 4: Add safe environment files**

`.env` and `.env.example` contain these exact keys; only the local file will later receive actual values:

```dotenv
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Ensure `.gitignore` includes:

```gitignore
node_modules/
.env
dist/
tmp/
```

- [ ] **Step 5: Verify scaffold and secret exclusions**

```powershell
npx tsc --noEmit
npx expo-doctor@latest
git check-ignore -v .env node_modules
git status --short
```

Expected: TypeScript and Expo Doctor exit 0; `.env` and `node_modules` are ignored; `.env.example` is not ignored.

- [ ] **Step 6: Commit the verified scaffold**

```powershell
git add .gitignore .env.example App.tsx app.json assets index.ts package.json package-lock.json tsconfig.json docs/superpowers/plans/2026-08-30-directorio-contactos.md
git diff --cached --check
git commit -m "chore: create Expo project"
```

### Task 2: Navigation and screen behavior

**Files:**
- Create: `src/types.ts`
- Create: `src/screens/ContactListScreen.tsx`
- Create: `src/screens/ContactDetailScreen.tsx`
- Create: `src/screens/NewContactScreen.tsx`
- Modify: `App.tsx`

**Interfaces:**
- Produces: `Contact`, `RootStackParamList`, screens `Lista`, `Detalle`, `Nuevo`.
- `Detalle` consumes only `{ contactId: string }`, not a whole contact object.

- [ ] **Step 1: Define shared navigation types**

Create `src/types.ts`:

```ts
export type Contact = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
};

export type RootStackParamList = {
  Lista: undefined;
  Detalle: { contactId: string };
  Nuevo: undefined;
};
```

- [ ] **Step 2: Configure one navigation container and native Stack**

`App.tsx` must render one `NavigationContainer` and screens in this order:

```tsx
<Stack.Navigator initialRouteName="Lista">
  <Stack.Screen name="Lista" component={ContactListScreen} options={{ title: 'Contactos' }} />
  <Stack.Screen name="Detalle" component={ContactDetailScreen} options={{ title: 'Detalle' }} />
  <Stack.Screen name="Nuevo" component={NewContactScreen} options={{ title: 'Nuevo contacto' }} />
</Stack.Navigator>
```

- [ ] **Step 3: Build the list contract with temporary data before Firebase wiring**

Use a local `temporaryContacts: Contact[]` with three clearly marked classroom records only for this task. The screen must use `FlatList`, a loading branch with `ActivityIndicator`, an empty branch with `ListEmptyComponent`, a pressable row that calls `navigation.navigate('Detalle', { contactId: item.id })`, and a visible button that calls `navigation.navigate('Nuevo')`. Do not use `ScrollView` as the list.

- [ ] **Step 4: Build the detail contract**

Read `route.params.contactId`, locate that ID in the same temporary dataset, display a not-found state when needed, render labels `Nombre`, `Teléfono`, `Ciudad`, and update `navigation.setOptions({ title: contact.nombre })` after lookup.

- [ ] **Step 5: Build the new-contact form contract**

Use three controlled `TextInput` values. On save, trim all values; if one is empty call:

```ts
Alert.alert('Campos incompletos', 'Completa nombre, teléfono y ciudad.');
```

For this navigation-only task, validate the three controlled inputs, show the required incomplete-fields alert, and call `navigation.goBack()` after a valid local submit. Task 3 replaces this handler with the real Firestore write and saving state.

- [ ] **Step 6: Verify the navigation layer structurally**

```powershell
npx tsc --noEmit
rg "NavigationContainer|FlatList|contactId|setOptions|goBack" App.tsx src
```

Expected: TypeScript exits 0 and each mandatory construct is present in the intended file.

Manual evidence for this phase, when a device/emulator is available: open Lista with the three temporary records; navigate Lista -> Detalle and confirm the name title; go back using Android system back or iOS swipe; open Nuevo, reject an empty form, submit complete local values and return to Lista. Until observed, this is `PENDIENTE DE VERIFICACIÓN MANUAL`.

- [ ] **Step 7: Commit the verified navigation structure**

```powershell
git add App.tsx src
git diff --cached --check
git commit -m "feat: add contact navigation"
```

### Task 3: Firebase initialization, read, detail and create

**Files:**
- Create: `src/firebaseConfig.ts`
- Modify: `src/screens/ContactListScreen.tsx`
- Modify: `src/screens/ContactDetailScreen.tsx`
- Modify: `src/screens/NewContactScreen.tsx`

**Interfaces:**
- Produces: named export `db`.
- Consumes: collection `contactos` and fields `nombre`, `telefono`, `ciudad`.

- [ ] **Step 1: Centralize modular Firebase initialization**

Create `src/firebaseConfig.ts` with static Expo environment reads:

```ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

- [ ] **Step 2: Implement list loading on focus**

Delete the temporary dataset. Inside `useFocusEffect(useCallback(...))`, call `getDocs(collection(db, 'contactos'))`, map `document.id` plus `document.data()` into `Contact[]`, protect state writes after cleanup with an `isActive` flag, show an `Alert` or screen error on failure, and always end the active loading state. This satisfies refresh-on-return without implementing the optional real-time subscription.

Run `rg -n "temporaryContacts|datos quemados" App.tsx src` after the replacement. Expected: no application-code match remains.

- [ ] **Step 3: Implement document detail by ID**

Call `getDoc(doc(db, 'contactos', contactId))`; when it exists, build the `Contact`, render its three fields, and set the header title to `nombre`. When absent, show `No se encontró el contacto.`; on failure show `No fue posible cargar el contacto.`.

- [ ] **Step 4: Implement validated Firestore creation**

After the empty-field guard, call:

```ts
await addDoc(collection(db, 'contactos'), {
  nombre: name.trim(),
  telefono: phone.trim(),
  ciudad: city.trim(),
});
navigation.goBack();
```

On failure, keep the form on screen and show `No fue posible guardar el contacto.`.

- [ ] **Step 5: Run non-device verification with temporary non-secret values**

```powershell
$env:EXPO_PUBLIC_FIREBASE_API_KEY='test-api-key'
$env:EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN='test.firebaseapp.com'
$env:EXPO_PUBLIC_FIREBASE_PROJECT_ID='test-project'
$env:EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET='test.firebasestorage.app'
$env:EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='123456789'
$env:EXPO_PUBLIC_FIREBASE_APP_ID='1:123456789:web:test'
npx tsc --noEmit
npx expo export --platform android --output-dir dist
```

Expected: typecheck and Android JavaScript bundle exit 0. This proves compilation/bundling only, not a real Firebase connection.

- [ ] **Step 6: Audit secrets and commit**

```powershell
git status --short
$secretMatches = git grep -n -E "AIza[0-9A-Za-z_-]{20,}|private_key|serviceAccount" -- . ':!package-lock.json'; if ($LASTEXITCODE -eq 1) { Write-Output 'No secret patterns found'; $global:LASTEXITCODE = 0 } else { $secretMatches }
git check-ignore -v .env node_modules dist
git add src package.json package-lock.json .gitignore .env.example
git diff --cached --check
git commit -m "feat: connect contacts to Firestore"
```

Expected: secret search has no match; local configuration and generated directories remain ignored.

### Task 4: Academic answers and delivery documentation

**Files:**
- Create: `RESPUESTAS.md`
- Create: `README.md`
- Create: `capturas/.gitkeep`

**Interfaces:**
- Produces: all required repository deliverables except the four real images, public URL and Virtual TdeA submission.

- [ ] **Step 1: Write `RESPUESTAS.md` in the PDF's exact structure**

Use headings `Pregunta 1` through `Pregunta 4`, include literals a-d, a-c, a-e, a-e respectively, and preserve tables for 1a, 2a, 3a and 4b. Every prose literal must answer all clauses in no more than 8 Markdown source lines. Do not include optional challenge 4 because optional work is excluded.

- [ ] **Step 2: Write the concise README**

Include exact author `Juan Andres Taborda Rodriguez`, operating system `Windows`, prerequisites, `npm install`, copy `.env.example` to `.env`, where to get the six Firebase web configuration values, requirement for collection `contactos` and three initial documents, `npx expo start`, and the manual capture checklist. For this unauthenticated classroom exercise, instruct choosing Firestore test mode only with fictional data, note that its open rules expire and expose data, and require tightening the rules after evaluation. State that `EXPO_PUBLIC_` values are visible in the client bundle and that Firestore rules protect data.

- [ ] **Step 3: Preserve the capture directory without fake evidence**

Create `capturas/.gitkeep`. Document these eventual filenames:

```text
01-lista.png
02-detalle.png
03-nuevo.png
04-firestore-contacto.png
```

- [ ] **Step 4: Verify required structure and line limits**

Format every non-table literal as one source line below its literal heading. Keep each table at eight or fewer Markdown source lines including its header and separator. Verify headings and required rows with:

```powershell
rg -n "^## Pregunta [1-4]$|^### [a-e]\)" RESPUESTAS.md
rg -n "Node.js y npm|Metro bundler|JDK y Android SDK|Xcode|Expo Go|<div>|<p> o <span>|<img>|<input>|Lista larga con scroll|Stack|Tabs|Drawer|apiKey|projectId|appId|storageBucket" RESPUESTAS.md
rg "Juan Andres Taborda Rodriguez|Windows|npm install|expo start|contactos" README.md
Get-ChildItem -Force capturas
```

Expected: all requested names are present and no literal exceeds 8 source lines.

- [ ] **Step 5: Commit documentation**

```powershell
git add RESPUESTAS.md README.md capturas/.gitkeep
git diff --cached --check
git commit -m "docs: add workshop answers"
```

### Task 5: Independent review, correction and final audit

**Files:**
- Review: all tracked project files and the original PDF
- Modify: only files required to resolve accepted mandatory findings

**Interfaces:**
- Produces: evidence matrix with `VERIFICADO`, `PENDIENTE DE VERIFICACIÓN MANUAL`, `NO CUMPLE`, or `NO APLICA`.

- [ ] **Step 1: Run fresh automated checks**

```powershell
npm install
npx tsc --noEmit
npx expo export --platform android --output-dir dist
git diff --check
git status --short --branch
git ls-files
git check-ignore -v .env node_modules dist
```

Expected: commands and exit codes are captured literally; no device/Firebase claim is inferred from them.

- [ ] **Step 2: Request an independent technical review**

Give the reviewer the PDF path, plan path, repository diff/commits and current verification output. Findings must be classified as `OBLIGATORIO`, `MEJORA` or `SOBREINGENIERÍA`; fix all accepted mandatory findings and re-run their covering checks.

- [ ] **Step 3: Run CodeRabbit when technically possible**

```powershell
coderabbit --version
coderabbit auth status --agent
coderabbit review --agent -t committed
```

If CLI/authentication is unavailable, record the exact blocker; do not mislabel a manual review as CodeRabbit.

- [ ] **Step 4: Perform independent academic, style and security audits**

Academic audit: compare every literal and table to PDF, including the 8-line cap. Style audit: remove formulaic/corporate wording without changing technical content. Security audit: inspect tracked files, ignore rules and staged diff for real Firebase values. Re-run typecheck/export after any code correction.

- [ ] **Step 5: Re-read all four PDF pages and build the final matrices**

Create one row per mandatory requirement with evidence, allowed state and action. Then group evidence under the exact rubric weights 40%, 10%, 20%, 20%, 10%. Mark device/emulator behavior, actual Firestore reads/writes, screenshots, public GitHub URL, incognito access and Virtual TdeA submission as `PENDIENTE DE VERIFICACIÓN MANUAL` until the user supplies evidence.

- [ ] **Step 6: Give the user the manual verification script**

Ask the user to fill `.env`, create Firestore in temporary test mode using only fictional data and add three documents. Then run `npx expo start`, open the app in Expo Go or an emulator, confirm the terminal has no red errors, edit visible text and observe Fast Refresh in under two seconds, and confirm there is no red error screen. Verify Lista -> Detalle -> Lista and Lista -> Nuevo -> Lista, all Spanish titles, dynamic contact-name title, Android system back and (if an iOS device is available) iOS swipe; mark iOS as manual/unverified from Windows otherwise. Confirm real Firestore list loading, empty-field rejection, real create, refresh on return, and the new document in Firebase Console. Take the four named screenshots. Publishing, incognito URL verification and Virtual TdeA submission remain separate manual actions and are not authorized.

## Arbitration Rulings

- **DECISIÓN:** scaffold in a verified child directory and copy to the root. **EVIDENCIA:** the root already contains `docs/` and `tmp/`; `create-expo-app` refuses to overwrite `tmp`. **MOTIVO:** preserve diagnostic work and still make the workspace root the repository. **IMPACTO:** one temporary generated directory is safely removed after copying.
- **DECISIÓN:** use three temporary in-memory contacts only in Task 2, then remove them in Task 3. **EVIDENCIA:** PDF Paso 2 requires traversing screens with hardcoded data before Firebase; Paso 5 forbids hardcoded final data. **MOTIVO:** both requirements are sequential, not contradictory. **IMPACTO:** a small intentional replacement occurs during Firebase wiring.
- **DECISIÓN:** use Firestore test mode only for fictional workshop data and document its risk/expiry. **EVIDENCIA:** the mandatory app has no authentication but must write; production-mode deny rules would block it. **MOTIVO:** allow the required read/write demonstration without pretending test mode is secure. **IMPACTO:** the user must tighten rules after evaluation; authenticated writing is outside the mandatory scope.
- **DECISIÓN:** keep CodeRabbit in the final process. **EVIDENCIA:** the user's mission explicitly requests at least one CodeRabbit review when technically possible. **MOTIVO:** direct user instruction outranks a reviewer's YAGNI suggestion. **IMPACTO:** it may require CLI authentication and time, but it adds no runtime complexity to the app.
