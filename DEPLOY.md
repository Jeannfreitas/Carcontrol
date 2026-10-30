# Deploy 100% grátis: tudo na Vercel + Neon

## 1. Subir para o GitHub
Crie um repositório e envie esta pasta inteira (o `package.json` precisa ficar na raiz do repositório).

## 2. Criar o projeto na Vercel
1. vercel.com → **Add New → Project** → escolha o repositório.
2. Framework Preset: **Vite** (detecta sozinho). Não precisa mudar build command nem pasta.
3. Antes de clicar em Deploy, não precisa configurar variáveis ainda — vá ao passo 3 e depois faça Redeploy,
   ou faça o Deploy agora (a 1ª vez só avisa que `DATABASE_URL` não existe e segue).

## 3. Criar o banco (Neon)
1. No projeto da Vercel: aba **Storage** → **Create Database** → **Neon (Postgres)** → plano Free.
2. Conecte o banco ao projeto (marque Production, Preview e Development).
   Isso cria a variável `DATABASE_URL` automaticamente.

## 4. Redeploy
Aba **Deployments** → ⋯ no último deploy → **Redeploy**.
Durante o build, `scripts/migrate.js` cria a tabela `movements` (se já existir, não mexe em nada).
Pronto: abra a URL do projeto.

## Se algo der errado
- Tela com "Não foi possível conectar ao servidor": abra `https://SEU-SITE.vercel.app/api/movements`.
  - Retorna `[]` ou uma lista → API ok, limpe o cache/PWA (recarregue com Ctrl+F5).
  - Erro 500 → veja **Logs** do projeto na Vercel; quase sempre é `DATABASE_URL` ausente.
- Se preferir criar a tabela manualmente: Neon → **SQL Editor** → cole `db/schema.sql` → Run.

## Observações
- Instalar como app no iPhone: Safari → Compartilhar → Adicionar à Tela de Início.
- O plano Hobby da Vercel é para uso não comercial; confira os termos atuais.
- O Neon grátis suspende o banco após alguns minutos ocioso e retoma no próximo acesso
  (a 1ª requisição pode levar ~1 s a mais). Os dados não são apagados.
