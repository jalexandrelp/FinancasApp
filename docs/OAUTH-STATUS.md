
# OAuth / AuthSession – Status (checkpoint)

## Ambiente
- Expo user: **@jalexandrelp**
- Redirect (AuthSession useProxy): `https://auth.expo.dev/@jalexandrelp/FinancasApp`
- Web client ID em uso: `489897024761-if0r680d7ivf09rgqa46s1s5mld7q2ur.apps.googleusercontent.com` (novo)
- Android client ID: `489897024761-uo0unvh2c63t7e9320kpht73egcskr22.apps.googleusercontent.com`

## Google Cloud – Credenciais (WEB cliente novo)
**Authorized redirect URIs**
- `https://auth.expo.dev/@jalexandrelp/FinancasApp`
- `http://localhost:8081`

**Authorized JavaScript origins**
- `https://auth.expo.dev`
- `http://localhost:8081`
- `http://127.0.0.1:8081`

**Tela de consentimento (Testing)**
- Test user: `jalexandrelp@gmail.com`
- Domínios autorizados: `expo.dev` (e `expo.io` permanece por legado, ok)

## O que já está no código
- `polyfills.ts` na raiz com:
  - `react-native-url-polyfill/auto`
  - `firebase/auth`
- `app/_layout.tsx` importa `../polyfills`
- `src/firebase/config.ts` usa `initializeAuth(...AsyncStorage)` no Android/iOS
- `AuthSession.makeRedirectUri({ useProxy: true })` e `useAuthRequest` configurado

## Comportamento atual
- **Web**: botão “Entrar com Google” abre o fluxo, usuário autoriza, **volta para a tela de login** (não navega para as tabs).
- **Android**: erros de OAuth já vistos durante o processo
- `Erro 400: invalid_request` (antigo, antes de ajustar redirect)
- `Erro 400: redirect_uri_mismatch` (quando o Web client usava redirect diferente)

## Código/Infra adicionados hoje
- `polyfills.ts` na raiz com:
  - `react-native-url-polyfill/auto`
  - `firebase/auth`
- `app/_layout.tsx` importa `../polyfills` **na primeira linha**, envolve a árvore com `AuthProvider`, `SafeAreaProvider`, `GestureHandlerRootView`.
- `src/firebase/config.ts` usa `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` no Android/iOS; fallback para `getAuth(app)` se já inicializado.
- `src/contexts/authContext.tsx` configurado com `useProxy: true` + `redirectUri` vindo de `AuthSession.makeRedirectUri({ useProxy: true })`.
- `.env` **não** commitado; `.env.example` criado/atualizado.

## Hipóteses em aberto
- Android: algum import indireto de `auth` antes do `initializeAuth` (arquivos fora de `src/firebase/config.ts`) pode disparar o erro de “auth não registrado”. Revisar imports.
- Web: `onAuthStateChanged` pode estar disparando, mas o redirecionamento em `app/index.tsx` não está ocorrendo (rever condicional `loading`/`user` e `router.replace`).


## Próximos passos sugeridos
1. Garantir que **nenhum arquivo** importe `firebase/auth` ou chame `getAuth()` fora de `src/firebase/config.ts`.
2. No Android, confirmar Expo Go **logado em @jalexandrelp** (o redirect precisa apontar para `@jalexandrelp/FinancasApp`).
3. Logar `user`, `loading` e `redirectUri` em `authContext.tsx` e `app/index.tsx` para confirmar fluxo após o callback.

4. (Web) Redirecionar após login:
   - No `app/auth/login.tsx`, observar `user` do `useAuth()` e `router.replace('/tabs/dashboard')` quando `user` ficar truthy.
5. Confirmar no Metro os valores logados por `[GoogleAuth] ids` (clientId/redirect) para garantir que o app está usando o **novo** Web client.
6. Revalidar Credenciais Web no Console (…q2ur) se surgir `redirect_uri_mismatch`.
6. Firestore:
   - Garantir regras publicadas (versão atual com `users/{uid}` e coleções por `userId`).
   - Criar doc `users/{uid}` no primeiro login (já implementado).
8. Expo Go:
   - Garantir login como **@jalexandrelp**, e limpar cache se necessário.

_Última atualização: <06/09/2025 - 04:00:00>_
