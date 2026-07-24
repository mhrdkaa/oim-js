// User types
export interface User {
  id: number;
  username: string;
  nama: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

// Sensor data types
export interface SensorData {
  id: number;
  ph: number;
  tds: number;
  suhu: number;
  waktu: Date;
}

// Stats types
export interface SensorStats {
  avg_ph: number;
  min_ph: number;
  max_ph: number;
  avg_tds: number;
  min_tds: number;
  max_tds: number;
  avg_suhu: number;
  min_suhu: number;
  max_suhu: number;
  total: number;
}

// Auth types extension for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

