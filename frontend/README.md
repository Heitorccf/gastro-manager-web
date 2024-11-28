# Sistema de Gerenciamento de Restaurante - Frontend

Aplicação web moderna desenvolvida com React e Material-UI para gerenciamento de operações de restaurante. Esta aplicação frontend integra-se com uma API Laravel para fornecer uma solução completa de gestão de restaurante.

## Visão Geral do Projeto

Esta aplicação frontend atua como interface do usuário para um sistema abrangente de gerenciamento de restaurante. Fornece interfaces intuitivas para gerenciar categorias, pratos e ingredientes, implementando autenticação segura e práticas modernas de gerenciamento de estado.

## Tecnologias Utilizadas

- React 18.3.1
- Material-UI 6.1.8
- Autenticação JWT
- Axios para integração com API
- React Router DOM para navegação
- Context API para gerenciamento de estado

## Pré-requisitos

Antes de executar a aplicação, certifique-se de ter:
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes npm ou yarn
- API Backend em execução (Laravel)
- Navegador web moderno (Chrome, Firefox, Safari ou Edge)

## Instruções de Instalação

1. Clone o repositório e navegue até o diretório frontend:
```bash
cd restaurant-system/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie o arquivo de ambiente:
```bash
cp .env.example .env
```

4. Configure as variáveis de ambiente no arquivo `.env`
   
## Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

```
src/
├── components/           # Componentes UI reutilizáveis
│   ├── Categorias/      # Componentes de gerenciamento de categorias
│   ├── Pratos/          # Componentes de gerenciamento de pratos
│   └── Ingredientes/    # Componentes de gerenciamento de ingredientes
├── contexts/            # Provedores de contexto React
│   ├── AuthContext      # Contexto de autenticação
│   └── NotificationContext  # Sistema de notificação global
├── pages/               # Páginas principais da aplicação
├── services/            # Serviços de integração com API
└── utils/              # Funções utilitárias e constantes
```

## Funcionalidades

A aplicação frontend oferece interfaces para:

- Autenticação de usuários (login e registro)
- Gerenciamento de categorias
- Gerenciamento de pratos com associações de categorias
- Gerenciamento de ingredientes
- Gerenciamento de relacionamento prato-ingrediente
- Validação de formulários em tempo real
- Design responsivo para todos os tamanhos de tela
- Notificações toast para feedback do usuário

## Autenticação

A aplicação utiliza tokens JWT para autenticação. Os tokens são:
- Armazenados no localStorage
- Incluídos automaticamente nas requisições à API
- Atualizados quando expirados
- Removidos no logout

## Gerenciamento de Estado

O estado da aplicação é gerenciado usando:
- React Context API para estado global
- Estado local do componente para dados específicos da UI
- Hooks personalizados para lógica reutilizável

## Tratamento de Erros

A aplicação implementa tratamento abrangente de erros:
- Erros de validação de formulário
- Respostas de erro da API
- Problemas de conectividade de rede
- Falhas de autenticação

## Estilização

A estilização é implementada usando:
- Componentes Material-UI
- Configuração de tema personalizado
- Princípios de design responsivo
- Padrões consistentes de estilização

## Scripts Disponíveis

```bash
npm start      # Iniciar servidor de desenvolvimento
npm build      # Criar build de produção
npm test       # Executar testes unitários
npm run lint   # Executar ESLint
npm run format # Formatar código com Prettier
```

## Como Contribuir

1. Faça um fork do repositório
2. Crie sua branch de feature
3. Siga as diretrizes de estilo de código
4. Escreva mensagens de commit significativas
5. Envie um pull request

## Testes

A aplicação inclui:
- Testes unitários para componentes
- Testes de integração para serviços de API
- Testes end-to-end para fluxos críticos

Execute os testes com:
```bash
npm test
```

## Processo de Build

Crie uma build de produção:
```bash
npm run build
```

Isso gera arquivos otimizados no diretório `build`.

## Considerações de Desempenho

A aplicação implementa várias otimizações de desempenho:
- Divisão de código
- Carregamento preguiçoso de componentes
- Memoização de cálculos custosos
- Estratégias eficientes de re-renderização

## Suporte a Navegadores

Suporta navegadores modernos incluindo:
- Chrome (2 últimas versões)
- Firefox (2 últimas versões)
- Safari (2 últimas versões)
- Edge (2 últimas versões)

## Suporte

Para suporte, por favor:
1. Verifique as issues existentes no repositório
2. Crie uma nova issue se necessário
3. Forneça passos detalhados de reprodução
