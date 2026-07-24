# Monitoring Air Coolant - Next.js 15 + PostgreSQL

Sistem monitoring realtime pH, TDS, dan Suhu air coolant mesin Wasino SE-52N2 menggunakan **Next.js 15**, **React 19**, dan **PostgreSQL**.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Auth.js)
- **UI**: Tailwind CSS + shadcn/ui components
- **Charts**: Chart.js + react-chartjs-2
- **State Management**: React Query (TanStack Query)
- **Validation**: Zod
- **Forms**: React Hook Form

## 📋 Fitur Lengkap

### 1. **Authentication**
- ✅ Login dengan username/password
- ✅ Session management dengan NextAuth.js
- ✅ Protected routes middleware
- ✅ Role-based access control (Admin/User)

### 2. **Dashboard Realtime**
- ✅ Metric cards: pH, TDS, Suhu, Total Data
- ✅ 3 grafik Chart.js realtime (update setiap 3 detik)
- ✅ Status sistem dengan badge warna
- ✅ Export data ke Excel (SheetJS)

### 3. **Riwayat Data**
- ✅ Tabel data sensor dengan server-side pagination
- ✅ Badge warna untuk setiap parameter
- ✅ Format waktu Indonesia

### 4. **Ringkasan Statistik**
- ✅ AVG, MIN, MAX untuk pH, TDS, Suhu
- ✅ Total record count

### 5. **Profil Sistem**
- ✅ Informasi sistem lengkap
- ✅ Spesifikasi sensor dan hardware

### 6. **Profil User**
- ✅ Edit nama user
- ✅ Display username dan role (readonly)

### 7. **Ganti Password**
- ✅ Verifikasi password lama
- ✅ Konfirmasi password baru
- ✅ Bcrypt hashing

### 8. **Kelola User (Admin Only)**
- ✅ CRUD lengkap untuk user
- ✅ Statistik user (total, admin, user)
- ✅ Self-delete prevention
- ✅ Unique username validation

### 9. **API Sensor (Tanpa Auth untuk ESP32)**
- ✅ `GET /api/sensor/kirim?ph=7.2&tds=380&suhu=28`
- ✅ `GET /api/sensor/latest`
- ✅ `GET /api/sensor/chart`
- ✅ Validation untuk semua parameter

## 🛠️ Installation

### Prerequisites
- Node.js 18+ dan npm/yarn/pnpm
- PostgreSQL 14+ running
- Git

### Step 1: Clone/Extract Project
```bash
cd c:\xampp\htdocs\oim
# Project sudah ada di monitoring-air-coolant/
```

### Step 2: Install Dependencies
```bash
cd monitoring-air-coolant
npm install
```

### Step 3: Setup PostgreSQL Database
```sql
-- Buka psql atau pgAdmin, jalankan:
CREATE DATABASE monitoring_air_coolant;
```

### Step 4: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/monitoring_air_coolant?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-generate-with-openssl"
```

Generate secret:
```bash
openssl rand -base64 32
```

### Step 5: Setup Database Schema
```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke PostgreSQL
npm run prisma:push

# Seed database (admin user + sample data)
npm run prisma:seed
```

### Step 6: Run Development Server
```bash
npm run dev
```

Akses: **http://localhost:3000**

Login default:
- Username: `admin`
- Password: `admin123`

## 📁 Struktur Folder

```
monitoring-air-coolant/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Authenticated layout
│   │   ├── page.tsx                  # Dashboard realtime
│   │   ├── riwayat/
│   │   │   └── page.tsx              # Riwayat data sensor
│   │   ├── ringkasan/
│   │   │   └── page.tsx              # Statistik
│   │   ├── profil/
│   │   │   └── page.tsx              # Edit profil user
│   │   ├── profil-sistem/
│   │   │   └── page.tsx              # Info sistem (static)
│   │   ├── ganti-password/
│   │   │   └── page.tsx              # Change password
│   │   └── users/
│   │       ├── page.tsx              # List users (admin)
│   │       └── [id]/edit/page.tsx    # Edit user (admin)
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts  # NextAuth API
│   │   ├── sensor/
│   │   │   ├── kirim/route.ts          # ESP32 kirim data
│   │   │   ├── latest/route.ts         # Data terbaru
│   │   │   └── chart/route.ts          # Data untuk chart
│   │   ├── users/
│   │   │   ├── route.ts                # GET, POST users
│   │   │   └── [id]/route.ts           # PUT, DELETE user
│   │   └── profil/
│   │       └── route.ts                # Update profil
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Tailwind styles
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── ChartCard.tsx
│   │   └── StatusTable.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Navbar.tsx
│   └── forms/
│       ├── LoginForm.tsx
│       └── UserForm.tsx
├── lib/
│   ├── prisma.ts                       # Prisma client singleton
│   ├── auth.ts                         # NextAuth config
│   ├── utils.ts                        # Helper functions
│   └── validations.ts                  # Zod schemas
├── types/
│   └── index.ts                        # TypeScript types
├── prisma/
│   ├── schema.prisma                   # Database schema
│   └── seed.ts                         # Seeder
├── public/
│   └── images/
│       └── ykk-logo.png
├── middleware.ts                       # Auth middleware
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── package.json
└── README.md
```

## 🔌 ESP32 Integration

Update firmware ESP32 dengan base URL baru:

```cpp
// Development
String serverName = "http://192.168.1.100:3000/api/sensor/kirim";

