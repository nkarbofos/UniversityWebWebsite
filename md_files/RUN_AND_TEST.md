# Запуск, тесты и документация API

Краткая инструкция для ежедневной работы с проектом. Подробности по миграциям и сбросу БД — в [DB_RESET_AND_MIGRATE.md](DB_RESET_AND_MIGRATE.md). Обзор того, что реализовано в коде — в [MANUAL_STEPS.md](MANUAL_STEPS.md).

## Требования

- **Node.js** версии, указанной в `engines` в [package.json](package.json) (сейчас `24.14.0`).
- Доступная **PostgreSQL** и строка подключения в переменной **`DATABASE_URL`** (Prisma).

## Установка зависимостей

В корне репозитория:

```bash
npm install
```

## Переменные окружения

1. Скопируйте шаблон из [.env.example](.env.example) в файл `.env` в корне проекта.
2. Укажите реальный **`DATABASE_URL`** (для Aiven обычно нужен `?sslmode=require`).
3. При необходимости задайте **`PORT`** (по умолчанию сервер слушает порт `3000` — см. [src/main.ts](src/main.ts)).

Не коммитьте `.env` в git: там хранятся секреты.

## Prisma (после клонирования или смены схемы)

Сгенерировать клиент:

```bash
npx prisma generate
```

Применить миграции к существующей базе (без интерактива):

```bash
npx prisma migrate deploy
```

Сброс схемы и данных, полный сценарий миграций — см. [DB_RESET_AND_MIGRATE.md](DB_RESET_AND_MIGRATE.md).

## Запуск приложения

**Режим разработки** (перезапуск при изменении файлов):

```bash
npm run start:dev
```

**Сборка и продакшен-запуск**:

```bash
npm run build
npm run start:prod
```

Порт: **`PORT`** из `.env`, иначе `3000`.

## Документация API (OpenAPI / Swagger)

После запуска сервера откройте в браузере:

```text
http://localhost:<PORT>/api/docs
```

