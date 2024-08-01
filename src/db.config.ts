import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function buildDbConfig(): TypeOrmModuleOptions {
    return {
        type: 'postgres',
        url: process.env.DB_POSTGRES_URL,
        ssl: true,
        extra: { ssl: { rejectUnauthorized: false } },
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.DB_SYNC == 'true',
    };
}

export const DB_CONFIG = buildDbConfig();