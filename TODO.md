# Monitoring Air Coolant System - Summary & TODO.md

## 🔧 Teknologi Stack

**Frontend:**
- Next.js 15.5.21 (App Router)
- React 19.0.0 + TypeScript
- Tailwind CSS 3.4.17
- Chart.js + react-chartjs-2 (grafik realtime)

**Backend:**
- Next.js API Routes (Node.js Runtime)
- PostgreSQL via NeonDB (serverless)
- Prisma ORM 6.2.1
- NextAuth.js v5 (Auth.js)

**Validasi & Utility:**
- Zod (validation schemas)
- bcryptjs (password hashing)
- date-fns (date formatting)
- TanStack Query (state management)

**Infrastruktur:**
- Vercel (deployment hosting)
- NeonDB (PostgreSQL serverless)
- Edge Runtime untuk middleware (dibatasi)

## 📁 Struktur Project Lengkap

```
monitoring-air-coolant/
├── app/
│   ├── (auth)/                          # Route group auth
│   │   └── login/
│   │       └── page.tsx                 # Login page UI
│   ├── (dashboard)/                     # Route group dashboard (protected)
│   │   ├── layout.tsx                   # Auth check + sidebar layout
│   │   ├── page.tsx                     # Dashboard utama (real-time charts)
│   │   ├── ganti-password/
│   │   │   └── page.tsx                 # Ganti password user
│   │   ├── profil/
│   │   │   └── page.tsx                 # Edit profil user
│   │   ├── profil-sistem/
│   │   │   └── page.tsx                 # Info sistem hardware
│   │   ├── ringkasan/
│   │   │   └── page.tsx                 # Statistik data
│   │   └── riwayat/
│   │       └── page.tsx                 # Riwayat data sensor
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...]/route.ts           # NextAuth route
│   │   ├── sensor/
│   │   │   ├── chart/route.ts           # GET 50 data untuk chart
│   │   │   ├── kirim/route.ts           # POST data dari ESP32 (GET param)
│   │   │   ├── latest/route.ts          # GET data terbaru
│   │   │   └── riwayat/route.ts         # GET dengan pagination
│   │   └── user/
│   │       ├── ganti-password/route.ts  # PUT ubah password
│   │       └── profil/route.ts           # GET/PUT profil user
│   ├── _not-found.tsx                   # 404 page custom
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page redirect
│   └── providers.tsx                     # React Query provider
├── components/
│   └── layout/
│       ├── Navbar.tsx                   # Navigation bar
│       └── Sidebar.tsx                  # Sidebar menu
├── lib/
│   ├── auth.ts                          # NextAuth configuration
│   ├── prisma.ts                        # Prisma client singleton
│   ├── utils.ts                         # Utility functions
│   └── validations.ts                    # Zod schemas (auth, sensor, user)
├── prisma/
│   ├── schema.prisma                    # Database schema (User, DataSensor)
│   └── seed.ts                          # Seed database dengan admin user
├── public/                              # Static assets
├── types/
│   └── index.ts                         # TypeScript interfaces
├── middleware.ts                        # Edge middleware (tanpa auth)
├── next.config.ts                       # Next.js configuration
├── tailwind.config.ts                   # Tailwind config
├── postcss.config.mjs                   # PostCSS config
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript config
├── .env.example                         # Environment template
├── vercel.json                          # Vercel build config
└── eslint.config.mjs                    # ESLint config (disabled for build)
```

## 🗃️ Database Schema (Prisma)

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  nama      String
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model DataSensor {
  id    Int      @id @default(autoincrement())
  ph    Decimal  @db.Decimal(5, 2)    // 0.00-99.99
  tds   Int                           // ppm
  suhu  Decimal  @db.Decimal(5, 2)    // 0.00-99.99
  waktu DateTime @default(now()) @db.Timestamp(0)

  @@map("data_sensor")
}

