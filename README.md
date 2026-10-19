# RoncoMed · Sitio de presentación

Sitio estático (HTML + CSS + JS, sin dependencias) listo para GitHub Pages.

## Estructura
```
index.html        ← página principal
css/styles.css    ← estilos y paleta de colores
js/main.js        ← animaciones, test de síntomas, formulario a WhatsApp
img/              ← imágenes (los nombres deben coincidir exactamente)
```

## Imágenes
| Archivo              | Qué es                                   |
|----------------------|------------------------------------------|
| img/logo.png         | Logo con fondo transparente (menú)       |
| img/logo-blanco.png  | Logo con letras blancas (footer)         |
| img/favicon.png      | Ícono de la pestaña del navegador        |
| img/portada.jpg      | Portada de Facebook (sección Nosotros)   |
| img/descanso.jpg     | Publicación (hero y redes)               |
| img/cpap.jpg         | Publicación (redes)                      |
| img/cirugia.jpg      | Publicación (redes)                      |
| img/dra-diana.jpg    | **Pendiente:** foto de la Dra. Diana     |
| img/dr-raziel.jpg    | **Pendiente:** foto del Dr. Raziel       |

Si una foto de doctor no existe, se muestran sus iniciales automáticamente.
Para cambiar una imagen, súbela con el **mismo nombre** a la carpeta `img/`.

## Datos de ejemplo que hay que reemplazar
Busca `(ejemplo)` y `0000000` en `index.html`:
- Cédulas profesionales y de especialidad
- Universidades
- Especialidad del Dr. Raziel
- Horario y teléfono
- Enlaces de Instagram y TikTok (`href="#"`)
- Testimonios

El número de WhatsApp está en **dos lugares**:
1. `js/main.js` → `const WHATSAPP = "522290000000";`
2. `index.html` → busca `wa.me/522290000000`

## Publicar en GitHub Pages
1. Crea un repositorio público, por ejemplo `roncomed`.
2. Sube **todo el contenido** de esta carpeta (que `index.html` quede en la raíz, no dentro de otra carpeta).
3. Ve a **Settings → Pages**.
4. En *Source* elige **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
5. En 1–2 minutos estará en `https://TU-USUARIO.github.io/roncomed/`.

Nota: GitHub distingue mayúsculas y minúsculas, `Logo.png` no es lo mismo que `logo.png`.