// Production (setelah deploy)
String serverName = "https://yourdomain.com/api/sensor/kirim";
```

**API Endpoints ESP32:**
```
GET /api/sensor/kirim?ph=7.5&tds=450&suhu=28  → Response: "OK"
GET /api/sensor/latest                         → JSON
GET /api/sensor/chart                          → JSON
```

## 🔐 Authentication Flow

1. User akses halaman protected → redirect ke `/login`
2. Submit login form → POST `/api/auth/signin`
3. NextAuth verify credentials via Prisma
4. Session disimpan (database strategy)
5. User redirect ke dashboard
6. Setiap request, middleware cek session
7. Logout → POST `/api/auth/signout`

## 🗄️ Database Schema (PostgreSQL)

```sql
-- users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- data_sensor table
CREATE TABLE data_sensor (
    id SERIAL PRIMARY KEY,
    ph DECIMAL(5, 2) NOT NULL,
    tds INTEGER NOT NULL,
    suhu DECIMAL(5, 2) NOT NULL,
    waktu TIMESTAMP DEFAULT NOW()
);

-- sessions table (NextAuth)
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    expires TIMESTAMP NOT NULL
);
```

## 🚢 Production Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2: VPS/Cloud
```bash
# Build production
npm run build

# Start production server
npm start
```

**Environment Variables Production:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
```

## 🧪 Testing API

```bash
# Test kirim data
curl 'http://localhost:3000/api/sensor/kirim?ph=7.5&tds=450&suhu=28'

# Test latest data
curl 'http://localhost:3000/api/sensor/latest'

# Test chart data
curl 'http://localhost:3000/api/sensor/chart'
```

## 📦 Build Commands

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Lint
npm run lint

# Database
npm run prisma:generate      # Generate Prisma Client
npm run prisma:push          # Push schema to DB
npm run prisma:seed          # Seed database
npx prisma studio            # Open Prisma Studio GUI
```

## 🔧 Troubleshooting

### Error: Cannot connect to database
```bash
# Check PostgreSQL running
pg_isready

# Check connection string di .env
DATABASE_URL="postgresql://..."
```

### Error: Prisma Client not generated
```bash
npm run prisma:generate
```

### Error: Session tidak tersimpan
```bash
# Pastikan tabel sessions ada
npx prisma db push
```

## 📝 Migration dari Laravel

Aplikasi ini adalah **migrasi lengkap** dari Laravel 12 + MySQL ke Next.js 15 + PostgreSQL dengan fitur-fitur identik:

| Laravel 12                  | Next.js 15                          |
|-----------------------------|-------------------------------------|
| Blade Templates             | React Server/Client Components      |
| Laravel Auth                | NextAuth.js v5                      |
| Eloquent ORM                | Prisma ORM                          |
| MySQL                       | PostgreSQL                          |
| PHP Sessions                | NextAuth Sessions                   |
| Laravel Validation          | Zod + React Hook Form               |
| AdminLTE UI                 | Tailwind CSS + shadcn/ui            |
| jQuery + Chart.js           | React + react-chartjs-2             |

## 📄 License

© 2026 YKK Group. All rights reserved.
