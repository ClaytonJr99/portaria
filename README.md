# Sistema de Importação de Boletos - Condomínio Green Park

Este projeto é uma API para importação de boletos do sistema financeiro para o sistema da portaria do condomínio Green Park.

## Funcionalidades

- Importação de boletos a partir de arquivos CSV
- Processamento de arquivos PDF com boletos
- Consulta de boletos com filtros

## Estrutura do Banco de Dados

O projeto utiliza duas tabelas principais:

- **Lotes**: Armazena os lotes do condomínio
- **Boletos**: Armazena os boletos importados

## Pré-requisitos

- Node.js
- Docker e Docker Compose

## Instalação

1. Clone o repositório


2. Instale as dependências:
```bash
yarn install
```

3. Configure o arquivo `.env` conforme o`.env.example`


4. Inicie o ambiente com Docker:
```bash
docker-compose up -d
```
ou
```bash
docker compose up -d
```

Todos os comandos do Prisma são executados automaticamente no contêiner Docker.

O servidor estará disponível em `http://localhost:3000`.

## Testando com Postman

Para testar as rotas da API, você pode usar a coleção do Postman disponível em:

[Coleção do Postman para teste da API](https://www.postman.com/claytonlopes/workspace/portaria/collection/8471619-f8da4746-b701-4b6f-af00-c0ec2420fddc?action=share&creator=8471619)

A coleção contém os seguintes endpoints:

1. **Importar CSV**
   - Método: POST
   - URL: http://localhost:3000/boletos/importar-csv
   - Body: form-data com campo 'file' contendo o arquivo CSV

2. **Importar PDF**
   - Método: POST
   - URL: http://localhost:3000/boletos/importar-pdf
   - Body: form-data com campo 'file' contendo o arquivo PDF

3. **Listar Boletos**
   - Método: GET
   - URL: http://localhost:3000/boletos
   - Parâmetros opcionais: nome, valor_inicial, valor_final, id_lote, relatorio

## Endpoints da API

### Importação de Boletos CSV
```
POST /boletos/importar-csv
Content-Type: multipart/form-data
```

### Importação de Boletos PDF
```
POST /boletos/importar-pdf
Content-Type: multipart/form-data
```

### Consulta de Boletos
```
GET /boletos
```

### Filtros disponíveis:
```
GET /boletos?nome=JOSE&valor_inicial=100&valor_final=200&id_lote=2
```

### Geração de Relatório
```
GET /boletos?relatorio=1
```

## Exemplos de Arquivos

No repositório, está incluido arquivos de exemplo para testes:

- `exemplo_boletos.csv`: Arquivo CSV com dados de boletos
- `uploads/boletos_exemplo.pdf`: Arquivo PDF com os boletos (gerado automaticamente durante a inicialização do container Docker)

Se precisar gerar manualmente o arquivo PDF, execute:
```bash
yarn generate:pdf
```