import prisma from '../../prisma/client';
import { hashPassword, comparePassword } from '../../utils/password';
import { signJwt } from '../../utils/jwt';
import { Role } from '@prisma/client';

export async function signup(
  email: string,
  password: string,
  role: Role = Role.USER,          // enum constant, not string
) {
  // enforce uniqueness
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw { status: 409, message: 'Email already in use' };

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const token = signJwt({ id: user.id, role: user.role });
  return { token };
}
