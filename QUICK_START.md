# Quick Start Guide

## ⚡ Setup Cepat (5 Menit)

### 1. Install PostgreSQL

**Download:**
https://www.postgresql.org/download/windows/

**Atau via Chocolatey:**
```powershell
choco install postgresql
```

**Atau via Docker:**
```bash
docker run --name postgres -e POSTGRES_PASSWORD=admin123 -p 5432:5432 -d postgres:14
```

### 2. Buat Database

**Via psql:**
```bash
# Login
psql -U postgres

# Create database
CREATE DATABASE monitoring_air_coolant;

# Exit
\q
```

**Via pgAdmin:**
1. Buka pgAdmin
2. Right-click Databases → Create → Database
3. Name: `monitoring_air_coolant`
4. Save

### 3. Setup Environment

```bash
cd c:\xampp\htdocs\oim\monitoring-air-coolant

# Copy .env
cp .env.example .env
```

**Edit `.env`:**
```env
# Sesuaikan username & password PostgreSQL Anda
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/monitoring_air_coolant?schema=public"

NEXTAUTH_URL="http://localhost:3000"

# Generate secret (jalankan command di bawah)
NEXTAUTH_SECRET="paste-hasil-generate-disini"
```

**Generate SECRET:**
```powershell
# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

Atau:
```bash
# Git Bash
openssl rand -base64 32
```

### 4. Install Dependencies

```bash
npm install
```

**Expected time:** ~2 menit (tergantung koneksi internet)

### 5. Setup Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke PostgreSQL
npm run prisma:push
```

**Output yang benar:**
```
✔ Generated Prisma Client
✔ The database is now in sync with the Prisma schema.
```

### 6. Seed Database

```bash
npm run prisma:seed
```

**Output:**
```
Seeding database...
✓ Admin user created: { id: 1, username: 'admin', nama: 'Administrator', role: 'ADMIN' }
✓ Sample sensor data created: 20 records
```

### 7. Run Development Server

```bash
npm run dev
```

**Output:**
```
  ▲ Next.js 15.1.6
  - Local:        http://localhost:3000
  
  ✓ Compiled in 2.5s
  ✓ Ready in 3s
```

### 8. Login

Buka browser: **http://localhost:3000**

**Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 🧪 Test API

```bash
# Test kirim data (ESP32 compatible)
curl "http://localhost:3000/api/sensor/kirim?ph=7.5&tds=450&suhu=28"
# Response: OK

# Test latest data
curl "http://localhost:3000/api/sensor/latest"
# Response: {"id":21,"ph":7.5,"tds":450,"suhu":28,"waktu":"2026-07-25T..."}

# Test chart data (50 items)
curl "http://localhost:3000/api/sensor/chart"
# Response: [{...}, {...}, ...]
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to database"

**1. Check PostgreSQL running:**
```powershell
# Windows Services
Get-Service -Name postgresql*

# Atau cek port
netstat -an | findstr 5432
```

**2. Test connection:**
```bash
psql -U postgres -h localhost
# Masukkan password
```

**3. Check DATABASE_URL di .env:**
```env
# Format:
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public

# Contoh:
postgresql://postgres:admin123@localhost:5432/monitoring_air_coolant?schema=public
```

### Error: "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Error: "Invalid `prisma...` invocation"

Schema belum sync:
```bash
npm run prisma:push
```

### Error: "NextAuth secret not set"

Generate dan tambahkan ke `.env`:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

### Error: Port 3000 already in use

```bash
# Find & kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Dependencies installation failed

```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📊 Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Akses: **http://localhost:5555**

GUI untuk manage database (view, edit, delete data)

---

## 🚀 Next Steps

Setelah setup berhasil:

1. **Test semua API endpoints** dengan curl atau Postman
2. **Check database** via Prisma Studio atau pgAdmin
3. **Mulai develop frontend pages** (dashboard, riwayat, dll)
4. **Update ESP32 firmware** dengan endpoint baru

---

## 📱 Update ESP32 Firmware

Ganti URL di firmware ESP32:

```cpp
// Before (Laravel)
String serverName = "http://192.168.1.100/oim/iot/public/api/sensor/kirim";

// After (Next.js)
String serverName = "http://192.168.1.100:3000/api/sensor/kirim";
```

Response tetap sama: `"OK"`

---

## ✅ Checklist Setup

- [ ] PostgreSQL installed & running
- [ ] Database `monitoring_air_coolant` created
- [ ] `.env` configured (DATABASE_URL, NEXTAUTH_SECRET)
- [ ] `npm install` berhasil
- [ ] `npm run prisma:generate` ✓
- [ ] `npm run prisma:push` ✓
- [ ] `npm run prisma:seed` ✓
- [ ] `npm run dev` running
- [ ] Login http://localhost:3000 berhasil
- [ ] API `/api/sensor/kirim` test OK
- [ ] API `/api/sensor/latest` test OK
- [ ] API `/api/sensor/chart` test OK

---

## 🆘 Need Help?

1. Check **SETUP.md** untuk detail lengkap
2. Check **MIGRATION_GUIDE.md** untuk perbandingan Laravel vs Next.js
3. Check logs di terminal (`npm run dev`)
4. Check browser console (F12)
5. Check PostgreSQL logs

---

**Happy Coding! 🎉**

© 2026 YKK Group IT Team
