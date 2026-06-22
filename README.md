# 📚 Library Management System (LMS)

A full-stack **Library Management System** built with a microservices-inspired architecture, featuring a Spring Boot REST API backend and a React.js frontend. Supports user authentication, book browsing, borrowing/returning books, and an admin management panel.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | [Vercel Deployment](https://your-app.vercel.app) |
| ⚙️ Backend API | [Railway Deployment](https://your-railway-url.up.railway.app) |

> Update the URLs above after deploying. See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

---

## ✨ Features

### 👤 User Features
- Register and login with JWT-based authentication
- Browse all books with search and genre filtering
- View book details
- Borrow and return books
- View personal borrow history and active borrows
- Manage user profile

### 🔐 Admin Features
- Manage all users (view, promote/demote roles)
- Add, edit, and delete books
- View all borrowing records (active and historical)
- Admin dashboard with system overview

---

## 🏗️ Architecture

```
library-management-system/
├── back-end/
│   └── services/
│       └── user-service/          # Spring Boot REST API (port 5001)
│           ├── controller/        # AuthController, BookController,
│           │                      # BorrowController, UserController
│           ├── model/             # User, Book, BorrowRecord, Role
│           ├── service/           # Business logic layer
│           ├── repository/        # Spring Data JPA repositories
│           ├── security/          # JWT filter, UserDetailsService
│           ├── payload/           # Request/Response DTOs
│           └── Dockerfile         # Container configuration
│
└── front-end/
    └── lms-client/                # React.js SPA (port 3000)
        ├── src/
        │   ├── components/        # Reusable React components
        │   ├── pages/             # Page-level components
        │   ├── util/              # API constants, helpers
        │   └── ...
        └── vercel.json            # Vercel deployment config
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 21 | Language |
| Spring Boot | 3.2.5 | Web framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | - | ORM / Database access |
| JJWT | 0.12.6 | JWT token generation & validation |
| H2 Database | - | In-memory DB (development) |
| PostgreSQL | - | Relational DB (production) |
| Lombok | - | Boilerplate reduction |
| Maven | - | Build tool |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 16.13 | UI framework |
| React Router DOM | 5.x | Client-side routing |
| Bootstrap | 4.x | CSS framework |
| React Bootstrap | 1.x | Bootstrap React components |
| Font Awesome | 5.x | Icons |
| i18next | 19.x | Internationalization |

### DevOps & Deployment
| Tool | Purpose |
|------|---------|
| Docker | Containerization |
| Railway.app | Backend cloud hosting |
| Vercel | Frontend cloud hosting |
| Spring Boot Actuator | Health monitoring |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/signin` | Login and receive JWT token |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books/search` | Search books |
| `GET` | `/api/books/genres` | Get all genres |
| `GET` | `/api/books/genre/{genre}` | Get books by genre |
| `GET` | `/api/books/{id}` | Get book by ID |
| `POST` | `/api/books` | Add new book *(Admin only)* |
| `PUT` | `/api/books/{id}` | Update book *(Admin only)* |
| `DELETE` | `/api/books/{id}` | Delete book *(Admin only)* |

### Borrowing
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/borrow/{bookId}` | Borrow a book |
| `PUT` | `/api/borrow/return/{borrowId}` | Return a book |
| `GET` | `/api/borrow/my` | Get my borrow history |
| `GET` | `/api/borrow/my/active` | Get my active borrows |
| `GET` | `/api/borrow/all` | All records *(Admin only)* |
| `GET` | `/api/borrow/all/active` | All active borrows *(Admin only)* |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/me` | Get current user profile |
| `GET` | `/api/users` | Get all users *(Admin only)* |

---

## ⚡ Getting Started (Local Development)

### Prerequisites

- **Java 21+** — [Download Eclipse Adoptium](https://adoptium.net/)
- **Node.js 16+** — [Download Node.js](https://nodejs.org/)
- **Maven** (or use the included `mvnw` wrapper)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

---

### 2. Start the Backend

```powershell
cd back-end\services\user-service

# Windows — set JAVA_HOME if needed
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot"

.\mvnw spring-boot:run
```

The API will be available at: **http://localhost:5001**

> **Dev profile** uses H2 in-memory database — no external DB setup required.

---

### 3. Start the Frontend

```powershell
cd front-end\lms-client
npm install
npm start
```

The app will be available at: **http://localhost:3000**

---

### 4. Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | *(register via UI)* | — |

---

## 🐳 Docker

Build and run the backend with Docker:

```bash
cd back-end/services/user-service
docker build -t lms-user-service .
docker run -p 5001:5001 lms-user-service
```

---

## ☁️ Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for full deployment instructions covering:

- 🚂 **Railway** — Backend hosting (free tier)
- ▲ **Vercel** — Frontend hosting (free tier)
- 🐘 **PostgreSQL** — Production database setup
- 🔐 Environment variable configuration

---

## 🔒 Security

- Passwords are hashed using **BCrypt**
- Authentication uses **JWT (JSON Web Tokens)**
- Role-based access control: `ROLE_USER` and `ROLE_ADMIN`
- Protected endpoints require a valid `Authorization: Bearer <token>` header
- CORS is configurable via environment variables

---

## 🧪 Running Tests

```bash
cd back-end/services/user-service
.\mvnw test
```

---

## 📁 Environment Variables

### Backend (`application.properties` / Railway)

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active profile (`dev`/`prod`) | `dev` |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `DATABASE_URL` | PostgreSQL connection URL | H2 in-memory |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins | `http://localhost:3000` |

### Frontend (`.env` / Vercel)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend base URL | `http://localhost:5001` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Habeeb Cycle** — Built with ❤️ using Spring Boot & React

> ⭐ If you found this project helpful, please give it a star on GitHub!