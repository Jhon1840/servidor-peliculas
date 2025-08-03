# 🎬 Configuración de CineBus - Acceso Restringido

Este documento explica cómo configurar el servidor Jellyfin para que solo sea accesible por API key y configurar DNS dinámico.

## 📋 Requisitos Previos

- Python 3.7+
- Cuenta en un proveedor de DNS dinámico (NoIP, DynDNS, FreeDNS, etc.)
- Acceso al servidor donde corre Jellyfin

## 🔐 1. Configurar Acceso Restringido a Jellyfin

### Paso 1: Reiniciar Jellyfin con nueva configuración

```bash
# Detener el contenedor
docker-compose down

# Reiniciar para aplicar cambios de network.xml
docker-compose up -d
```

### Paso 2: Ejecutar script de configuración

```bash
cd script
python configure-jellyfin-restricted.py
```

Este script:
- ✅ Crea un usuario administrador
- ✅ Deshabilita acceso público
- ✅ Configura permisos restringidos
- ✅ Genera archivo con información de API

### Paso 3: Verificar configuración

El archivo `jellyfin_api_info.json` contendrá:
```json
{
  "api_key": "87c8ee2407a44adbbbceade9022d093b",
  "base_url": "http://localhost:8096",
  "admin_username": "admin",
  "admin_password": "admin123",
  "access_restricted": true,
  "web_access_disabled": true,
  "api_only": true
}
```

## 🌐 2. Configurar DNS Dinámico

### Paso 1: Instalar dependencias

```bash
cd script
pip install requests
```

### Paso 2: Configurar credenciales DNS

Edita el archivo `ddns_config.json`:

```json
{
  "provider": "noip",
  "username": "tu_usuario_real",
  "password": "tu_password_real", 
  "hostname": "tu-dominio.ddns.net",
  "check_interval": 300,
  "ip_check_url": "https://api.ipify.org"
}
```

**Proveedores soportados:**
- `noip` - NoIP.com
- `dyndns` - DynDNS.org  
- `freedns` - FreeDNS.afraid.org

### Paso 3: Ejecutar actualizador DNS

```bash
python ddns-updater.py
```

**Para ejecutar en segundo plano:**
```bash
nohup python ddns-updater.py > ddns.log 2>&1 &
```

### Paso 4: Configurar inicio automático

Crear servicio systemd (Linux):

```bash
sudo nano /etc/systemd/system/ddns-updater.service
```

```ini
[Unit]
Description=DDNS Updater for CineBus
After=network.target

[Service]
Type=simple
User=tu_usuario
WorkingDirectory=/ruta/a/tu/proyecto/script
ExecStart=/usr/bin/python3 ddns-updater.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable ddns-updater
sudo systemctl start ddns-updater
```

## 📱 3. Configurar App Externa

### Información para la app:

```json
{
  "server_url": "http://tu-dominio.ddns.net:8096",
  "api_key": "87c8ee2407a44adbbbceade9022d093b",
  "headers": {
    "X-Emby-Token": "87c8ee2407a44adbbbceade9022d093b"
  }
}
```

### Endpoints principales:

- **Lista de películas**: `GET /Items?IncludeItemTypes=Movie`
- **Detalles de película**: `GET /Items/{id}`
- **Stream de video**: `GET /Videos/{id}/stream`
- **Imágenes**: `GET /Items/{id}/Images/{type}`

## 🔧 4. Verificación y Testing

### Verificar acceso restringido:

```bash
# Esto debería fallar (acceso web deshabilitado)
curl http://localhost:8096

# Esto debería funcionar (acceso por API)
curl -H "X-Emby-Token: 87c8ee2407a44adbbbceade9022d093b" \
     http://localhost:8096/Users
```

### Verificar DNS dinámico:

```bash
# Verificar que el dominio resuelve a tu IP
nslookup tu-dominio.ddns.net

# Probar conexión desde internet
curl -H "X-Emby-Token: 87c8ee2407a44adbbbceade9022d093b" \
     http://tu-dominio.ddns.net:8096/Users
```

## 🛡️ 5. Seguridad Adicional

### Firewall (recomendado):

```bash
# Permitir solo puerto 8096 desde internet
sudo ufw allow 8096/tcp
sudo ufw enable
```

### Nginx como proxy (opcional):

```nginx
server {
    listen 80;
    server_name tu-dominio.ddns.net;
    
    location / {
        proxy_pass http://localhost:8096;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 6. Monitoreo

### Logs importantes:

- **Jellyfin**: `docker-compose logs jellyfin`
- **DNS Updater**: `tail -f script/ddns.log`
- **Sistema**: `journalctl -u ddns-updater`

### Comandos útiles:

```bash
# Verificar estado del servicio DNS
sudo systemctl status ddns-updater

# Ver logs en tiempo real
tail -f script/ddns.log

# Verificar IP actual
curl https://api.ipify.org

# Probar conectividad
ping tu-dominio.ddns.net
```

## 🚨 7. Solución de Problemas

### DNS no se actualiza:
1. Verificar credenciales en `ddns_config.json`
2. Revisar logs: `tail -f script/ddns.log`
3. Verificar conectividad a internet

### App no puede conectar:
1. Verificar que el dominio resuelve correctamente
2. Confirmar que el puerto 8096 está abierto
3. Verificar que la API key es correcta

### Jellyfin no responde:
1. Verificar que el contenedor está corriendo: `docker-compose ps`
2. Revisar logs: `docker-compose logs jellyfin`
3. Verificar configuración de red

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs mencionados arriba
2. Verifica la conectividad de red
3. Confirma que las credenciales son correctas
4. Asegúrate de que el firewall permite el tráfico necesario 