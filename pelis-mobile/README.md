# Pelis Mobile - Cliente Jellyfin

Una aplicación móvil React Native para consumir películas desde tu servidor Jellyfin local.

## 🚀 Características

- 📱 Interfaz moderna y responsive
- 🔍 Búsqueda de películas en tiempo real
- 🎬 Vista de detalles de películas
- 🖼️ Carga de posters y imágenes
- 🔄 Pull-to-refresh para actualizar contenido
- 🌙 Tema oscuro optimizado
- 📊 Información de duración y año de producción
- ✅ Indicador de películas vistas

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Servidor Jellyfin funcionando en tu red local

## 🛠️ Instalación

1. **Clona o navega al directorio del proyecto:**
   ```bash
   cd pelis-mobile
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la IP de tu servidor Jellyfin:**
   
   Edita el archivo `src/config/constants.ts` y cambia la URL:
   ```typescript
   JELLYFIN_BASE_URL: 'http://TU_IP_LOCAL:8096'
   ```
   
   Reemplaza `TU_IP_LOCAL` con la IP de tu servidor Jellyfin (ej: `192.168.26.4`)

## 🚀 Ejecución

### Para desarrollo:

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

2. **Escanea el código QR con la app Expo Go en tu dispositivo móvil**

### Para Android:

```bash
npm run android
```

### Para iOS (solo en macOS):

```bash
npm run ios
```

### Para web:

```bash
npm run web
```

## 📱 Uso

1. **Asegúrate de que tu dispositivo móvil esté en la misma red WiFi que tu servidor Jellyfin**

2. **Abre la aplicación** - Verás la lista de todas las películas disponibles

3. **Busca películas** - Usa la barra de búsqueda para encontrar películas específicas

4. **Toca una película** - Se abrirá un menú con opciones para ver detalles o reproducir

5. **Actualiza la lista** - Desliza hacia abajo para refrescar el contenido

## 🔧 Configuración

### Cambiar la URL del servidor:

Edita `src/config/constants.ts`:
```typescript
export const CONFIG = {
  JELLYFIN_BASE_URL: 'http://TU_IP:8096',
  // ... resto de configuración
};
```

### Personalizar colores:

En el mismo archivo puedes cambiar los colores de la interfaz:
```typescript
UI: {
  COLORS: {
    PRIMARY: '#e50914',      // Color principal (rojo Netflix)
    SECONDARY: '#1a1a1a',    // Color secundario
    BACKGROUND: '#000000',   // Color de fondo
    // ... más colores
  },
}
```

## 🏗️ Estructura del Proyecto

```
pelis-mobile/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── MovieCard.tsx    # Tarjeta de película
│   │   └── SearchBar.tsx    # Barra de búsqueda
│   ├── screens/             # Pantallas de la app
│   │   └── MoviesScreen.tsx # Pantalla principal
│   ├── services/            # Servicios de API
│   │   └── jellyfinApi.ts   # Cliente de Jellyfin
│   └── config/              # Configuración
│       └── constants.ts     # Constantes y configuración
├── App.tsx                  # Componente principal
└── package.json
```

## 🔌 API de Jellyfin

La aplicación utiliza la API pública de Jellyfin para:

- Obtener lista de películas
- Buscar películas
- Obtener detalles de películas
- Cargar imágenes y posters
- Obtener URLs de reproducción

## 🐛 Solución de Problemas

### No se cargan las películas:
1. Verifica que tu servidor Jellyfin esté funcionando
2. Confirma que la IP en `constants.ts` sea correcta
3. Asegúrate de que tu dispositivo esté en la misma red WiFi

### Error de conexión:
1. Verifica que el puerto 8096 esté abierto
2. Confirma que Jellyfin permita acceso público
3. Revisa los logs del servidor Jellyfin

### Imágenes no se cargan:
1. Verifica que las películas tengan metadatos
2. Confirma que Jellyfin tenga acceso a las imágenes
3. Revisa la configuración de la biblioteca

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

---

**Nota:** Esta aplicación está diseñada para uso personal y requiere un servidor Jellyfin configurado en tu red local. 