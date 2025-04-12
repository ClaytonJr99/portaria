#!/bin/sh

# Configura a URL do banco de dados com base nas variáveis de ambiente
export DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo "Configurando DATABASE_URL: $DATABASE_URL"

# Espera o MySQL iniciar
echo "Aguardando o MySQL..."
echo "Tentando conectar a $DB_HOST:$DB_PORT como usuário $DB_USER..."

# Aguarda o serviço MySQL inicializar completamente
sleep 10

# Tenta várias vezes até conseguir conectar
for i in {1..30}; do
  if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" &>/dev/null; then
    echo "MySQL está pronto. Configurando Prisma..."
    
    # Tenta conceder permissões (se estiver usando root)
    if [ "$DB_USER" = "root" ]; then
      echo "Concedendo permissões para o usuário $DB_USER no banco $DB_NAME..."
      mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'%'; FLUSH PRIVILEGES;"
    fi
    
    # Gera o Prisma Client
    echo "Gerando Prisma Client..."
    npx prisma generate
    
    # Executar migrações com a flag --create-only para evitar usar shadow database
    echo "Executando migrações do Prisma..."
    SHADOW_DATABASE_DISABLED=true npx prisma migrate deploy
    
    # Gerar arquivo PDF de exemplo
    echo "Gerando arquivo PDF de exemplo..."
    npx ts-node scripts/gerar-pdf-exemplo.ts
    
    echo "Iniciando a aplicação NestJS..."
    npm run start:dev
    exit 0
  fi
  echo "MySQL ainda não está disponível - tentativa $i/30 - esperando..."
  sleep 3
done

echo "Não foi possível conectar ao MySQL após várias tentativas. Verifique a conexão."
exit 1
