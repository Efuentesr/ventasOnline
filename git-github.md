# 🧠 Guía rápida de Git y GitHub

---

## 1. Conceptos básicos

* **Repositorio (repo)**: Carpeta con control de versiones
* **Commit**: Guardado del estado del proyecto
* **Branch (rama)**: Línea de trabajo independiente
* **Merge**: Unión de ramas
* **Remote (origin)**: Repositorio en la nube (GitHub)

---

## 2. Flujo básico de trabajo

```bash
git init
git add .
git commit -m "Primer commit"
```

Conectar a GitHub:

```bash
git remote add origin URL
git push -u origin main
```

Luego:

```bash
git add .
git commit -m "cambios"
git push
```

---

## 3. Estados de archivos

* **Untracked**: No controlado
* **Modified**: Modificado
* **Staged**: Listo para commit
* **Committed**: Guardado

Ver estado:

```bash
git status
```

---

## 4. .gitignore

Evita subir archivos innecesarios:

Ejemplo:

```
*.log
__pycache__/
.env
```

⚠️ No afecta archivos ya versionados

---

## 5. Ramas (branches)

Crear rama:

```bash
git checkout -b nueva-rama
```

Cambiar rama:

```bash
git checkout main
```

Unir ramas:

```bash
git merge nueva-rama
```

---

## 6. Sincronización con GitHub

Traer cambios:

```bash
git pull
```

Subir cambios:

```bash
git push
```

---

## 7. Recuperación de datos (MUY IMPORTANTE)

### 🔹 7.1 Recuperar archivo borrado (antes de commit)

```bash
git checkout -- archivo.txt
```

---

### 🔹 7.2 Recuperar archivo después de commit

```bash
git checkout HEAD~1 archivo.txt
```

---

### 🔹 7.3 Ver historial

```bash
git log
```

---

### 🔹 7.4 Volver a un commit anterior

Modo seguro (recomendado):

```bash
git revert ID_COMMIT
```

Modo destructivo:

```bash
git reset --hard ID_COMMIT
```

---

### 🔹 7.5 Recuperar commits perdidos

```bash
git reflog
```

Luego:

```bash
git checkout ID_COMMIT
```

---

### 🔹 7.6 Recuperar trabajo no guardado

Git guarda referencias temporales:

```bash
git stash
```

Recuperar:

```bash
git stash pop
```

---

## 8. Problemas comunes

### ❌ Push rechazado

```bash
git pull --rebase
git push
```

---

### ❌ Archivos que deberían ignorarse

```bash
git rm -r --cached .
git add .
git commit -m "fix gitignore"
```

---

### ❌ Error de rama sin upstream

```bash
git push -u origin main
```

---

## 9. Buenas prácticas

* Crear `.gitignore` antes del primer commit
* Hacer commits pequeños y claros
* Usar ramas para nuevas funcionalidades
* Hacer `git pull` antes de `git push`

---

## 10. Flujo profesional recomendado

```bash
git checkout -b feature/nueva-funcion
# trabajar
git add .
git commit -m "feat: nueva funcion"
git push -u origin feature/nueva-funcion
```

Luego en GitHub:

* Crear Pull Request
* Revisar
* Merge

---

## 🧠 Resumen clave

* Git = control local
* GitHub = colaboración
* Siempre puedes recuperar casi todo (si usas git correctamente)

---

Si pierdes algo en Git… probablemente aún está ahí 😄
