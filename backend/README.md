# Sistema de Gerenciamento de Restaurante - Backend

Este documento detalha a implementação do backend do Sistema de Gerenciamento de Restaurante, desenvolvido com Laravel 11 e MySQL. O sistema oferece uma API RESTful completa com autenticação JWT para gerenciamento de categorias, pratos e ingredientes.

## Visão Geral do Sistema

O backend é responsável pelo processamento de dados e regras de negócio do sistema, fornecendo endpoints seguros e bem estruturados para todas as operações necessárias no gerenciamento de um restaurante.

## Tecnologias Utilizadas

- PHP 8.3
- Laravel 11
- MySQL 8.0
- JWT Authentication
- Docker e Docker Compose

## Requisitos de Sistema

Para executar o backend, é necessário ter instalado:

- PHP >= 8.3
- Composer
- Docker e Docker Compose
- MySQL 8.0

## Instalação e Configuração

Para configurar o ambiente de desenvolvimento, siga estas etapas:

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd restaurante-system/backend
```

2. Instale as dependências:
```bash
composer install
```

3. Configure o ambiente:
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

4. Configure o banco de dados via Docker:
```bash
# Na raiz do projeto
docker compose up -d
```

5. Execute as migrações:
```bash
php artisan migrate
```

## Estrutura do Banco de Dados

O sistema utiliza quatro tabelas principais:

1. categorias
   - id (primary key)
   - nome (string)
   - descricao (text)
   - margem_lucro (decimal)
   - data_criacao (date)
   - removido (boolean)
   - timestamps

2. pratos
   - id (primary key)
   - categoria_id (foreign key)
   - nome (string)
   - descricao (text)
   - preco (decimal)
   - data_criacao (date)
   - removido (boolean)
   - timestamps

3. ingredientes
   - id (primary key)
   - nome (string)
   - descricao (text)
   - preco_unitario (decimal)
   - data_validade (date)
   - removido (boolean)
   - timestamps

4. prato_ingrediente
   - id (primary key)
   - prato_id (foreign key)
   - ingrediente_id (foreign key)
   - quantidade (decimal)
   - timestamps

## Endpoints da API

### Autenticação
- POST /api/login - Realiza login
- POST /api/register - Registra novo usuário
- POST /api/logout - Realiza logout
- POST /api/refresh - Atualiza token JWT

### Categorias
- GET /api/categorias - Lista todas as categorias
- GET /api/categorias/{id} - Retorna categoria específica
- POST /api/categorias - Cria nova categoria
- PUT /api/categorias/{id} - Atualiza categoria existente
- DELETE /api/categorias/{id} - Remove categoria (soft delete)

[Endpoints similares para Pratos e Ingredientes]

## Segurança

O sistema implementa várias camadas de segurança:

- Autenticação via JWT
- Middleware de proteção de rotas
- Validação de dados de entrada
- Sanitização de inputs
- CORS configurado adequadamente
- Soft delete para preservação de dados

## Configuração do Ambiente (.env)

```env
APP_NAME=RestauranteSystem
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3308
DB_DATABASE=restaurante_db
DB_USERNAME=restaurante_user
DB_PASSWORD=restaurante123

JWT_SECRET=[seu-jwt-secret]
```

## Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
php artisan serve

# Executar migrações
php artisan migrate

# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Listar rotas
php artisan route:list
```

## Testes

O sistema inclui testes automatizados:

```bash
# Executar todos os testes
php artisan test

# Executar testes específicos
php artisan test --filter=NomeDaClasse
```

## Manutenção e Logs

Os logs do sistema podem ser encontrados em:
```
/storage/logs/laravel.log
```

## Desenvolvimento

Para contribuir com o desenvolvimento:

1. Crie uma nova branch
2. Implemente suas alterações
3. Execute os testes
4. Envie um pull request

## Backup do Banco de Dados

Para realizar backup do banco de dados:

```bash
# Via Docker
docker exec [container-name] mysqldump -u [user] -p[password] [database] > backup.sql
```

## Suporte

Em caso de problemas:

1. Verifique os logs em storage/logs
2. Consulte a documentação do Laravel
3. Abra uma issue no repositório

## Documentação Adicional

Para mais informações sobre as tecnologias utilizadas:

- [Documentação do Laravel](https://laravel.com/docs)
- [Documentação do JWT](https://jwt-auth.readthedocs.io)
- [Documentação do Docker](https://docs.docker.com)
