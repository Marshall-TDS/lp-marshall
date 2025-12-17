# 🚀 Guia de Deploy - Landing Page Marshall

Este guia fornece instruções passo a passo para configurar o deploy automático da Landing Page Marshall (React/Vite) no servidor VPS usando Docker e GitHub Actions.

## 🖥️ Informações do Servidor

- **Porta Padrão**: `5174`
- **Ambientes**: Homologação e Produção (ambos na porta 5174)

## 📋 Pré-requisitos

- Servidor VPS com acesso SSH
- Conta no GitHub com acesso ao repositório
- Docker e Docker Compose instalados no servidor
- Git instalado no servidor

## 🏗️ Estrutura de Deploy

- **Produção**: Porta `5174` (branch `main`) - **Deploy automático via CI/CD**
- **Homologação**: Porta `5174` (branch `homolog`) - **Apenas deploy manual** (sem CI/CD)

**Nota**: Apenas a branch `main` possui CI/CD automático. A branch `homolog` pode ser deployada manualmente quando necessário.

Cada ambiente roda em um container Docker separado com Nginx servindo os arquivos estáticos.

---

## 📝 Passo 1: Configuração Inicial no Servidor VPS

### 1.1 Conectar ao servidor VPS

```bash
ssh seu-usuario@seu-servidor
```

### 1.2 Instalar Docker e Docker Compose

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Git (se necessário)
sudo apt-get update
sudo apt-get install -y git
```

### 1.3 Criar diretório do projeto

```bash
sudo mkdir -p /var/www/lp-marshall
sudo chown $USER:$USER /var/www/lp-marshall
cd /var/www/lp-marshall
```

### 1.4 Clonar o repositório

```bash
git clone https://github.com/Marshall-TDS/lp-marshall.git .
# OU se já existe:
git remote add origin https://github.com/Marshall-TDS/lp-marshall.git
git fetch origin
git checkout -b homolog origin/homolog
```

---

## 🔐 Passo 2: Configurar GitHub Actions Secrets

### 2.1 Acessar configurações de Secrets

1. Acesse o repositório no GitHub: `https://github.com/Marshall-TDS/lp-marshall`
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret** para cada variável abaixo

### 2.2 Adicionar as seguintes Secrets:

#### Secrets de Infraestrutura:
- `VPS_SSH_PRIVATE_KEY` - Chave SSH privada para acesso ao servidor (veja **Passo 3** para instruções detalhadas)
- `VPS_HOST` - IP ou hostname do servidor (ex: `72.61.223.230`)
- `VPS_USER` - Usuário SSH do servidor (ex: `root`)
- `VPS_DEPLOY_PATH` - `/var/www/lp-marshall`

**⚠️ IMPORTANTE**: 
- Todas essas secrets serão usadas automaticamente pelo GitHub Actions durante o deploy
- Não é necessário criar arquivo `.env` no servidor

---

## 🔑 Passo 3: Gerar e Configurar Chave SSH

### 3.1 Conectar ao servidor VPS

```bash
ssh seu-usuario@seu-servidor
```

### 3.2 Gerar chave SSH para deploy

```bash
# Gerar uma nova chave SSH específica para o GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Quando solicitado, pressione ENTER para usar a senha padrão (vazio)
```

### 3.3 Adicionar chave pública ao authorized_keys

```bash
# Adicionar a chave pública ao authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Garantir permissões corretas
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3.4 Obter a chave privada

```bash
# Exibir a chave privada completa
cat ~/.ssh/github_actions_deploy
```

**⚠️ IMPORTANTE**: 
- Copie **TUDO**, incluindo as linhas `-----BEGIN OPENSSH PRIVATE KEY-----` e `-----END OPENSSH PRIVATE KEY-----`
- Esta é uma informação sensível - mantenha-a segura

### 3.5 Adicionar chave SSH como Secret no GitHub

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. **Name**: `VPS_SSH_PRIVATE_KEY`
5. **Secret**: Cole a chave privada completa
6. Clique em **Add secret**

---

## 🐳 Passo 4: Testar Deploy Manual (Opcional)

Antes de configurar o deploy automático, teste manualmente:

```bash
cd /var/www/lp-marshall

# Para homologação
./scripts/deploy.sh homolog

# Para produção
./scripts/deploy.sh main
```

Ou manualmente:

```bash
# Para homologação
git checkout homolog
git pull origin homolog
docker-compose build lp-marshall-homolog
docker-compose up -d lp-marshall-homolog

# Para produção
git checkout main
git pull origin main
docker-compose build lp-marshall-main
docker-compose up -d lp-marshall-main
```

### Verificar se os containers estão rodando:

```bash
docker-compose ps
docker-compose logs lp-marshall-homolog
docker-compose logs lp-marshall-main
```

### Testar a aplicação:

```bash
# Health check
curl http://localhost:5174/health
```

---

## ⚙️ Passo 5: Configurar Deploy Automático

### 5.1 Fazer commit e push dos arquivos de configuração

```bash
# No seu ambiente local
cd lp-marshall

