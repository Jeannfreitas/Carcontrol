# Portaria Web

Controle de entrada e saída de veículos. React + Vite (PWA) no front; API em Node (funções serverless da Vercel) e PostgreSQL no Neon. Tudo no plano grátis.

```
api/            funções serverless  →  /api/movements...
db/schema.sql   esquema do banco (idempotente)
scripts/        migrate.js (aplica o schema no deploy)
src/            frontend React
```

## Rotas da API
| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/movements?plate=` | histórico (mais recentes primeiro), com busca por placa |
| POST | `/api/movements` | registra entrada (409 se a placa já estiver dentro) |
| GET | `/api/movements/present` | veículos que estão dentro |
| PATCH | `/api/movements/:id/exit` | registra saída (o registro nunca é apagado) |
| GET | `/api/movements/stats/daily` | dentro agora, entradas e saídas de hoje (fuso São Paulo) |

## Variáveis de ambiente
- `DATABASE_URL` — connection string do Neon (a integração da Vercel já cria sozinha).
- `APP_TIMEZONE` — opcional, padrão `America/Sao_Paulo`.

## Rodar localmente
```
npm install
npm i -g vercel
vercel link && vercel env pull .env.local   # traz DATABASE_URL
npm run migrate
vercel dev                                  # front + API em http://localhost:3000
```