Например, при `PORT=3000`: [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

Swagger подключается в [src/main.ts](src/main.ts) (`SwaggerModule.setup('api/docs', ...)`).

## Тестирование

Команды из [package.json](package.json):

| Команда | Назначение |
|--------|------------|
| `npm test` | unit-тесты (Jest) |
| `npm run test:watch` | unit-тесты в watch-режиме |
| `npm run test:cov` | покрытие кода |
| `npm run test:e2e` | e2e-тесты |
| `npm run lint` | ESLint (с автофиксом по конфигу) |

## Быстрая проверка без браузера

Проверка, что сервер отвечает (корневой маршрут из шаблона Nest):

```bash
curl -s http://localhost:3000/
```

Подставьте свой порт, если `PORT` не `3000`.

## CRUD smoke-tests через `curl`

Ниже — последовательный сценарий проверки REST API (создание → чтение → обновление → удаление) и проверка связей: тег и курс у ссылки, ревью у ссылки.

Перед запуском убедитесь, что сервер запущен (`npm run start:dev`) и база доступна по `DATABASE_URL`.

### Переменные

```bash
export BASE_URL="http://localhost:3000"   # подставьте порт из PORT при необходимости
```

В сценарии ниже `BASE_URL` задаётся внутри блока (`export BASE_URL="${BASE_URL:-http://localhost:3000}"`), так что его можно выполнять отдельно, без предыдущего блока. Приложение подхватывает `.env` из корня проекта через `ConfigModule` (см. [src/app.module.ts](src/app.module.ts)).

### Вариант 1: один скрипт с `jq` (удобно)

Нужен установленный [`jq`](https://stedolan.github.io/jq/) для разбора JSON и сохранения `id`.

Скрипт **сам задаёт** `BASE_URL` и **уникальные** `email` / имена тега и курса (через `RUN_ID`), чтобы повторный запуск не упирался в `409 Conflict` по уникальным полям.

```bash
set -euo pipefail

export BASE_URL="${BASE_URL:-http://localhost:3000}"
RUN_ID="$(date +%s)-$RANDOM"

# --- User ---
USER_JSON=$(curl -sS -X POST "$BASE_URL/api/users" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"curl-test-${RUN_ID}@example.com\",\"firstName\":\"Test\",\"lastName\":\"User\",\"telegramUrl\":\"https://t.me/curl_test\"}")
USER_ID=$(echo "$USER_JSON" | jq -r '.id')
curl -sS "$BASE_URL/api/users?page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/users/$USER_ID" | jq .
curl -sS -X PATCH "$BASE_URL/api/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"TestUpdated"}' | jq .

# --- Tag ---
TAG_JSON=$(curl -sS -X POST "$BASE_URL/api/tags" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"curl-tag-${RUN_ID}\"}")
TAG_ID=$(echo "$TAG_JSON" | jq -r '.id')
curl -sS "$BASE_URL/api/tags?page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/tags/$TAG_ID" | jq .
curl -sS -X PATCH "$BASE_URL/api/tags/$TAG_ID" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"curl-tag-renamed-${RUN_ID}\"}" | jq .

# --- Course ---
COURSE_JSON=$(curl -sS -X POST "$BASE_URL/api/courses" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"SE-${RUN_ID}\",\"code\":\"09.03.04\"}")
COURSE_ID=$(echo "$COURSE_JSON" | jq -r '.id')
curl -sS "$BASE_URL/api/courses?page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/courses/$COURSE_ID" | jq .
curl -sS -X PATCH "$BASE_URL/api/courses/$COURSE_ID" \
  -H "Content-Type: application/json" \
  -d '{"code":"09.03.04-upd"}' | jq .

# --- Link (без review) ---
LINK_JSON=$(curl -sS -X POST "$BASE_URL/api/links" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"linkName\":\"My project\",\"githubPagesUrl\":\"https://user.github.io/repo/\"}")
LINK_ID=$(echo "$LINK_JSON" | jq -r '.id')

# Привязка тега и курса
curl -sS -X POST "$BASE_URL/api/links/$LINK_ID/tags/$TAG_ID" | jq .
curl -sS -X POST "$BASE_URL/api/links/$LINK_ID/courses/$COURSE_ID" | jq .

# Списки с фильтрами
curl -sS "$BASE_URL/api/links?userId=$USER_ID&page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/links?tagId=$TAG_ID&page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/links?courseId=$COURSE_ID&page=1&pageSize=10" | jq .

curl -sS "$BASE_URL/api/links/$LINK_ID" | jq .

# --- Review и привязка к ссылке ---
REVIEW_JSON=$(curl -sS -X POST "$BASE_URL/api/reviews" \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"score\":5,\"comment\":\"OK\"}")
REVIEW_ID=$(echo "$REVIEW_JSON" | jq -r '.id')
curl -sS "$BASE_URL/api/reviews?page=1&pageSize=10" | jq .
curl -sS "$BASE_URL/api/reviews/$REVIEW_ID" | jq .
curl -sS -X PATCH "$BASE_URL/api/links/$LINK_ID" \
  -H "Content-Type: application/json" \
  -d "{\"reviewId\":\"$REVIEW_ID\"}" | jq .
curl -sS -X PATCH "$BASE_URL/api/reviews/$REVIEW_ID" \
  -H "Content-Type: application/json" \
  -d '{"score":4,"comment":"Minor fixes"}' | jq .

# --- Удаление (сначала сущности со связями / дочерние) ---
curl -sS -X DELETE "$BASE_URL/api/links/$LINK_ID/tags/$TAG_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/links/$LINK_ID/courses/$COURSE_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/links/$LINK_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/reviews/$REVIEW_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/users/$USER_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/tags/$TAG_ID" | jq .
curl -sS -X DELETE "$BASE_URL/api/courses/$COURSE_ID" | jq .
```

Ожидаемо: успешные ответы с телом JSON (для `POST` Nest по умолчанию часто отдаёт `200`, при необходимости можно настроить `201` в коде); в конце — удаление сущностей. При ошибке валидации Nest вернёт `400`, конфликт уникальности — `409` (см. фильтр Prisma).

### Вариант 2: без `jq`

Выполняйте запросы по одному; из тела ответа JSON скопируйте поля `id` в переменные окружения:

```bash
export USER_ID="..." TAG_ID="..." COURSE_ID="..." LINK_ID="..." REVIEW_ID="..."
```

Дальше подставляйте их в URL и тела запросов как в варианте 1.

### Примечания

- Скрипт с `RUN_ID` рассчитан на **повторные запуски** без ручной очистки БД. Если вы запускаете старый вариант с фиксированным email/именами, при повторе возможен `409` — уникальные поля: `email`, `name` у тега и курса.
- Заголовок пагинации **`Link`** (prev/next) можно посмотреть так:  
  `curl -sSI "$BASE_URL/api/users?page=2&pageSize=5" | grep -i ^link:`

