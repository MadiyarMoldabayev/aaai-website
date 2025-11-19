# Инструкция по развертыванию на Netlify

## Способ 1: Через GitHub (Рекомендуется)

### Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com/new)
2. Создайте новый репозиторий (например, `aaai-website`)
3. **НЕ** инициализируйте с README, .gitignore или лицензией

### Шаг 2: Загрузите код в GitHub

```bash
# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: AAAI website"

# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/aaai-website.git

# Загрузите код
git branch -M main
git push -u origin main
```

### Шаг 3: Разверните на Netlify

1. Перейдите на [Netlify](https://app.netlify.com)
2. Нажмите "Add new site" → "Import an existing project"
3. Выберите "GitHub" и авторизуйтесь
4. Выберите ваш репозиторий `aaai-website`
5. Настройки деплоя:
   - **Build command**: оставьте пустым
   - **Publish directory**: `.` (точка)
6. Нажмите "Deploy site"

## Способ 2: Прямая загрузка (Drag & Drop)

1. Перейдите на [Netlify](https://app.netlify.com)
2. Перетащите всю папку проекта в область "Want to deploy a new site without connecting to Git?"
3. Дождитесь завершения деплоя

## Способ 3: Через Netlify CLI

```bash
# Установите Netlify CLI (если еще не установлен)
npm install -g netlify-cli

# Войдите в Netlify
netlify login

# Инициализируйте сайт
netlify init

# Разверните
netlify deploy --prod
```

## После развертывания

1. Netlify автоматически присвоит вашему сайту URL вида `random-name-123.netlify.app`
2. Вы можете настроить кастомный домен в настройках сайта
3. При каждом push в GitHub, сайт будет автоматически обновляться

## Настройки сайта

- **Framework**: None (Static HTML)
- **Build command**: (пусто)
- **Publish directory**: `.` (корневая папка)

