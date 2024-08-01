import { JwtModuleOptions } from '@nestjs/jwt';

export default function JwtConfig(): JwtModuleOptions {
  return {
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '60s' },
  };
}
