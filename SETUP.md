# Setup & Installation Guide

## 📋 Prerequisites

1. **Node.js 18+**
   ```bash
   node -v  # Harus 18.x atau lebih tinggi
   ```

2. **PostgreSQL 14+**
   - Download dari https://www.postgresql.org/download/windows/
   - Atau gunakan Docker:
     ```bash
     docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
     ```

3. **npm/yarn/pnpm**
   ```bash
   npm -v
   ```

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
cd c:\xampp\htdocs\oim\monitoring-air-coolant
npm install
```

**Dependencies yang akan terinstall:**
- Next.js 15 + React 19
- Prisma ORM
- NextAuth.js v5
- Chart.js + react-chartjs-2
- Tailwind CSS
- Zod validation
- TanStack Query

### 2. Setup PostgreSQL Database

**Option A: Via psql CLI**
```bash
psql -U postgres
```

```sql
CREATE DATABASE monitoring_air_coolant;
\q
```

**Option B: Via pgAdmin**
1. Buka pgAdmin
2. Right-click Databases → Create → Database
3. Nama: `monitoring_air_coolant`
4. Save

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/monitoring_air_coolant?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-generated-secret-here"
```

**Generate NEXTAUTH_SECRET:**

PowerShell:
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

Bash/Git Bash:
```bash
openssl rand -base64 32
```

### 4. Setup Database Schema

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database
npm run prisma:push
```

Output yang benar:
```
✔ Generated Prisma Client
✔ Schema pushed to database
```

### 5. Seed Database

```bash
npm run prisma:seed
```

Output:
```
Seeding database...
✓ Admin user created: { id: 1, username: 'admin', ... }
✓ Sample sensor data created: 20 records
```

**Admin credentials:**
- Username: `admin`
- Password: `admin123`

### 6. Run Development Server

```bash
npm run dev
```

Output:
```
   ▲ Next.js 15.1.6
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

Akses: **http://localhost:3000**

---

## 🧪 Testing

### Test API Endpoints

```bash
# Test kirim data (ESP32 compatible)
curl "http://localhost:3000/api/sensor/kirim?ph=7.5&tds=450&suhu=28"
# Response: OK

# Test latest data
curl "http://localhost:3000/api/sensor/latest"
# Response: JSON

# Test chart data
curl "http://localhost:3000/api/sensor/chart"
# Response: JSON array [50 items]
```

### Test Login

1. Buka http://localhost:3000
2. Redirect otomatis ke /login
3. Login dengan `admin` / `admin123`
4. Redirect ke dashboard

### Test Protected Routes

```bash
# Tanpa login → redirect ke /login
curl -I http://localhost:3000/

# Dengan session → OK
# (gunakan browser atau session cookie)
```

---

## 🗄️ Database Management

### Prisma Studio (GUI)

```bash
npx prisma studio
```

Buka http://localhost:5555 → GUI untuk manage database

### Useful Prisma Commands

```bash
# Generate client setelah edit schema
npm run prisma:generate

# Push schema changes ke DB (dev only)
npm run prisma:push

# Create migration (production)
npx prisma migrate dev --name init

# Reset database
npx prisma migrate reset

# View database URL
npx prisma db pull
```

### Manual SQL Access

```bash
psql -U postgres -d monitoring_air_coolant
```

```sql
-- Check tables
\dt

-- View users
SELECT * FROM users;

-- View sensor data
SELECT * FROM data_sensor ORDER BY id DESC LIMIT 10;

-- Stats
SELECT 
  COUNT(*) as total,
  AVG(ph) as avg_ph,
  AVG(tds) as avg_tds,
  AVG(suhu) as avg_suhu
FROM data_sensor;
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**1. Check PostgreSQL running:**
```bash
# Windows Services
Get-Service postgresql*

# Or check port
netstat -an | findstr 5432
```

**2. Check credentials:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/monitoring_air_coolant"
```

**3. Test connection:**
```bash
psql -U postgres -h localhost -d monitoring_air_coolant
```

### Error: "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Error: "Invalid `prisma.user.findUnique()` invocation"

Schema tidak sync dengan database:
```bash
npm run prisma:push
```

### Error: "NextAuth secret is not set"

Generate dan paste ke `.env`:
```bash
openssl rand -base64 32
```

### Error: Port 3000 already in use

```bash
# Find process
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Error: Module not found

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

### Session tidak tersimpan

1. Check `NEXTAUTH_SECRET` di `.env`
2. Check `NEXTAUTH_URL` match dengan URL yang diakses
3. Restart dev server

---

## 🚢 Production Build

### Local Production Test

```bash
# Build
npm run build

# Start production server
npm start
```

### Environment Variables Production

```env
DATABASE_URL="postgresql://user:pass@production-host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-here"
NODE_ENV="production"
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Set environment variables di Vercel Dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Deploy to VPS

```bash
# Clone repo
git clone <repo>
cd monitoring-air-coolant

# Install dependencies
npm install

# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "monitoring-app" -- start
pm2 save
pm2 startup
```

---

## 📊 Performance Tips

### 1. Database Indexing

```sql
CREATE INDEX idx_data_sensor_waktu ON data_sensor(waktu DESC);
CREATE INDEX idx_data_sensor_id ON data_sensor(id DESC);
```

### 2. Enable Prisma Query Optimization

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}
```

### 3. Next.js Production Optimization

```bash
# Static generation untuk halaman static
export const dynamic = 'force-static'

# ISR untuk data yang jarang berubah
export const revalidate = 60
```

---

## 🔐 Security Checklist

- ✅ `NEXTAUTH_SECRET` adalah random strong key
- ✅ PostgreSQL password kuat
- ✅ Database tidak exposed ke public
- ✅ HTTPS enabled di production
- ✅ CORS configured untuk ESP32 IP only
- ✅ Rate limiting untuk API endpoints
- ✅ Input validation dengan Zod
- ✅ SQL injection protected (Prisma ORM)
- ✅ Password hashing (bcrypt)

---

## 📱 ESP32 Integration

Update firmware ESP32:

```cpp
const char* serverName = "http://YOUR_SERVER_IP:3000/api/sensor/kirim";

// Production
const char* serverName = "https://yourdomain.com/api/sensor/kirim";
```

Response yang diharapkan: `"OK"`

---

## 🆘 Support

Jika ada masalah setup, check:
1. Node.js version: `node -v` (harus 18+)
2. PostgreSQL running: `pg_isready`
3. Environment variables: `cat .env`
4. Prisma client generated: `npx prisma generate`
5. Database schema sync: `npx prisma db push`

Atau contact: IT Team YKK Group
