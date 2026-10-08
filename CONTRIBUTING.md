# Guía de contribución — Sim Racing Ecuador

Agradecemos las contribuciones al proyecto. Para preservar la identidad visual, el rendimiento y la seguridad del sitio web, tanto desarrolladores como agentes de IA deben seguir estrictamente estas directrices.

---

## 1. Reglas fundamentales de contribución

1. **Sin dependencias externas ni CDNs:**
   El proyecto es 100 % estático y autónomo. No agregues paquetes npm de ejecución ni enlaces a servidores externos (cdnjs, Google Fonts, etc.). Todo recurso debe alojarse localmente.
2. **Cero estilos en línea (`style="..."`):**
   Cualquier estilo debe residir en `styles.css` o manipularse mediante clases o CSSOM en JavaScript. El atributo `style="..."` está bloqueado por CSP y rechazado por el test de CI.
3. **Fidelidad estética innegociable ("Night Telemetry"):**
   No alteres colores, fuentes, tipografías ni la coreografía visual salvo requerimiento explícito. Los cambios de diseño deben mantener el contraste, la jerarquía condensada y los acentos tricolores ecuatorianos.
4. **Veracidad comercial de datos:**
   Los precios, fichas técnicas y modelos del catálogo son canónicos. No inventes especificaciones ni modifiques precios sin validación previa.

---

## 2. Flujo de trabajo de desarrollo

1. **Sincronización:**
   Asegúrate de partir de la última versión de `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Creación de rama:**
   Crea una rama descriptiva siguiendo la convención:
   - `feat/nombre-de-la-caracteristica`
   - `fix/descripcion-del-arreglo`
   - `docs/actualizacion-documentacion`
   - `perf/optimizacion-especifica`
3. **Verificación local obligatoria:**
   Antes de hacer commit, ejecuta las suites de prueba:
   ```bash
   python3 tests/verify_page.py
   python3 tests/security_audit.py
   ```
4. **Convención de commits:**
   Usa [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: ...`
   - `fix: ...`
   - `docs: ...`
   - `perf: ...`
   - `refactor: ...`

---

## 3. Checklist de revisión para Pull Requests

Antes de solicitar revisión o fusionar a `main`, verifica:

- [ ] Las suites `python3 tests/verify_page.py` y `python3 tests/security_audit.py` pasan sin errores.
- [ ] No se añadieron atributos `style="..."` en ningún archivo HTML.
- [ ] Todas las nuevas imágenes son formato `.webp`, optimizadas, con `alt` descriptivo y `decoding="async"`.
- [ ] Todos los enlaces `target="_blank"` cuentan con `rel="noopener noreferrer"` o `rel="noreferrer"`.
- [ ] No se introdujeron scripts o APIs peligrosas (`innerHTML`, `document.write`, `eval`).
- [ ] El comportamiento con `prefers-reduced-motion` activado fue verificado y funciona con normalidad.
- [ ] El diseño responde adecuadamente en pantallas móviles (< 380px, 680px), tablets (960px) y escritorio (≥ 1320px).
- [ ] Se respetan todas las pautas descritas en [AGENTS.md](AGENTS.md).
