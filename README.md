## 📘 `README.md` — Nest Doc Manager

A modular **NestJS backend** for:

- 🔐 User authentication (JWT-based)
- 📁 Document upload & management
- 🔄 Ingestion control (mocked Python backend)
- 🎯 Role-based access: `admin`, `editor`, `viewer`

---

## 🚀 Prerequisites

Before starting:

- ✅ Node.js (v18+)
- ✅ npm (v9+)
- ✅ PostgreSQL
- ✅ Git (optional)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/playgude2/nest-doc-manager.git
cd nest-doc-manager
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file:

```bash
touch .env
```

Paste the following:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=nest_doc_manager
JWT_SECRET=supersecretkey
```

---

## 🧱 Folder Structure

```
nest-doc-manager/
├── src/
│   ├── auth/         → Login, Register, JWT, Role guards
│   ├── users/        → Admin-only user management
│   ├── documents/    → Upload, update, delete, retrieve
│   ├── ingestion/    → Ingestion trigger/status with mocked Python backend
│   ├── database/     → TypeORM setup & data-source
│   ├── config/       → App-wide configuration
│   ├── common/       → Guards, decorators, shared utilities
│   └── main.ts       → App entry point
├── test/             → Unit tests
├── .env              → Environment config
├── jest.config.js    → Test config
├── Dockerfile        → Docker build (optional)
└── README.md
```

---

## 🛠 Database Setup (PostgreSQL)

### 1️⃣ Create the Database

```sql
CREATE DATABASE nest_doc_manager;
```

> 💡 Ensure your PostgreSQL credentials in `.env` match local setup.

---

## 🧪 Running the App

### Start the Dev Server

```bash
npm run start
```

or with hot reload:

```bash
npm run dev
```

App will be live at:

```
http://localhost:3000
```

---

## 🧬 API Docs with Swagger

Visit:

```
http://localhost:3000/api
```

You'll find:

- 🔐 JWT Bearer Auth
- ✍️ Schema validation (DTOs)
- 📘 Role restrictions
- 🧾 Sample inputs & outputs

---

## 👤 Authentication

- `POST /auth/register` → Create account (admin, editor, viewer)
- `POST /auth/login` → Get JWT token

### Example Payload

```json
{
  "email": "admin@example.com",
  "password": "Admin123",
  "role": "admin"
}
```

---

## 👥 User Management

> 🔐 Protected: Admin Only

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`

---

## 📁 Document Management

> 🔐 Roles: Admin, Editor

- `POST /documents` (Upload)
- `GET /documents`
- `GET /documents/:id`
- `PATCH /documents/:id`
- `DELETE /documents/:id`

Supports multipart file uploads (`file` field) and saves metadata in DB.

---

## 🔄 Ingestion (Mocked)

> ✅ Works without actual Python backend

- `POST /ingestion/trigger` → Simulates ingestion request
- `GET /ingestion/status?id=<requestId>` → Status tracking
- `GET /ingestion/embedding/:id` → Mocked embedding array

---

## ✅ Testing

### Unit Tests

```bash
npm run test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:cov
```

Opens `/coverage/lcov-report/index.html` with visual breakdown.

---

## 🐳 Docker Support (Optional)

```bash
docker build -t nest-doc-manager .
docker run -p 3000:3000 nest-doc-manager
```

---

## 📦 Git Workflow

```bash
git init
git remote add origin https://github.com/your-username/nest-doc-manager.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

---

## ❓ Common Errors

| Error | Fix |
|-------|-----|
| `EADDRINUSE:3000` | Kill the process using `lsof -i :3000` |
| `JWT_SECRET missing` | Check your `.env` file |
| `typeorm entity not recognized` | Ensure it's imported in `AppModule` |

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit & push
4. Open pull request 🚀

---

## 📄 License

MIT License © 2024 Pranav Laygude

---

## 🎉 Summary

- 🔐 Secure, modular backend
- 🧪 Fully testable
- 📦 Ready for production or integration
- 🧠 Simulated ingestion microservice
