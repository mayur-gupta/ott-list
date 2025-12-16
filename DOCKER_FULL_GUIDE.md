# 🐳 Full Docker Setup (Recommended)

## ✅ Configuration

This is the standard, self-contained setup where everything runs in Docker.

- **API**: Running in Docker (Port 3000)
- **MongoDB**: Running in Docker (Port 27017 internal, **27018** on host)
- **Redis**: Running in Docker (Port 6379)

**Note:** MongoDB is mapped to port **27018** on your PC to avoid conflict if you have a local MongoDB installed on the default port 27017.

---

## 🚀 Quick Start

### 1. Start Everything
```powershell
docker-compose up -d --build
```

### 2. Seed the Database
Since the database is empty on first run, populate it with test data:
```powershell
.\seed-docker.ps1
```

### 3. Test the API
```powershell
.\test-api.ps1
```

---

## 🔍 Access Details

| Service | Host Port | Internal Port | Connection URI |
|---------|-----------|---------------|----------------|
| API | 3000 | 3000 | `http://localhost:3000` |
| MongoDB | **27018** | 27017 | `mongodb://localhost:27018/ott-mylist` |
| Redis | 6379 | 6379 | `localhost:6379` |
| Swagger | 3000 | 3000 | `http://localhost:3000/api-docs` |

---

## 🛠️ Common Commands

**View Logs:**
```powershell
docker-compose logs -f
```

**Restart API:**
```powershell
docker-compose restart app
```

**Stop Everything:**
```powershell
docker-compose down
```

**Check Status:**
```powershell
docker ps
```

---

## 📝 Swagger Documentation

Swagger UI is available at **http://localhost:3000/api-docs** and includes documentation for:
- Health Check
- My List Operations (Add, Remove, List)

---

## 💡 Notes

- If you want to connect to MongoDB using a tool like **Compass** or **Studio 3T**, use port **27018**.
- Your local MongoDB (if installed) can safely run on port 27017 without conflict.
