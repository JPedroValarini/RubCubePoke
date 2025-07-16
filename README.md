# 📱 PokéRubC - App de Pokémons com React Native

Este é um app mobile desenvolvido em **React Native**, que consome a **PokéAPI** para exibir uma lista completa de Pokémons. O projeto inclui funcionalidades como:

- 📋 Listagem dos 898 Pokémons
- 🔍 Busca por nome
- ⭐ Favoritar Pokémons com persistência local
- ⚔️ Exibição de detalhes com habilidades, tipo, altura, peso
- 🔄 Evolução de Pokémons (via Redux)
- 🖼️ Imagens e organização visual inspiradas no universo Pokémon

---

## 🧪 Teste técnico escolhido

Escolhi o desafio de **criar um app utilizando a PokéAPI** por se alinhar com meu perfil técnico e por me permitir mostrar domínio em tecnologias como **React Native**, **Redux**, **Apollo Client** e gerenciamento de estados e efeitos colaterais no mobile.

---

## 🔧 Como rodar o projeto localmente

> Pré-requisitos:
> - Node.js instalado
> - Yarn ou NPM
> - Ambiente React Native configurado (Android Studio ou Xcode + emulador ou dispositivo físico)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/pokerubc.git
cd pokerubc
Instale as dependências:

bash
Copiar
Editar
yarn install
# ou
npm install
Execute o app:

bash
Copiar
Editar
npx react-native run-android

📸 Prints e evidências do produto final
### ✅ Lista de Pokémons
<img src="https://iili.io/FXjpZIR.png" width="300" />

### 🔍 Detalhes com habilidades
<img src="https://iili.io/FXjptXp.png" width="300" />

### ⭐ Favoritos persistidos
<img src="https://iili.io/FXjpskJ.png" width="300" />

### 🔄 Evolução de Pokémons
<img src="https://iili.io/FXjpLmv.png" width="300" />

### 🎨 Outras telas
<img src="https://iili.io/FXjyH2n.png" width="300" />
<img src="https://iili.io/FXjyJ7s.png" width="300" />
<img src="https://iili.io/FXjydkG.png" width="300" />


✅ Lista de Pokémons

🔍 Detalhes com habilidades

⭐ Favoritos persistidos

🔄 Evolução de Pokémons

⚙️ Tecnologias utilizadas
React Native

TypeScript

Apollo Client (GraphQL)

Redux + Redux Toolkit

AsyncStorage (para persistência dos favoritos)

PokéAPI GraphQL wrapper

🧠 Desafios e observações
Durante o desenvolvimento, alguns pontos exigiram mais atenção:

Evolução de Pokémons: Lidar com a lógica de evolução de forma eficiente exigiu uma modelagem cuidadosa dos dados, especialmente para manter uma estrutura consistente mesmo após evoluir um Pokémon.

Persistência de favoritos: Foi necessário garantir que favoritos fossem persistidos corretamente sem duplicidade, mesmo em estados evolutivos distintos.

Performance: Evitei requisições desnecessárias usando useMemo, cache do Apollo e Redux para estados globais.

💬 Considerações finais
Esse desafio foi uma experiência incrível para explorar a PokéAPI em profundidade e aplicar boas práticas de desenvolvimento mobile. Aproveitei a oportunidade para testar integração entre GraphQL, Redux e persistência local, focando em uma experiência fluida e funcional.
