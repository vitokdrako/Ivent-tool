# 🚀 Інструкція по Deployment Event Tool

## Архітектура

- **Domain**: `event.farforrent.com.ua`
- **Frontend**: Статичні файли (React build)
- **Backend**: Ivent-planner API на порту 8001
- **Database**: Warehouse MySQL
- **Images**: Проксуються з `backrentalhub.farforrent.com.ua`

---

## 📦 Крок 1: Підготовка файлів

### Frontend Build
Файли вже готові в `/app/frontend/build/`:
```bash
# На production сервері створіть директорію
mkdir -p /var/www/event.farforrent.com.ua/

# Скопіюйте build файли (через SCP або Git)
scp -r /app/frontend/build/* user@server:/var/www/event.farforrent.com.ua/
```

### Backend
```bash
# Скопіюйте backend код
scp -r /app/backend/* user@server:/var/www/ivent-planner/backend/

# Встановіть залежності
cd /var/www/ivent-planner/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## ⚙️ Крок 2: Налаштування Backend

### .env файл
Створіть `/var/www/ivent-planner/backend/.env`:
```env
# Database (warehouse)
RH_DB_HOST=farforre.mysql.tools
RH_DB_PORT=3306
RH_DB_USERNAME=farforre_rentalhub
RH_DB_PASSWORD=your_password_here
RH_DB_DATABASE=farforre_rentalhub

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (не потрібен якщо все на одному домені)
CORS_ORIGINS=https://event.farforrent.com.ua

# Production backend для зображень
PRODUCTION_BACKEND_URL=https://backrentalhub.farforrent.com.ua
```

### Запуск через systemd
Створіть `/etc/systemd/system/ivent-planner.service`:
```ini
[Unit]
Description=Ivent Planner Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ivent-planner/backend
Environment="PATH=/var/www/ivent-planner/backend/venv/bin"
ExecStart=/var/www/ivent-planner/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

Запустіть:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ivent-planner
sudo systemctl start ivent-planner
sudo systemctl status ivent-planner
```

---

## 🌐 Крок 3: Налаштування Nginx

Створіть `/etc/nginx/sites-available/event.farforrent.com.ua`:
```nginx
server {
    listen 80;
    server_name event.farforrent.com.ua;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name event.farforrent.com.ua;

    # SSL
    ssl_certificate /etc/letsencrypt/live/event.farforrent.com.ua/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/event.farforrent.com.ua/privkey.pem;

    # Frontend root
    root /var/www/event.farforrent.com.ua;
    index index.html;

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8001/api/;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Frontend routing (для React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кешування статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Активуйте:
```bash
sudo ln -s /etc/nginx/sites-available/event.farforrent.com.ua /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Крок 4: SSL Сертифікат

```bash
# Використовуйте Let's Encrypt
sudo certbot --nginx -d event.farforrent.com.ua
```

---

## ✅ Крок 5: Перевірка

### Backend
```bash
curl https://event.farforrent.com.ua/api/health
# Має повернути: {"status":"ok","timestamp":"..."}
```

### Frontend
```bash
# Відкрийте в браузері
https://event.farforrent.com.ua
```

### Зображення
```bash
curl -I https://event.farforrent.com.ua/api/uploads/products/test.png
# Має проксувати до backrentalhub
```

---

## 🎯 Чому так і без CORS проблем?

**Ключовий момент**: Все працює на одному домені!

- Frontend: `event.farforrent.com.ua/`
- Backend: `event.farforrent.com.ua/api/*`

**Same-origin policy** не блокує, бо домен однаковий.
Nginx просто проксує `/api/*` запити на localhost:8001.

---

## 🐛 Troubleshooting

### Backend не запускається
```bash
# Перевірте логи
sudo journalctl -u ivent-planner -f
```

### Frontend показує білу сторінку
```bash
# Перевірте що build файли на місці
ls -la /var/www/event.farforrent.com.ua/
```

### 502 Bad Gateway
```bash
# Перевірте що backend працює
sudo systemctl status ivent-planner
curl http://localhost:8001/api/health
```

---

## 📝 Важливі файли

- Frontend build: `/var/www/event.farforrent.com.ua/`
- Backend: `/var/www/ivent-planner/backend/`
- Nginx config: `/etc/nginx/sites-available/event.farforrent.com.ua`
- Backend service: `/etc/systemd/system/ivent-planner.service`
- Logs: `sudo journalctl -u ivent-planner`

---

## 🎉 Готово!

Після виконання всіх кроків:
- ✅ Frontend доступний на `https://event.farforrent.com.ua`
- ✅ Backend API на `https://event.farforrent.com.ua/api/*`
- ✅ Зображення проксуються автоматично
- ✅ Без CORS проблем!