enum Role {
  ADMIN @map("admin")
  USER  @map("user")
  @@map("_role")
}
```

## 🔐 Authentication Flow

1. **Middleware**: Hanya filter route public (`/api/sensor/*`, `/login`, `/api/auth`)
2. **Layout Auth**: `app/(dashboard)/layout.tsx` panggil `auth()` untuk check session
3. **Login**: `/login` → `auth.signIn('credentials')`
4. **Credential Provider**: `lib/auth.ts` verify username/password dengan bcrypt
5. **Session**: JWT token dengan `userId` dan `role` di callback

## 📊 Data Flow Sensor

1. **ESP32 → API**: `GET /api/sensor/kirim?ph=7.2&tds=380&suhu=28`
2. **Validation**: Zod schema validate numeric ranges
3. **Database**: Insert ke `DataSensor` via Prisma
4. **Frontend Fetch**: 
   - Dashboard: polling `/api/sensor/latest` setiap 3 detik + `/api/sensor/chart`
   - Riwayat: `/api/sensor/riwayat?page=1&limit=50` dengan pagination server-side
5. **Charts**: Chart.js dengan data reversed (terlama → terbaru)

## ⚙️ Configuration Files

### `next.config.ts`
```typescript
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },    // Skip ESLint di Vercel
  images: { remotePatterns: [] },
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};
export default nextConfig;
```

### `middleware.ts` (Edge Runtime compatible)
```typescript
// Tanpa auth call (karena Edge tidak support bcryptjs/prisma)
// Auth check dilakukan di layout.tsx
export async function middleware(request: NextRequest) {
  // Allow public routes
  if (pathname.startsWith('/api/sensor') || pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  return NextResponse.next(); // Auth check di layout
}
```

### `vercel.json` (Build optimization)
```json
{
  "build": { "env": { "NEXT_PRIVATE_LOCAL_WEBPACK": "1" } },
  "github": { "silent": true }
}
```

## 🔄 Deployment Workflow

1. **Git Push** → Vercel auto-deploy
2. **Environment Variables**:
   ```
   DATABASE_URL="postgresql://...@ep-spring-forest-azgg4rg2-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
   NEXTAUTH_URL="https://your-app.vercel.app"
   NEXTAUTH_SECRET="openssl-generated-secret"
   ```
3. **Build Process**:
   - Install dependencies
   - Skip ESLint (`ignoreDuringBuilds: true`)
   - Compile dengan Node.js runtime (bukan Edge)
   - Generate static pages (18 routes)

## 🎨 UI Components

### Dashboard (`app/(dashboard)/page.tsx`)
- **Metric Cards**: pH, TDS, Suhu, Total Data
- **Realtime Charts**: 3 line charts (pH, TDS, Suhu) dengan polling 3 detik
- **Status System**: Badge warna berdasarkan threshold
- **Export Button**: Placeholder untuk export Excel

### Riwayat Page (`app/(dashboard)/riwayat/page.tsx`)
- **Server-side Pagination**: 50 data per page
- **Table**: dengan warna coding untuk status
- **Search/Filter**: - (TODO: belum implementasi)

### Profil User (`app/(dashboard)/profil/page.tsx`)
- **Form Edit**: Nama lengkap saja (username/role readonly)
- **Password Change**: Link ke `/ganti-password`

### Ganti Password (`app/(dashboard)/ganti-password/page.tsx`)
- **Validation**: Password lama verify, konfirmasi password baru
- **bcrypt**: Hash password baru sebelum simpan

## 🔧 Scripts Available

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production start
npm run prisma:generate  # Generate Prisma client
npm run prisma:push       # Push schema to database
npm run prisma:seed       # Seed admin user + sample data
```

## 📈 Performance (Vercel Build Output)

**Bundle Size**:
- First Load JS: ~103 kB shared
- Dashboard: 69.2 kB
- Middleware: 33.9 kB (setelah remove auth call)

**Routes**:
- ƒ Dynamic (18): API routes + dashboard pages
- ○ Static (2): `/login`, `/_not-found`

**Build Time**: ~60 detik (Vercel free tier)

## ✅ Completed Features

- [x] Authentication system (NextAuth)
- [x] Realtime dashboard dengan chart
- [x] API untuk ESP32 sensor data
- [x] Riwayat data dengan pagination
- [x] Profil user & ganti password
- [x] Vercel deployment dengan NeonDB
- [x] ESLint error fixes (any types, unused vars)
- [x] Edge Runtime compatibility fix (remove auth from middleware)

## 🚀 TODO.md (Rencana Pengembangan)

### Priority High
1. **Optimasi Query Sensor** - Cache Redis/Upstash untuk reduce load NeonDB
2. **Batch Insert ESP32** - Kirim data tiap 10-30 detik, bukan per 3 detik
3. **Export Data Excel** - Implementasi SheetJS untuk export riwayat
4. **Search & Filter** - Tambah search di riwayat page (client-side filtering)

### Priority Medium
5. **Alert System** - Notifikasi jika pH/TDS/Suhu melewati threshold
6. **User Management** - CRUD users untuk admin role
7. **Dashboard Mobile** - Responsive improvement untuk tablet/mobile
8. **Data Retention Policy** - Auto-delete data > 30 hari

### Priority Low
9. **Multi-language** - Indonesia/English toggle
10. **Dark Mode** - Theme switcher
11. **API Documentation** - Swagger/OpenAPI untuk API sensor
12. **Unit Tests** - Jest + Testing Library untuk komponen kritis

### Infrastructure
13. **Monitoring** - Log sensor data ke Google Sheets/Sheets API
14. **Backup Automation** - Auto-backup database ke cloud storage
15. **Rate Limiting** - Protect API dari abuse
16. **WebSocket** - Ganti polling dengan WebSocket untuk real-time yang lebih efisien

### Quick Wins
17. **Loading States** - Skeleton loading untuk charts
18. **Error Boundaries** - Better error handling UI
19. **PWA** - Install sebagai Progressive Web App
20. **Offline Mode** - Cache data untuk akses offline

## 🐛 Known Issues

1. **Edge Runtime Warnings**: bcryptjs/prisma tidak fully compatible dengan Edge
2. **Cold Start NeonDB**: Query pertama bisa 1-3 detik latency
3. **Polling Frequency**: 3 detik mungkin terlalu sering untuk production
4. **Missing Error Pages**: 500 error page belum ada

## 📚 References

- [NeonDB Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Next.js Edge Runtime Compatibility](https://nextjs.org/docs/app/api-reference/edge)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- [Chart.js with Next.js](https://www.chartjs.org/docs/latest/)

---

**Last Updated**: 25 Juli 2026  
**Deployed URL**: https://monitoring-air-coolant.vercel.app  
**GitHub**: https://github.com/mhrdkaa/oim-js  
**Status**: ✅ Production Ready (MVP)
