import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
});

export const changePasswordSchema = z.object({
  password_lama: z.string().min(1, 'Password lama harus diisi'),
  password_baru: z.string().min(6, 'Password baru minimal 6 karakter'),
  konfirmasi_password: z.string(),
}).refine((data) => data.password_baru === data.konfirmasi_password, {
  message: 'Konfirmasi password tidak cocok',
  path: ['konfirmasi_password'],
});

// User schemas
export const createUserSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  nama: z.string().min(1, 'Nama harus diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['ADMIN', 'USER'], { required_error: 'Role harus dipilih' }),
});

export const updateUserSchema = z.object({
  username: z.string().min(1, 'Username harus diisi'),
  nama: z.string().min(1, 'Nama harus diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'USER'], { required_error: 'Role harus dipilih' }),
});

export const updateProfilSchema = z.object({
  nama: z.string().min(1, 'Nama harus diisi').max(255, 'Nama maksimal 255 karakter'),
});

// Sensor schemas
export const sensorDataSchema = z.object({
  ph: z.coerce.number().min(0, 'pH minimal 0').max(14, 'pH maksimal 14'),
  tds: z.coerce.number().int('TDS harus integer').min(0, 'TDS minimal 0').max(9999, 'TDS maksimal 9999'),
  suhu: z.coerce.number().min(0, 'Suhu minimal 0').max(100, 'Suhu maksimal 100'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfilInput = z.infer<typeof updateProfilSchema>;
export type SensorDataInput = z.infer<typeof sensorDataSchema>;
