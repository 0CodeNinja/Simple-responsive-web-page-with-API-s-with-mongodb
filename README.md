# 🗄️ DecodeLabs — Project 3: Database Integration

**Batch 2026 | Node.js + Express + MongoDB + Mongoose**

---

## ✅ Requirements Covered

| Brief Requirement         | Implementation                          |
|---------------------------|-----------------------------------------|
| Design database schema    | Mongoose schemas with types & constraints |
| CRUD operations           | Create, Read, Update, Delete via Mongoose |
| Data integrity            | required, unique, enum, minlength, maxlength |
| SQL Injection protection  | Mongoose parameterized queries (no raw SQL) |
| ORM vs Native Driver      | Using Mongoose ORM                      |
| Relationships             | User ↔ Contact (1:Many design)          |
| Pagination                | page & limit query parameters           |

---

## ⚡ Setup (3 Steps)

### Step 1 — Get Free MongoDB Atlas
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Sign up free
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### Step 2 — Add to .env file
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buildflow
PORT=3000
```

### Step 3 — Run
```bash
npm install
npm start
```

Open: **http://localhost:3000**

---

## 📁 Project Structure

```
project3/
├── server.js          ← Main server + DB connection
├── .env               ← MongoDB URI (secret)
├── package.json
├── models/
│   ├── User.js        ← User schema (Pillar 1: Blueprint)
│   └── Contact.js     ← Contact schema
├── routes/
│   ├── users.js       ← Full CRUD endpoints
│   └── contacts.js    ← Contact endpoints
└── public/
    └── index.html     ← Frontend (P1+P2+P3 combined)
```

---

## 🔗 API Endpoints

| Method | Endpoint                    | DB Operation  |
|--------|-----------------------------|---------------|
| GET    | /api/users                  | find()        |
| GET    | /api/users?search=sara      | find($regex)  |
| GET    | /api/users?page=1&limit=8   | find().skip() |
| GET    | /api/users/:id              | findById()    |
| POST   | /api/users                  | new().save()  |
| PUT    | /api/users/:id              | findByIdAndUpdate() |
| DELETE | /api/users/:id              | findByIdAndDelete() |
| POST   | /api/contacts               | new().save()  |
| GET    | /api/contacts               | find()        |
| PATCH  | /api/contacts/:id/read      | findByIdAndUpdate() |
| GET    | /api/stats                  | countDocuments() |

---

Built with ❤️ for **DecodeLabs Internship 2026**
