# Mass CSV Upload Application

Este projeto demonstra um sistema completo de importação de CSV em grande escala, com:
- **Backend** (NestJS + BullMQ + Prisma)
- **Frontend** (Next.js + Tailwind + shadcn/ui)
- **Postgres** como banco
- **Redis** para filas e eventos

## 📂 Estrutura de Pastas

```
.
├─ backend
│  ├─ dockerfile
│  ├─ .env.example
│  ├─ ...
├─ frontend
│  ├─ dockerfile
│  ├─ .env.example
│  ├─ ...
├─ docker-compose.yml
├─ README.md
└─ ...
```

## 🚀 Como funciona

1. **Backend** expõe `POST /users/upload` para receber o CSV.
2. Ele processa o arquivo em **chunks** via BullMQ (Redis).
3. Cada chunk valida e insere dados no Postgres via Prisma.
4. Emite eventos de **progresso** e **finalização** via **Socket.IO**.
5. **Frontend** (Next.js) possui página de Upload e página de Progresso.
6. **Redis** gerencia status, eventos de `'progress'`, `'completed'`.
7. É possível acessar o **Swagger** em [`http://localhost:3000/docs`](http://localhost:3000/docs) para ver/experimentar as rotas do backend.

## 🏗 Como Rodar

1. Renomeie `.env.example` para `.env` nos locais indicados (backend, frontend).
2. Ajuste variáveis, se necessário, como `DATABASE_URL`, `NEXT_PUBLIC_API_URL`.
3. Coloque o arquivo CSV de exemplo (ex.: `users-10k-sample.csv`) na raiz do projeto – contém 10 mil usuários.
   - Antes de processar esse CSV, cadastre **um Whitelabel** via Swagger (`POST /whitelabels`).
   - Copie o `whitelabel_id` retornado e use-o na coluna `whitelabelId` do CSV.
4. Execute:
   ```bash
   docker-compose build
   docker-compose up
   ```
5. Acesse:
   - **Backend**: [`http://localhost:3000`](http://localhost:3000)
   - **Swagger**: [`http://localhost:3000/docs`](http://localhost:3000/docs)  (cadastrar whitelabel antes de inserir o arquivo.)
   - **Frontend**: [`http://localhost:3001`](http://localhost:3001)

## 📦 Variáveis de Ambiente

### Backend
- `DATABASE_URL` = Conexão Postgres
- `REDIS_HOSTNAME` = redis
- `REDIS_PORT` = 6379
- Outras específicas do Prisma e Nest

### Frontend
- `NEXT_PUBLIC_API_URL` = URL para o backend (ex: `http://localhost:3000` ou `http://backend:3000` dentro do docker-compose)

## 💻 Fluxo de Uso

1. Acesse [`http://localhost:3001`](http://localhost:3001) (frontend).
2. Selecione seu arquivo CSV e clique em **Enviar CSV**.
3. O backend retorna `flowId` e o frontend redireciona para `http://localhost:3001/[flowId]`.
4. A página de progresso conecta via **Socket.IO** (namespace `/socket.io`), mostrando % de progresso e resultados finais (sucessos/falhas).

## 🛠 Arquitetura de Filas

- Usamos **BullMQ** (flow) com jobs pai e chunk.
- Cada chunk insere em lote (`createMany`) no Postgres.
- Redis gerencia status, eventos de `'progress'`, `'completed'`.

## 🐞 Debug / Observações

- Se `skipDuplicates: true` estiver habilitado no backend, duplicatas são ignoradas silenciosamente.
- Se tiver problemas de "socket hang up" com `wscat`, lembre-se de usar `socket.io-client` para o protocolo Engine.IO.

## 🏗 Tecnologias

- **NestJS** (backend)
- **Prisma** (ORM)
- **BullMQ** (Filas) + **Redis**
- **Next.js** (frontend)
- **shadcn/ui** + **Tailwind** (UI)
- **Postgres** (banco)

## 📃 Licença
MIT

