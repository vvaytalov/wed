# Wedding Invitation

Одностраничное свадебное приглашение на `React + TypeScript + Vite` с анимациями на `framer-motion` и формой RSVP, которая отправляет ответы в Telegram.

## Команды

```bash
npm run dev
npm run build
npm run lint
```

## Переменные окружения

Создайте `.env` в корне проекта и укажите:

```env
VITE_TG_BOT_TOKEN=your_telegram_bot_token
VITE_TG_CHAT_ID=your_chat_id
```

Без этих переменных форма подтверждения присутствия не сможет отправлять ответы.
