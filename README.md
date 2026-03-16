![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)

Текущая версия: **1.3.3**  
Обновлено: **15.03.2026**
<h1 align="center">Multi Forum</h1>

**Multi Forum** — проект, созданный для изучения новых технологий и применения их на практике.
Проект представляет собой форум для общения разработчиков и программистов. Проект полностью бесплатен и находится в 
завершенной стадии разработки. Проектом могут пользоваться 
настоящие люди, перейдя по этой [ссылке](https://multi-forum.vercel.app/).

Проект создан одним разработчиком, все недочеты или баги можно оставить прямо на форуме, написав в соответствующую 
тему на нем. Подтверждение пользователей выполняет сам создатель проекта, когда находится на сайте.

<h1 align="center">Технологический стек</h1>

- 💻 **Языки и фреймворки**: TypeScript (TSX), React, Next.js, Tailwind CSS, Framer Motion
- 🗄️ **База данных**: PostgreSQL, Prisma ORM
- ⚙️ **Backend**: Node.js, Socket.io, Nodemailer, bcrypt, jsonwebtoken, dotenv
- 🛠️ **Инструменты**: Tiptap, Zod, Qrcode, UA-Parser-JS
- 🔧 **Dev / Build**: ESLint, Prettier, PostCSS, Next-Themes, Vercel

<h1 align="center">Фичи</h1>

### 1️⃣ **Аккаунты и безопасность**
- Регистрация, вход, сброс пароля с подтверждением по почте
- Привязка токенов к устройствам
- Управление устройствами в настройках аккаунта
- Rate-limiter для ограничения количества запросов
- Валидация данных через Zod
- Кастомизированные ошибки с анимацией

### 2️⃣ **Пользовательский интерфейс**
- Плавные анимации через Framer Motion
- Поддержка классических и гиф-аватарок через Imgur
- Интуитивно понятный адаптивный интерфейс 
- Удобный мессенджер для всех видов устройств
- Центр уведомлений

### 3️⃣ **Форум и общение**
- Разделение на роли (админ, модератор, пользователь)
- Поиск по пользователям и темам
- Основные разделы: Python, JavaScript, C++, Node.js, Next.js, CI/CD и др.
- Оффтоп раздел и “Форумные дела”
- **Встроенный чат с кастомной виртуализацией сообщений (чанки, бинарный поиск видимой области)**
- Отличная оптимизация мессенджера даже при большом количестве сообщений

### 4️⃣ **Редактор и контент**
- Редактор Tiptap с расширениями: код, картинки, YouTube, упоминания, текстовые стили и выравнивание

### 5️⃣ **Инфраструктура и DevOps**
- Хостинг на Vercel
- База данных PostgreSQL + Prisma ORM
- Socket.io для реального времени
- Тестирование, линтеры, Prettier, ESLint, TypeScript

### 6️⃣ **Дополнительные фичи / мелочи**
- Генерация QR-кодов
- Аналитика скорости через Vercel Speed Insights
- Поддержка темной/светлой темы через next-themes
- Детальная настройка профиля
- Безопасность данных на уровне best-practice

<h1 align="center">Как запустить локально</h1>

1. `git clone https://github.com/YanderuxTea/MultiForum.git`
2. `npm install` | `pnpm install`
3. Поднятие базы данных
4. Создание .env файла с ключами:
   - DB_DATABASE_URL=postgresql:... 
   - JWT_SECRET=... 
   - KEY_CRYPTO=... 
   - UPSTASH_REDIS_REST_TOKEN=...
   - UPSTASH_REDIS_REST_URL=... 
   - SMTP_PASS=... 
   - SMTP_USER=...
   - SMTP_HOST=... 
   - ENC_KEY=... 
   - NEXT_PUBLIC_NODE_SERVER_URL=... 
   - NEXT_PUBLIC_WS_SERVER_URL=... 
   - NEXT_PUBLIC_SITE_URL=...
5. `pnpm prisma:push` | `npx prisma db push && prisma generate`
6. `pnpm dev`

Для полноценного функционала следует запустить еще [Socket Server](https://github.com/YanderuxTea/serverSocketMultiForum) 
локально.