git add .
git commit -m "ci: adiciona configuração de deploy com Docker e GitHub Actions"
git push origin homolog
git push origin main
```

### 5.2 Verificar o workflow no GitHub

1. Acesse o repositório no GitHub
2. Vá em **Actions**
3. Você verá os workflows sendo executados
4. Clique para ver os logs em tempo real

### 5.3 Deploy automático

Agora, sempre que você fizer push para a branch `main`, o deploy será executado automaticamente!

**Nota**: A branch `homolog` não possui CI/CD automático. Para fazer deploy de homolog, use o script manual: `./scripts/deploy.sh homolog`

---

## 🔍 Passo 6: Verificar e Monitorar

### 6.1 Verificar status dos containers

```bash
ssh seu-usuario@seu-servidor
cd /var/www/lp-marshall
docker-compose ps
```

### 6.2 Ver logs

```bash
# Logs de homologação
docker-compose logs -f lp-marshall-homolog

# Logs de produção
docker-compose logs -f lp-marshall-main
```

### 6.3 Verificar saúde da aplicação

```bash
curl http://localhost:5174/health
```

---

## 🛠️ Comandos Úteis

### Parar containers

```bash
docker-compose stop lp-marshall-homolog
docker-compose stop lp-marshall-main
```

### Reiniciar containers

```bash
docker-compose restart lp-marshall-homolog
docker-compose restart lp-marshall-main
```

### Rebuild completo

```bash
docker-compose build --no-cache lp-marshall-homolog
docker-compose up -d lp-marshall-homolog
```

### Limpar recursos não utilizados

```bash
docker system prune -a
```

### Ver uso de recursos

```bash
docker stats
```

---

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs lp-marshall-homolog

# Verificar configuração
docker-compose config
```

### Erro no build

- Verifique se o `package.json` está correto
- Verifique se todas as dependências estão instaladas
- Verifique os logs do build: `docker-compose build lp-marshall-homolog`

### Porta já em uso

```bash
# Verificar qual processo está usando a porta
sudo lsof -i :5174

# Parar o processo ou mudar a porta no docker-compose.yml
```

### Erro no GitHub Actions

- Verifique se todas as secrets estão configuradas corretamente
- Verifique se a chave SSH está correta e tem permissões adequadas
- Verifique os logs do workflow no GitHub Actions

### Container para após iniciar

```bash
# Ver logs para identificar o erro
docker-compose logs lp-marshall-homolog

# Verificar healthcheck
docker inspect lp-marshall-homolog | grep -A 10 Health
```

---

## 📚 Estrutura de Arquivos Criados

```
lp-marshall/
├── Dockerfile                    # Imagem Docker da aplicação (build + Nginx)
├── nginx.conf                    # Configuração do Nginx
├── docker-compose.yml            # Orquestração dos containers
├── .dockerignore                 # Arquivos ignorados no build
├── .github/
│   └── workflows/
│       └── deploy-main.yml       # Workflow para branch main (único CI/CD)
├── scripts/
│   └── deploy.sh                # Script de deploy manual
└── DEPLOY.md                     # Esta documentação
```

---

## ✅ Checklist de Deploy

- [ ] Docker e Docker Compose instalados no servidor
- [ ] Repositório clonado no servidor
- [ ] Secrets configuradas no GitHub
- [ ] Chave SSH configurada e testada
- [ ] Deploy manual testado com sucesso
- [ ] Containers rodando e acessíveis
- [ ] GitHub Actions workflow funcionando
- [ ] Healthcheck respondendo corretamente

---

## 🌐 Passo 7: Configurar Domínio e SSL (Opcional)

Para configurar o domínio `marshalltds.com` com certificado SSL:

### 7.1 Configurar DNS na GoDaddy

1. **Registro A para o domínio principal**:
   - Tipo: `A`
   - Nome: `@`
   - Valor: `72.61.223.230`
   - TTL: `600` (ou padrão)

2. **Registro A para www** (recomendado):
   - Tipo: `A`
   - Nome: `www`
   - Valor: `72.61.223.230`
   - TTL: `600` (ou padrão)

   **OU** usar CNAME:
   - Tipo: `CNAME`
   - Nome: `www`
   - Valor: `@` (ou `marshalltds.com`)

### 7.2 Aguardar Propagação DNS

Aguarde alguns minutos e verifique:

```bash
nslookup marshalltds.com
nslookup www.marshalltds.com
```

Ambos devem retornar: `72.61.223.230`

### 7.3 Executar Script de Configuração SSL

```bash
cd /var/www/lp-marshall
sudo ./scripts/setup-nginx-ssl.sh
```

O script irá:
- Instalar Nginx e Certbot (se necessário)
- Configurar proxy reverso para a porta 5174
- Obter certificado SSL do Let's Encrypt
- Configurar redirecionamento HTTP → HTTPS

**Documentação completa**: Veja `scripts/NGINX_SSL_SETUP.md` para instruções detalhadas.

---

## 🎉 Pronto!

Agora você tem um sistema de deploy automatizado configurado! 

- Push para `main` → Deploy automático na porta 5174
- Push para `homolog` → Sem deploy automático (use `./scripts/deploy.sh homolog` para deploy manual)
- Domínio configurado → `https://marshalltds.com` e `https://www.marshalltds.com`

Para dúvidas ou problemas, consulte a seção de Troubleshooting acima.

