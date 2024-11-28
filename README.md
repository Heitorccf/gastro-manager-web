# Sistema de Gerenciamento de Restaurante

Este é um sistema completo para gerenciamento de restaurante, desenvolvido como parte do projeto acadêmico da disciplina de Desenvolvimento Web III do IFSP Campus Votuporanga. O sistema utiliza uma arquitetura Cliente-Servidor moderna, com separação clara entre frontend e backend.

## Visão Geral

O sistema permite o gerenciamento completo das operações básicas de um restaurante, incluindo o cadastro e gerenciamento de categorias de pratos, pratos e ingredientes. A arquitetura foi desenvolvida seguindo os padrões modernos de desenvolvimento web, utilizando APIs RESTful e autenticação JWT.

## Tecnologias Utilizadas

### Backend

- PHP 8.3
- Laravel 11
- JWT Authentication
- MySQL 8.0
- Docker

### Frontend

- React 18
- Material-UI
- Axios
- React Router DOM

## Pré-requisitos

Para executar o sistema, você precisará ter instalado:

- PHP 8.3 ou superior
- Composer
- Node.js 18 ou superior
- Docker e Docker Compose
- MySQL 8.0

## Instalação

Siga estas etapas para configurar o ambiente de desenvolvimento:

### 1. Clone o Repositório

```bash
git clone https://github.com/Heitorccf/gastro-manager-web.git
cd gastro-manager-web
```

### 2. Configuração do Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

### 4. Configuração do Banco de Dados

```bash
# Na raiz do projeto
docker compose up -d
```

### 5. Migrações do Banco de Dados

```bash
cd backend
php artisan migrate
```

## Configuração do Ambiente

### Backend (.env)

Configure o arquivo .env do backend com as seguintes informações:

```env
APP_NAME=RestauranteSystem
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3308
DB_DATABASE=restaurante_db
DB_USERNAME=restaurante_user
DB_PASSWORD=restaurante123
```

## Executando o Sistema

Para iniciar o sistema, execute os seguintes comandos em terminais separados:

### Backend

```bash
cd backend
php artisan serve
```

### Frontend

```bash
cd frontend
npm start
```

O sistema estará disponível em:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Funcionalidades Principais

O sistema oferece as seguintes funcionalidades:

- Autenticação segura com JWT
- Gerenciamento de categorias de pratos
- Gerenciamento de pratos
- Gerenciamento de ingredientes
- Relacionamentos entre entidades:
  - Categoria -> Pratos (1:N)
  - Pratos <-> Ingredientes (M:N)
- Soft delete em todas as entidades
- Interface responsiva e amigável

## Estrutura do Banco de Dados

O sistema utiliza quatro tabelas principais:

1. Categorias
2. Pratos
3. Ingredientes
4. Prato_Ingrediente (tabela pivô)

Todas as tabelas incluem os campos básicos:

- ID
- Removido (para soft delete)
- Campos específicos de texto
- Campos de data
- Campos decimais quando aplicável

## Segurança

O sistema implementa várias camadas de segurança:

- Autenticação JWT
- Proteção contra CORS
- Validação de dados
- Sanitização de inputs
- Sistema de soft delete

## Suporte

Para suporte ou dúvidas, abra uma issue no repositório do projeto.

## Contribuição

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Desenvolvimento Web III do IFSP Campus Votuporanga. Contribuições são bem-vindas seguindo as diretrizes do projeto.
