# TaskMate MERN project

Client: React 18 / Vite. Server: Express 4 / Node.js + MongoDB/Mongoose; JSON Web Token auth using bcrypt password hashes.

From separate terminals:

```bash
cd server
cp .env.example .env
# edit .env for MongoDB URL and a random JWT_SECRET of at least 32 characters
npm install
npm run dev
```

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

URLs: frontend http://localhost:5173, backend health http://localhost:5000/api/health.

Endpoints:

| Verb | Path | Auth | Description |
|---|---|---|---|
| GET | /api/health | No | health status |
| POST | /api/auth/register | No | Create user (user CRUD C) |
| POST | /api/auth/login | No | JWT login |
| GET | /api/users/me | Yes | Read my user (R) |
| PUT | /api/users/me | Yes | Update own user (U) |
| DELETE | /api/users/me | Yes | Delete own user (D) and their tasks |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks | Yes | List my tasks |
| GET | /api/tasks/:id | Yes | Read one of my tasks |
| PUT | /api/tasks/:id | Yes | Update one of my tasks |
| DELETE | /api/tasks/:id | Yes | Delete one of my tasks |

Use `Authorization: Bearer <token>` on protected endpoints. Owner matching prevents cross-user task access. UI stores JWT in localStorage for the classroom prototype; for production use secure HTTP-only cookie flow and additional protections.

There is no hard-coded database password or production secret. `.env` files must never be committed. Review the associated Postman collection for functional test cases and complete the test results yourselves.
