
## 🚀 Características

- **Servidor Jellyfin** - Streaming de películas con transcodificación automática
- **Acceso Restringido** - Solo por API key, sin interfaz web pública
- **Landing Page** - Página de bienvenida que redirige automáticamente
- **App Móvil** - Cliente React Native para dispositivos móviles
- **DNS Dinámico** - Soporte para acceso remoto con dominio dinámico


## 🛠️ Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd servido_pelioculas
```

### 2. Agregar películas
```bash
# Coloca tus archivos de video en la carpeta peliculas/
# Formatos soportados: MP4, MKV, AVI, MOV, etc.
```

### 3. Iniciar servidor
```bash
docker-compose up -d
```

## 🔧 Configuración

### Acceso Restringido
El servidor está configurado para acceso solo por API key:

- **API Key**: `obtenible en la aplicacion`
- **URL**: `http://localhost:8096` (local) o `http://tu-dominio.ddns.net:8096` (remoto)
- **Acceso web**: Deshabilitado
- **Solo API**: Habilitado

### Configuración de Red
- **Puerto**: 8096
- **Auto-discovery**: Deshabilitado
- **UPnP**: Deshabilitado
- **Acceso remoto**: Deshabilitado (solo por API)



## 📱 Uso

### Para Administradores
1. Acceder por API key para gestión
2. Usar endpoints de Jellyfin API
3. Configurar bibliotecas y metadatos

### Para Usuarios
1. Conectarse al WiFi del vehículo
2. Usar la app móvil para ver películas


## 📊 Monitoreo

### Verificar estado del servidor
```bash
docker-compose ps
docker-compose logs jellyfin
```


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

