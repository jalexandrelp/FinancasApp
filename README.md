# 🟢 FinancasApp v1.3-base — Release Notes

## 📌 Visão Geral

Esta release consolida as principais funcionalidades do FinancasApp, incluindo:

* Dashboard completo com **resumo financeiro**, saldo por conta e últimos lançamentos.
* Tela de **Transações** com filtros avançados (tipo, conta, categoria, período), animações e swipe para editar/excluir.
* Tela de **Configurações** (Settings) com gerenciamento de contas, cartões, categorias, perfis, tema Dark/Light, termos e versão do app.
* **Autenticação completa** com login e cadastro via email e Google, usando Context API para gerenciamento global de usuário.
* Integração inicial com **Firebase** (Auth e Firestore), preparada para futuras funcionalidades como sincronização com Google Sheets.
* Layout responsivo, animações suaves e design limpo em **React Native + Expo + TypeScript**.

---

## ✨ Novas Funcionalidades

### Dashboard

* Resumo financeiro: Entradas, Saídas e Saldo.
* Lista de contas com saldo atualizado automaticamente.
* Últimos lançamentos (máx. 5) com destaque para tipo de transação.
* Modal de transação (adicionar/editar) integrado com Context API.

### Transações

* **Filtros avançados**:

  * Tipo (Entrada / Saída / Tudo)
  * Conta
  * Categoria
  * Período (7d, 30d, Todos)
* Lista animada com efeito de escala e fade-in.
* Swipeable para **editar ou excluir** transações.
* Modal para adicionar/editar transações.
* Cores dinâmicas para entradas (verde) e saídas (vermelho).

### Configurações (Settings)

* Alterar tema Dark/Light.
* Gerenciar contas, cartões, categorias e perfis.
* Modais de **Termos e Privacidade** e **Versão do App**.
* Componentes reutilizáveis (SettingCard, AccountsModal, CardsModal, etc.).

### Autenticação

* Login e Cadastro via **Email/Senha**.
* Login via **Google Sign-In**.
* Persistência de usuário via Context API.
* Redirecionamento automático para Dashboard se usuário estiver autenticado.
* Feedback visual de carregamento e alertas de erro.

### Firebase

* Configuração inicial do Firebase (Auth e Firestore) pronta para:

  * Autenticação de usuários.
  * Armazenamento de dados de contas, transações e perfis.

---

## 🛠 Correções e Melhorias

* Saldo das contas agora é calculado corretamente de acordo com todas as transações.
* Dashboard, Transações e Settings ajustados para **tema dark/light** e cores dinâmicas.
* Listagens (FlatList) com keyExtractor correto para evitar warnings de React.
* Modais e telas otimizadas para **responsividade** e boa experiência em Android/iOS.
* Código modularizado em contextos, componentes e hooks para fácil manutenção.

---

## 🗂 Estrutura do Projeto (Resumo)

```
.env
.env.example
.vscode
  └─ settings.json

app
  ├─ _layout.tsx
  ├─ +not-found.tsx
  ├─ app.config.js
  ├─ app.json
  ├─ auth
  │   ├─ _layout.tsx
  │   └─ login.tsx
  ├─ index.tsx
  └─ tabs
      ├─ _layout.tsx
      ├─ dashboard.tsx
      ├─ reports.tsx
      ├─ settings.tsx
      └─ transactions.tsx

assets
  ├─ fonts
  │   └─ SpaceMono-Regular.ttf
  └─ images
      ├─ adaptive-icon.png
      ├─ favicon.png
      ├─ icon.png
      ├─ partial-react-logo.png
      ├─ react-logo.png
      ├─ react-logo@2x.png
      ├─ react-logo@3x.png
      └─ splash-icon.png

components
  ├─ AccountsList.tsx
  ├─ AccountsModal.tsx
  ├─ ActionRow.tsx
  ├─ CardsModal.tsx
  ├─ CategoriesModal.tsx
  ├─ Collapsible.tsx
  ├─ ExternalLink.tsx
  ├─ HapticTab.tsx
  ├─ HelloWave.tsx
  ├─ ParallaxScrollView.tsx
  ├─ ProfilesModal.tsx
  ├─ SettingCard.tsx
  ├─ ThemedText.tsx
  ├─ ThemedView.tsx
  ├─ TransactionModal.tsx
  └─ ui
      ├─ IconSymbol.ios.tsx
      ├─ IconSymbol.tsx
      ├─ TabBarBackground.ios.tsx
      └─ TabBarBackground.tsx

constants
  └─ Colors.ts

hooks
  ├─ useColorScheme.ts
  ├─ useColorScheme.web.ts
  └─ useThemeColor.ts

scripts
  └─ reset-project.js

src
  ├─ contexts
  │   ├─ accountsContext.tsx
  │   ├─ authContext.tsx
  │   ├─ financeContext.tsx
  │   ├─ settingsContext.tsx
  │   ├─ themeContext.tsx
  │   └─ transactionsContext.tsx
  ├─ firebase
  │   └─ config.ts
  ├─ services
  │   ├─ auth.ts
  │   └─ firestore.ts
  └─ types
      └─ models.ts

estrutura_projeto.txt
expo-env.d.ts
eslint.config.js
package.json
README.md
tsconfig.json

```

---

## 🚀 Próximos Passos / Funcionalidades Futuras

* Sincronização com **Google Sheets**.
* Dashboard com **gráficos financeiros interativos**.
* Melhorias na interface e animações.
* Relatórios detalhados por período, categoria e conta.

---

## ✅ Conclusão

Esta versão estabelece a **base sólida** do FinancasApp, pronta para futuras evoluções, integração com APIs externas e melhorias visuais.
O foco foi na **estabilidade, modularidade e usabilidade**, garantindo que todas as funcionalidades principais estejam operacionais.

OBS: erros ao abrir no android devem ser corrigidos.

