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
<img width="1080" height="2400" alt="Screenshot_20250716-190828" src="https://github.com/user-attachments/assets/16fc46b2-f377-4fc8-a05c-8dd44d461650" />
<img width="1080" height="2400" alt="Screenshot_20250716-190742" src="https://github.com/user-attachments/assets/cd79d834-84e3-4232-9eb8-92588f9f688c" />
<img width="1080" height="2400" alt="Screenshot_20250716-190710" src="https://github.com/user-attachments/assets/6a4a80e1-8fb5-413b-a0dc-c36cb1982232" />
<img width="1080" height="2400" alt="Screenshot_20250716-190655" src="https://github.com/user-attachments/assets/2dba4889-1b8b-4bc8-9346-7d873b6366db" />
<img width="1080" height="2400" alt="Screenshot_20250716-190912" src="https://github.com/user-attachments/assets/323b8147-fb12-45a8-9a0b-265ac6a92089" />
<img width="1080" height="2400" alt="Screenshot_20250716-190904" src="https://github.com/user-attachments/assets/2ff56b17-cb96-478b-9b8d-41967ce28b18" />
<img width="1080" height="2400" alt="Screenshot_20250716-190843" src="https://github.com/user-attachments/assets/8aa68fa5-2f08-4276-8108-db235382e81a" />
<img width="1080" height="2400" alt="Screenshot_20250716-190834" src="https://github.com/user-attachments/assets/bcc4be32-280e-4c66-8b57-10601533d7e0" />


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
