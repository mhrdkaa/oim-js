# Migration Guide: Laravel 12 → Next.js 15

Panduan lengkap migrasi dari **Laravel 12 + MySQL** ke **Next.js 15 + PostgreSQL**.

## 📊 Comparison Table

| Aspek                | Laravel 12                  | Next.js 15                    |
|----------------------|-----------------------------|-------------------------------|
| **Language**         | PHP 8.2+                    | TypeScript                    |
| **Framework**        | Laravel                     | Next.js (React)               |
| **Database**         | MySQL/MariaDB               | PostgreSQL                    |
| **ORM**              | Eloquent                    | Prisma                        |
| **Auth**             | Laravel Auth                | NextAuth.js v5                |
| **Session**          | Database Driver             | JWT + Database                |
| **UI**               | Blade + AdminLTE            | React + Tailwind CSS          |
| **Charts**           | Chart.js (jQuery)           | react-chartjs-2               |
| **API**              | Laravel Routes              | Next.js API Routes            |
| **Validation**       | FormRequest                 | Zod                           |
| **Deployment**       | Apache/Nginx + PHP-FPM      | Node.js / Vercel              |

---

## 🗂️ File Structure Mapping

### Laravel 12 → Next.js 15

```
Laravel                               Next.js
├── app/
│   ├── Models/
│   │   ├── User.php              →   types/index.ts (interface)
│   │   └── DataSensor.php        →   types/index.ts
│   ├── Http/Controllers/
│   │   ├── Auth/
│   │   │   └── LoginController   →   app/api/auth/[...nextauth]/route.ts
│   │   ├── DashboardController   →   app/(dashboard)/page.tsx
│   │   ├── UserController        →   app/api/users/route.ts
│   │   └── Api/
│   │       └── SensorController  →   app/api/sensor/*/route.ts
│   ├── Http/Requests/            →   lib/validations.ts (Zod schemas)
│   └── Http/Middleware/
│       └── AdminMiddleware       →   middleware.ts
├── database/
│   ├── migrations/               →   prisma/schema.prisma
│   └── seeders/                  →   prisma/seed.ts
├── resources/views/
│   ├── layouts/
│   │   ├── app.blade.php         →   app/(dashboard)/layout.tsx
│   │   ├── navbar.blade.php      →   components/layout/Navbar.tsx
│   │   └── sidebar.blade.php     →   components/layout/Sidebar.tsx
│   ├── auth/
│   │   └── login.blade.php       →   app/(auth)/login/page.tsx
│   ├── dashboard.blade.php       →   app/(dashboard)/page.tsx
│   ├── sensor/
│   │   ├── riwayat.blade.php     →   app/(dashboard)/riwayat/page.tsx
│   │   └── ringkasan.blade.php   →   app/(dashboard)/ringkasan/page.tsx
│   └── users/
│       ├── index.blade.php       →   app/(dashboard)/users/page.tsx
│       └── edit.blade.php        →   app/(dashboard)/users/[id]/edit/page.tsx
├── routes/
│   ├── web.php                   →   middleware.ts + app/ routing
│   └── api.php                   →   app/api/*/route.ts
├── config/                       →   .env + next.config.ts
└── .env                          →   .env
```

---

## 🔄 Code Migration Examples

### 1. **Model → Prisma Schema**

**Laravel Model (User.php):**
```php
class User extends Authenticatable {
    protected $fillable = ['username', 'nama', 'password', 'role'];
    
    protected $casts = [
        'password' => 'hashed',
    ];
    
    public function isAdmin(): bool {
        return $this->role === 'admin';
    }
}
```

**Prisma Schema (schema.prisma):**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  nama      String
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

enum Role {
  ADMIN
  USER
}
```

---

### 2. **Controller → API Route**

**Laravel Controller:**
```php
class SensorController extends Controller {
    public function latest(): JsonResponse {
        $data = DataSensor::latest('id')->first();
        return response()->json($data);
    }
}
```

**Next.js API Route (app/api/sensor/latest/route.ts):**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.dataSensor.findFirst({
    orderBy: { id: 'desc' },
  });
  
  return NextResponse.json(data);
}
```

---

### 3. **Blade View → React Component**

**Laravel Blade:**
```blade
@extends('layouts.app')

@section('content')
  <h2>Dashboard</h2>
  <div class="small-box">
    <h3 id="ph-value">{{ $latest->ph }}</h3>
    <p>pH Air Coolant</p>
  </div>
@endsection
```

**Next.js React Component:**
```typescript
'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [ph, setPh] = useState(0);
  
  useEffect(() => {
    fetch('/api/sensor/latest')
      .then(res => res.json())
      .then(data => setPh(data.ph));
  }, []);
  
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="bg-blue-500 text-white p-4 rounded">
        <h3>{ph.toFixed(2)}</h3>
        <p>pH Air Coolant</p>
      </div>
    </div>
  );
}
```

---

### 4. **Validation**

**Laravel FormRequest:**
```php
class LoginRequest extends FormRequest {
    public function rules(): array {
        return [
            'username' => 'required|string',
            'password' => 'required|string',
        ];
    }
}
```

**Zod Schema:**
```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

// Usage
const result = loginSchema.safeParse(data);
if (!result.success) {
  console.error(result.error);
}
```

---

### 5. **Authentication**

**Laravel Auth:**
```php
// Login
Auth::attempt(['username' => $username, 'password' => $password]);

// Logout
Auth::logout();

// Check
if (Auth::check()) { }

// User
auth()->user()->nama;
```

