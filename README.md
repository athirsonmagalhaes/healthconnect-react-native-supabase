# 🏥 HealthConnect

O **HealthConnect** é um protótipo de serviço desenvolvido com **React Native** e **Expo**, utilizando **Supabase** para banco de dados e Auth. O aplicativo visa centralizar a jornada do paciente, oferecendo desde o agendamento de consultas presenciais até teleorientação por inteligência artificial e videochamadas em tempo real.

## 🚀 Funcionalidades Principais

*   **🔐 Autenticação Segura:** Fluxo de login e cadastro integrado ao **Supabase**, coletando dados essenciais como data de nascimento e tipo sanguíneo para fins médicos.
*   **📅 Gestão de Consultas:** Sistema de agendamento (CRUD) que permite buscar médicos por localidade (Estado/Cidade) e especialidade, com suporte para reagendamento e cancelamento.
*   **👤 Perfil do Usuário:** Visualização centralizada de dados cadastrais e informações críticas de saúde.
*   **🤖 Vitalis (Assistente Virtual):** Um chatbot inteligente alimentado pela **API do Google Gemini**, configurado para oferecer orientações empáticas e personalizadas com base no perfil do usuário, como nome e tipo sanguíneo.
*   **📞 Teleconsulta:** Interface para demonstração de chamadas de vídeo com controles de áudio (mudo), vídeo (ligar/desligar câmera) e cronômetro de atendimento.
*   **👥 Dependentes:** Módulo para gerenciar informações de familiares, incluindo parentesco.
*   **📂 Repositório de Documentos:** Listagem organizada de receitas, exames e atestados médicos com suporte a visualização e download.

## 🛠️ Tecnologias Utilizadas

*   **Framework:** [React Native (v0.81.5)](https://reactnative.dev/) com [Expo (v54.0.33)](https://expo.dev/).
*   **Linguagem:** JavaScript / TypeScript.
*   **Banco de Dados & Auth:** [Supabase](https://supabase.com/).
*   **Inteligência Artificial:** [Google Generative AI (Gemini Flash)](https://ai.google.dev/).
*   **Navegação:** [React Navigation](https://reactnavigation.org/) (Stack e Bottom Tabs).

## 📂 Estrutura de Pastas

*   `src/screens/`: Telas da aplicação (Home, Consultas, ChatBot, Teleconsulta, etc.).
*   `src/navigation/`: Configuradores de fluxo de navegação (Auth e Main Tab).
*   `src/contexts/`: Gerenciamento de estado global (AuthContext).
*   `src/hooks/`: Lógica de negócio reutilizável, como o `useAppointments` para operações de CRUD.
*   `src/styles/`: Sistema de design e estilos globais (`sharedStyles.js`).

## ⚙️ Configuração e Instalação

### Pré-requisitos
*   Node.js instalado.
*   Conta no Supabase e no Google AI Studio (para a chave do Gemini).

### Passo a Passo
1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/healthconnect-react-native-supabase.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configuração de Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    SUPABASE_URL=sua_url_aqui
    SUPABASE_ANON_KEY=sua_chave_anonima_aqui
    ```
4.  **Inicie o projeto:**
    ```bash
    npx expo start
    ```

## ⚖️ Avisos Importantes
O assistente virtual **Vitalis** fornece orientações baseadas em IA para auxílio informativo. Como definido nas diretrizes do sistema, ele sempre reforça a necessidade de **consultar um médico para diagnósticos precisos**.