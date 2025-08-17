# Score & Prize — Промо-платформа прогнозов счёта футбольных матчей

**Score & Prize** — это full-stack веб-приложение для проведения промо-акций в ресторанах и на мероприятиях, где пользователи выигрывают призы, прогнозируя счёт футбольных матчей.  
Платформа поддерживает автоматическое определение победителей, рассылку уникальных QR-кодов, удобную верификацию призов сотрудниками и защищённую админ-панель.

---

## Стек технологий

- **Backend:** Node.js, Express.js, Prisma ORM
- **Frontend:** React (Vite)
- **База данных:** PostgreSQL
- **Аутентификация:** JWT + bcrypt
- **Email:** SendGrid
- **Генерация QR-кодов:** qrcode (Node.js)
- **Контейнеризация:** Docker, Docker Compose
- **Reverse Proxy:** Nginx

---

## Быстрый старт (локально)

### 1. Клонирование и подготовка

```bash
git clone https://github.com/your-org/scoreprize.git
cd scoreprize
```

### 2. Настройка переменных окружения

Создайте `.env` файлы в каталогах `backend/` и `frontend/`.

#### Пример `backend/.env`:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/scoreprize
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=prizes@promo-restoran.com
```

#### Пример `frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

### 3. Установка зависимостей

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Миграция базы данных

```bash
cd ../backend
npx prisma migrate deploy
```

### 5. Запуск приложений

В двух терминалах:

```bash
# Терминал 1 — Backend
cd backend
npm run dev

# Терминал 2 — Frontend
cd frontend
npm run dev
```

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

---

## Основные сценарии использования

### Пользователь

- Регистрируется и входит в систему.
- В личном кабинете видит актуальные матчи и может сделать прогноз на счёт.
- В случае победы получает письмо с поздравлением и уникальным QR-кодом.
- В разделе **"Мои выигрыши"** видит историю побед, может фильтровать выигрыши (активные/погашенные) и повторно просматривать QR-код.

### Администратор

- Создаёт и публикует матчи.
- Вводит финальный счёт для определения победителей.
- Использует защищённую страницу `/admin/verify` для проверки QR-кодов (погашения призов).
- Может просматривать и логировать все погашения.

---

## Структура проекта

```
scoreprize/
│
├── backend/
│   ├── prisma/           # Миграции и схема БД
│   ├── src/
│   │   ├── routes/       # Все маршруты API (users, matches, prediction, winning, admin)
│   │   ├── middleware/   # Аутентификация и т.п.
│   │   └── ...
│   ├── .env
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Компоненты React (личный кабинет, мои выигрыши и пр.)
│   │   └── ...
│   ├── .env
│   └── ...
│
└── docker-compose.yml
```

---

## Ключевые эндпоинты (Backend)

- `POST   /api/auth/register` — регистрация пользователя
- `POST   /api/auth/login` — вход
- `GET    /api/matches/active` — список активных матчей
- `POST   /api/predictions` — сделать прогноз
- `GET    /api/winnings/mine` — мои выигрыши (фильтр по статусу через query-параметр)
- `GET    /api/winnings/qr/:uuid` — получить QR-код выигрыша
- `POST   /api/admin/matches` — создать матч (только админ)
- `POST   /api/admin/matches/:id/close` — завершить матч, определить победителей (только админ)
- `POST   /api/admin/verify` — верификация QR-кода (только админ)

---

## Верификация призов (flow)

1. Админ сканирует QR-код через `/admin/verify`
2. Если статус выигрыша — ACTIVE, меняется на REDEEMED, логируется погашение.
3. Если уже REDEEMED — выводится предупреждение.
4. Если не найдено — ошибка "Недействительный QR-код!"

---

## Email-рассылка

- Для отправки писем используется SendGrid (API-ключ в `.env`)
  https://app.sendgrid.com
- Отправитель: `prizes@promo-restoran.com`
- В письме — поздравление, детали выигрыша и QR-код (PNG)

---

## Безопасность

- JWT-аутентификация для пользователей и админов
- Пароли хранятся в bcrypt
- Все секреты через `.env` (добавлен в `.gitignore`)
- Админ-панель защищена дополнительной middleware

---

## Масштабирование

- До 500 пользователей — отправка писем напрямую через SendGrid.
- При большем объёме — рекомендуется внедрение очереди (BullMQ + Redis).

---

## Контакты и поддержка

- Вопросы и задачи — создавайте issues в репозитории.
- Для интеграции и кастомизации — обратитесь к владельцу проекта.

---

**Удачных промо-кампаний и честных побед!**

---

## Как попасть в базу данных PostgreSQL (без Docker)

Если база данных установлена локально или на сервере (НЕ через Docker):

1. Открой терминал (или командную строку/PowerShell/Terminal/VSCode).
2. Введи команду для подключения:

```bash
psql -U postgres -d scoreprize
```

- `-U postgres` — имя пользователя (по умолчанию `postgres`, если не менял).
- `-d scoreprize` — имя базы данных (см. твой .env).

Если база стоит на другом сервере, используй:

```bash
psql -h <host> -p 5432 -U postgres -d scoreprize
```

- `-h` — адрес сервера с PostgreSQL
- `-p` — порт (обычно 5432)

**Если просит пароль — введи его (по умолчанию часто `password`).**

---

### Основные команды в psql

- `\dt` — показать список таблиц
- `\d "User"` — структура таблицы User (или другой)
- `SELECT * FROM "User";` — посмотреть всех пользователей
- `\q` — выйти

---

### Пример сессии

```bash
psql -U postgres -d scoreprize
```

```sql
\dt
SELECT id, email FROM "User";
\q
```

---

### Если psql не установлен

- На Windows: [Скачать PostgreSQL](https://www.postgresql.org/download/windows/) и выбрать компонент “Command Line Tools”
- На macOS: `brew install postgresql`
- На Linux: `sudo apt install postgresql-client`

---

**Если что-то не работает — проверь имя пользователя, базы и пароль, которые указаны в твоём .env!**
