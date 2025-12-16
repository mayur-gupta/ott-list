# ✅ Setup Complete - Redis in Docker, MongoDB on PC

## 🎯 Current Configuration

Your setup now uses:
- ✅ **API** - Running in Docker (port 3000)
- ✅ **Redis** - Running in Docker (port 6379)
- ✅ **MongoDB** - Running on your PC (port 27017)

---

## 🚀 Quick Start

### Step 1: Start MongoDB on Your PC

**Option A: Using PowerShell (Run as Administrator)**
```powershell
Start-Service -Name MongoDB
```

**Option B: Using the start script (Run as Administrator)**
```powershell
.\start-mongodb.ps1
```

**Verify MongoDB is running:**
```powershell
Get-Service -Name MongoDB
Get-NetTCPConnection -LocalPort 27017
```

### Step 2: Containers are Already Running!

Docker containers are already started:
- ✅ ott-mylist-api (API)
- ✅ ott-redis (Redis)

**Check status:**
```powershell
docker ps
```

**If you need to restart:**
```powershell
docker-compose restart app
```

### Step 3: Test the API
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/v1/health -UseBasicParsing | Select-Object -ExpandProperty Content
```

---

## 📊 Architecture

```
┌──────────────────────────────────────┐
│         Docker Containers            │
│                                      │
│  ┌────────────┐    ┌──────────────┐ │
│  │    API     │───▶│    Redis     │ │
│  │  Port 3000 │    │  Port 6379   │ │
│  └─────┬──────┘    └──────────────┘ │
│        │                             │
└────────┼─────────────────────────────┘
         │
         │ host.docker.internal
         ↓
┌────────────────────┐
│   Your Windows PC  │
│                    │
│   MongoDB          │
│   Port 27017       │
└────────────────────┘
```

---

## ✅ Current Status

Run this to check everything:

```powershell
Write-Host "`n=== MongoDB Status ===" -ForegroundColor Cyan
Get-Service -Name MongoDB

Write-Host "`n=== Docker Containers ===" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n=== API Health Check ===" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/api/v1/health -UseBasicParsing
    Write-Host "✅ API is healthy!" -ForegroundColor Green
    $response.Content
} catch {
    Write-Host "❌ API is not responding" -ForegroundColor Red
    Write-Host "Make sure MongoDB is running!" -ForegroundColor Yellow
}
```

---

## 🔧 Common Commands

### MongoDB
```powershell
# Start (Run as Administrator)
Start-Service -Name MongoDB

# Stop
Stop-Service -Name MongoDB

# Status
Get-Service -Name MongoDB

# Check if listening
Get-NetTCPConnection -LocalPort 27017
```

### Docker
```powershell
# View all containers
docker ps

# View logs
docker logs ott-mylist-api -f
docker logs ott-redis -f

# Restart API (if MongoDB was started after Docker)
docker-compose restart app

# Stop all
docker-compose down

# Start all
docker-compose up -d
```

### Testing
```powershell
# Run all tests
.\test-api.ps1

# Quick health check
Invoke-WebRequest -Uri http://localhost:3000/api/v1/health -UseBasicParsing
```

---

## 🐛 Troubleshooting

### API Container Keeps Restarting

**Cause:** MongoDB is not running on your PC

**Solution:**
```powershell
# 1. Start MongoDB (as Administrator)
Start-Service -Name MongoDB

# 2. Restart the API container
docker-compose restart app

# 3. Check logs
docker logs ott-mylist-api -f
```

### MongoDB Service Won't Start

**Solution 1: Run as Administrator**
```powershell
# Right-click PowerShell → Run as Administrator
Start-Service -Name MongoDB
```

**Solution 2: Use the start script**
```powershell
.\start-mongodb.ps1
```

**Solution 3: Check logs**
```powershell
Get-Content "C:\Program Files\MongoDB\Server\8.2\log\mongod.log" -Tail 50
```

### Can't Connect to API

**Check all services:**
```powershell
# MongoDB
Get-Service -Name MongoDB

# Docker containers
docker ps

# API logs
docker logs ott-mylist-api --tail 50
```

---

## 📝 Complete Startup Sequence

**Every time you want to run the application:**

1. **Start MongoDB** (Run PowerShell as Administrator):
   ```powershell
   Start-Service -Name MongoDB
   ```

2. **Start Docker** (if not already running):
   ```powershell
   docker-compose up -d
   ```

3. **Test**:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3000/api/v1/health -UseBasicParsing
   ```

---

## 🎯 Next Steps

**Right now, you need to:**

1. ✅ **Start MongoDB** (Run PowerShell as Administrator):
   ```powershell
   Start-Service -Name MongoDB
   ```

2. ✅ **Restart the API container**:
   ```powershell
   docker-compose restart app
   ```

3. ✅ **Test the API**:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3000/api/v1/health -UseBasicParsing
   ```

---

**The containers are running, just waiting for MongoDB! 🚀**
