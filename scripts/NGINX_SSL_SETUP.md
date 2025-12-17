# 🔒 Tutorial: Configurar Proxy Reverso com Nginx e SSL para marshalltds.com

Este tutorial explica como configurar o Nginx como proxy reverso para a Landing Page Marshall com certificado SSL usando Let's Encrypt (Certbot).

## 📋 Pré-requisitos

- Servidor VPS com acesso root/sudo
- DNS configurado apontando para o servidor (registro A)
- Container Docker rodando na porta 5174
- Portas 80 e 443 abertas no firewall

## 🎯 Domínio Configurado

- **Produção**: `https://marshalltds.com` e `https://www.marshalltds.com` → Porta `5174`

## 🌐 Configuração DNS na GoDaddy

Antes de executar o script, configure os registros DNS:

### 1. Registro A para o domínio principal

```
Tipo: A
Nome: @
Valor: 72.61.223.230
TTL: 600 segundos (ou padrão)
```

### 2. Registro A para www (opcional, mas recomendado)

```
Tipo: A
Nome: www
Valor: 72.61.223.230
TTL: 600 segundos (ou padrão)
```

**OU** usar CNAME para www:

```
Tipo: CNAME
Nome: www
Valor: @ (ou marshalltds.com)
TTL: 600 segundos (ou padrão)
```

### ⏱️ Aguardar Propagação DNS

Após configurar o DNS, aguarde a propagação (pode levar de alguns minutos a 24 horas). Para verificar:

```bash
# Verificar DNS do domínio principal
nslookup marshalltds.com

# Verificar DNS do www
nslookup www.marshalltds.com

# Ou usar dig
dig +short marshalltds.com
dig +short www.marshalltds.com
```

Ambos devem retornar: `72.61.223.230`

## 🚀 Passo a Passo

### 1. Conectar ao Servidor

```bash
ssh seu-usuario@72.61.223.230
```

### 2. Navegar para o Diretório do Projeto

```bash
cd /var/www/lp-marshall
```

### 3. Garantir que o Container Está Rodando

```bash
# Verificar status
docker-compose ps lp-marshall-main

# Se não estiver rodando, inicie:
docker-compose up -d lp-marshall-main
```

### 4. Testar se a Aplicação Está Respondendo

```bash
curl http://localhost:5174/health
```

Deve retornar: `healthy`

### 5. Executar o Script de Configuração

```bash
# Dar permissão de execução (se ainda não tiver)
chmod +x scripts/setup-nginx-ssl.sh

# Executar o script
sudo ./scripts/setup-nginx-ssl.sh
```

### 6. Durante a Execução

O script irá:
1. ✅ Instalar Nginx (se não estiver instalado)
2. ✅ Instalar Certbot (se não estiver instalado)
3. ✅ Criar configuração do Nginx para marshalltds.com e www.marshalltds.com
4. ✅ Testar a configuração
5. ✅ Recarregar o Nginx
6. ✅ Solicitar certificado SSL do Let's Encrypt para ambos os domínios

**Importante**: Quando o script perguntar sobre o DNS, certifique-se de que os registros A já estão configurados e propagados antes de continuar.

### 7. Verificar Configuração

Após a execução, teste o acesso:

```bash
# Testar HTTP (deve redirecionar para HTTPS)
curl -I http://marshalltds.com

# Testar HTTPS
curl https://marshalltds.com/health

# Testar www
curl https://www.marshalltds.com/health
```

## 🔍 Verificações

### Ver Status do Nginx

```bash
sudo systemctl status nginx
```

### Ver Logs do Nginx

```bash
# Logs de acesso
sudo tail -f /var/log/nginx/marshalltds.com-access.log

# Logs de erro
sudo tail -f /var/log/nginx/marshalltds.com-error.log
```

### Ver Configuração do Nginx

```bash
# Ver configuração criada
sudo cat /etc/nginx/sites-available/marshalltds.com

# Testar configuração
sudo nginx -t
```

### Ver Certificados SSL

```bash
# Listar certificados
sudo certbot certificates

# Testar renovação (dry-run)
sudo certbot renew --dry-run
```

## 🔄 Renovação Automática do Certificado

O Certbot configura automaticamente a renovação dos certificados. Para verificar:

```bash
# Ver cron job de renovação
sudo systemctl status certbot.timer

# Testar renovação manual
sudo certbot renew --dry-run
```

## 🛠️ Comandos Úteis

### Recarregar Nginx

```bash
sudo systemctl reload nginx
# ou
sudo nginx -s reload
```

### Reiniciar Nginx

```bash
sudo systemctl restart nginx
```

### Verificar Portas Abertas

```bash
sudo netstat -tlnp | grep -E ':(80|443)'
```

### Abrir Portas no Firewall (UFW)

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

## 🐛 Troubleshooting

### Erro: "Container não está respondendo"

- Verifique se o container está rodando: `docker-compose ps lp-marshall-main`
- Verifique os logs: `docker-compose logs lp-marshall-main`
- Teste a porta diretamente: `curl http://localhost:5174/health`

### Erro: "DNS não está configurado"

- Verifique o DNS: `nslookup marshalltds.com`
- Aguarde a propagação do DNS (pode levar até 24 horas, geralmente alguns minutos)
- Verifique se o registro A está apontando para `72.61.223.230`
- Verifique ambos os domínios: `marshalltds.com` e `www.marshalltds.com`

### Erro: "Porta 80 já está em uso"

- Verifique qual processo está usando: `sudo lsof -i :80`
- Pare o processo ou configure o Nginx para usar outra porta

### Erro no Certbot

- Verifique se o DNS está propagado: `dig +short marshalltds.com`
- Verifique se a porta 80 está acessível externamente
- Verifique os logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`
- Certifique-se de que ambos os domínios (com e sem www) estão configurados no DNS

### Certificado não renova automaticamente

```bash
# Verificar timer do Certbot
sudo systemctl status certbot.timer

# Habilitar timer se não estiver ativo
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📝 Estrutura de Arquivos Criados

Após a execução do script, os seguintes arquivos serão criados:

```
/etc/nginx/sites-available/marshalltds.com
/etc/nginx/sites-enabled/marshalltds.com -> (link simbólico)
/var/log/nginx/marshalltds.com-access.log
/var/log/nginx/marshalltds.com-error.log
/etc/letsencrypt/live/marshalltds.com/ (certificados SSL)
```

## ✅ Checklist

- [ ] DNS configurado e propagado (marshalltds.com e www.marshalltds.com)
- [ ] Container Docker rodando na porta 5174
- [ ] Portas 80 e 443 abertas no firewall
- [ ] Script executado com sucesso
- [ ] Certificado SSL obtido para ambos os domínios
- [ ] Acesso HTTPS funcionando
- [ ] Redirecionamento HTTP → HTTPS funcionando
- [ ] Renovação automática configurada

## 🎉 Pronto!

Agora sua landing page está acessível via HTTPS com certificado SSL válido!

- **Domínio principal**: `https://marshalltds.com`
- **www**: `https://www.marshalltds.com`

Ambos os domínios redirecionam automaticamente de HTTP para HTTPS.