**NextAuth.js:**
```typescript
// Login
import { signIn } from 'next-auth/react';
await signIn('credentials', { username, password });

// Logout
import { signOut } from 'next-auth/react';
await signOut();

// Check (client)
import { useSession } from 'next-auth/react';
const { data: session } = useSession();

// User (server)
import { auth } from '@/lib/auth';
const session = await auth();
const nama = session?.user.name;
```

---

### 6. **Middleware**

**Laravel Middleware:**
```php
class AdminMiddleware {
    public function handle(Request $request, Closure $next) {
        if (!auth()->user()->isAdmin()) {
            return redirect('/');
        }
        return $next($request);
    }
}
```

**Next.js Middleware:**
```typescript
import { NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function middleware(request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (request.nextUrl.pathname.startsWith('/users') && session.user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}
```

---

## 🗄️ Database Migration

### MySQL → PostgreSQL

**1. Export data dari MySQL:**
```bash
mysqldump -u root monitoring_ph_air_coolant > backup.sql
```

**2. Convert MySQL → PostgreSQL:**

Tool: `pgloader`
```bash
pgloader mysql://root@localhost/monitoring_ph_air_coolant postgresql://postgres@localhost/monitoring_air_coolant
```

Atau manual:

**MySQL:**
```sql
-- users
INSERT INTO users (username, nama, password, role) VALUES ('admin', 'Administrator', '$2y$...', 'admin');

-- data_sensor
INSERT INTO data_sensor (ph, tds, suhu, waktu) VALUES (7.5, 450, 28, NOW());
```

**PostgreSQL (via Prisma):**
```typescript
// Seed
await prisma.user.create({
  data: {
    username: 'admin',
    nama: 'Administrator',
    password: await bcrypt.hash('admin123', 10),
    role: 'ADMIN',
  },
});

await prisma.dataSensor.create({
  data: {
    ph: 7.5,
    tds: 450,
    suhu: 28,
  },
});
```

---

## 📝 Migration Checklist

### Phase 1: Setup (Week 1)
- [x] Install Node.js 18+
- [x] Install PostgreSQL
- [x] Create Next.js project
- [x] Setup Prisma + schema
- [x] Configure NextAuth
- [x] Setup Tailwind CSS

### Phase 2: Backend (Week 2)
- [x] Create Prisma models
- [x] Seed admin user
- [x] Create API routes (sensor, auth, users)
- [x] Implement validation (Zod)
- [x] Setup middleware

### Phase 3: Frontend (Week 3)
- [x] Create layout components
- [x] Create login page
- [x] Create dashboard page
- [x] Create riwayat & ringkasan pages
- [x] Create user management pages
- [x] Implement charts (Chart.js)

### Phase 4: Testing & Deployment (Week 4)
- [ ] Unit testing API routes
- [ ] Integration testing auth flow
- [ ] E2E testing dengan Playwright
- [ ] Performance testing
- [ ] Deploy to staging
- [ ] ESP32 integration testing
- [ ] Deploy to production

---

## 🚀 Deployment Strategy

### Option 1: Parallel Deployment (Recommended)

1. Deploy Next.js ke subdomain: `next.monitoring.local`
2. Laravel tetap di: `monitoring.local`
3. ESP32 arahkan ke Next.js endpoint
4. Test selama 1 minggu
5. Switch DNS jika OK
6. Deprecate Laravel

### Option 2: Direct Migration

1. Backup Laravel + MySQL
2. Deploy Next.js + PostgreSQL
3. Import data via pgloader
4. Update ESP32 firmware
5. Go live

---

## ⚠️ Breaking Changes

### 1. **Database**
- Auto-increment ID type: `INT` (MySQL) → `SERIAL` (PostgreSQL)
- Enum handling berbeda

### 2. **API Responses**
- Laravel resource wrapping: `{ data: {...} }`
- Next.js direct return: `{...}`

### 3. **Session**
- Laravel: server-side session
- NextAuth: JWT + optional database session

### 4. **File Upload**
- Laravel: `Storage::disk('public')`
- Next.js: `public/` folder atau cloud storage

### 5. **Realtime**
- Laravel: polling atau Laravel Echo (WebSocket)
- Next.js: Server-Sent Events atau WebSocket

---

## 🔍 Performance Comparison

| Metric              | Laravel 12      | Next.js 15        |
|---------------------|-----------------|-------------------|
| First Load          | ~800ms          | ~200ms            |
| API Response        | ~50ms           | ~30ms             |
| Memory Usage        | ~50MB           | ~150MB            |
| Concurrent Users    | 100-500         | 1000-5000         |
| Build Time          | 10s             | 30s               |

---

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js**: https://next-auth.js.org/
- **Tailwind CSS**: https://tailwindcss.com/
- **Chart.js**: https://www.chartjs.org/

---

## ✅ Success Criteria

Migration dianggap berhasil jika:

1. ✅ Semua 13 fitur berfungsi identik
2. ✅ ESP32 bisa kirim data tanpa perubahan firmware
3. ✅ Database PostgreSQL terisi sempurna
4. ✅ Admin login berhasil
5. ✅ Dashboard realtime update setiap 3 detik
6. ✅ Export Excel berfungsi
7. ✅ User management CRUD OK
8. ✅ Performance > Laravel (loading time, API response)

---

© 2026 YKK Group IT Team
