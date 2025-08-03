# 🎬 CineBus - Servidor de Películas Local

Un sistema completo de streaming de películas para vehículos, buses o eventos móviles usando Jellyfin.

## 🚀 Características

- **Servidor Jellyfin** - Streaming de películas con transcodificación automática
- **Acceso Restringido** - Solo por API key, sin interfaz web pública
- **Landing Page** - Página de bienvenida que redirige automáticamente
- **App Móvil** - Cliente React Native para dispositivos móviles
- **DNS Dinámico** - Soporte para acceso remoto con dominio dinámico

## 📋 Requisitos

- Docker y Docker Compose
- Python 3.7+ (para DNS dinámico)
- Cuenta en proveedor DNS dinámico (NoIP, DynDNS, etc.)

## 🛠️ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd servido_pelioculas
```

### 2. Configurar archivos de configuración
```bash
# Copiar configuraciones de ejemplo
cp -r config-example/* config/config/

# Editar configuración según tus necesidades
nano config/config/network.xml
nano config/config/system.xml
```

### 3. Agregar películas
```bash
# Coloca tus archivos de video en la carpeta peliculas/
# Formatos soportados: MP4, MKV, AVI, MOV, etc.
```

### 4. Iniciar servicios
```bash
docker-compose up -d
```

### 5. Configurar DNS dinámico (opcional)
```bash
cd script
pip install requests
# Editar ddns_config.json con tus credenciales
python ddns-updater.py
```

## 🔧 Configuración

### Acceso Restringido
El servidor está configurado para acceso solo por API key:

- **API Key**: `87c8ee2407a44adbbbceade9022d093b`
- **URL**: `http://localhost:8096` (local) o `http://tu-dominio.ddns.net:8096` (remoto)
- **Acceso web**: Deshabilitado
- **Solo API**: Habilitado

### Configuración de Red
- **Puerto**: 8096
- **Auto-discovery**: Deshabilitado
- **UPnP**: Deshabilitado
- **Acceso remoto**: Deshabilitado (solo por API)

### Configuración de Sistema
- **Idioma**: Español (México)
- **País**: Bolivia
- **Nombre del servidor**: CineBus
- **Quick Connect**: Deshabilitado

## 📱 Uso

### Para Administradores
1. Acceder por API key para gestión
2. Usar endpoints de Jellyfin API
3. Configurar bibliotecas y metadatos

### Para Usuarios
1. Conectarse al WiFi del vehículo
2. Acceder a la landing page (puerto 80)
3. Usar la app móvil para ver películas

## 🌐 DNS Dinámico

Para acceso remoto, configura un proveedor de DNS dinámico:

```json
{
  "provider": "noip",
  "username": "tu_usuario",
  "password": "tu_password",
  "hostname": "tu-dominio.ddns.net",
  "check_interval": 300
}
```

## 📊 Monitoreo

### Verificar estado del servidor
```bash
docker-compose ps
docker-compose logs jellyfin
```

### Verificar API
```bash
curl -H "X-Emby-Token: 87c8ee2407a44adbbbceade9022d093b" \
     http://localhost:8096/Users
```

## 🔒 Seguridad

- Acceso web deshabilitado
- Solo API key válida
- Sin auto-discovery
- Sin UPnP
- Firewall recomendado en puerto 8096

## 📁 Estructura del Proyecto

```
servido_pelioculas/
├── docker-compose.yml          # Configuración de servicios
├── config/                     # Configuración de Jellyfin (ignorado por Git)
├── config-example/             # Archivos de configuración de ejemplo
├── html/                       # Landing page
├── peliculas/                  # Biblioteca de películas (ignorado por Git)
├── pelis-mobile/               # App móvil React Native
├── script/                     # Scripts de utilidad (ignorado por Git)
└── README.md                   # Este archivo
```

## 🚨 Solución de Problemas

### El servidor no inicia
1. Verificar que Docker esté corriendo
2. Revisar logs: `docker-compose logs jellyfin`
3. Verificar puertos disponibles

### No se cargan las películas
1. Verificar que los archivos estén en `peliculas/`
2. Revisar permisos de archivos
3. Verificar formato de video soportado

### API no responde
1. Verificar que el contenedor esté corriendo
2. Confirmar API key correcta
3. Verificar configuración de red

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

---

**Nota**: Este sistema está diseñado para uso personal y requiere configuración específica para tu entorno. 