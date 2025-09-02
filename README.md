# FinancasApp 💰

Um aplicativo de finanças pessoais para Android, desenvolvido com **React Native** e **Expo**, que permite controlar suas receitas e despesas de forma prática e visual.

---

## Funcionalidades

* Registrar entradas e saídas financeiras
* Visualizar resumo de saldo, entradas e saídas
* Modal animado para adicionar lançamentos
* Dashboard com destaque para últimos lançamentos
* Relatórios com gráficos por categoria
* Modo claro e escuro
* Estrutura de navegação por abas:

  * Início (Dashboard)
  * Transações
  * Relatórios
  * Configurações

---

## Tecnologias utilizadas

* [React Native](https://reactnative.dev/)
* [Expo](https://expo.dev/)
* [React Navigation / Expo Router](https://reactnavigation.org/)
* [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
* TypeScript

---

## Como rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/jalexandrelp/FinancasApp.git
cd FinancasApp
```

2. Instale as dependências:

```bash
npm install
```

ou

```bash
yarn install
```

3. Rode o aplicativo:

```bash
npx expo start
```

---

## Estrutura do projeto

```
FinancasApp/
├─ assets/                 # Imagens, fontes e outros recursos
├─ app/
│  ├─ (tabs)/              # Páginas com navegação por abas
│  │  ├─ dashboard.tsx
│  │  ├─ transactions.tsx
│  │  ├─ reports.tsx
│  │  └─ settings.tsx
│  ├─ _layout.tsx          # Layout principal com Provider e navegação
│  └─ transactionsContext.tsx
├─ themeContext.tsx        # Controle de tema claro/escuro
├─ package.json
└─ README.md
```

---

## Observações

* Todos os lançamentos são armazenados em memória usando o Context API (mais tarde pode ser integrado a Google Sheets ou outro banco).
* Modo claro/escuro configurável.
* Layout responsivo e compatível com Android.
* As cores, animações e estilos estão pensados para uma experiência visual agradável e intuitiva.

---

## Próximos passos

* Integração com Google Sheets para persistência de dados.
* Validações adicionais nos formulários de lançamento.
* Melhorias nos gráficos, animações e relatórios.
* Implementação de filtros e histórico completo de transações.
* Adicionar notificações e lembretes
* Otimizar UI/UX para diferentes tamanhos de tela




