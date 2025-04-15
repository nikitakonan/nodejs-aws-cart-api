import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    ConfigModule.forRoot({
      envFilePath: [
        // '.env.development',
        //
        '.env',
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV');
        const host = configService.get('PG_HOST');
        const isDev = nodeEnv === 'development';
        const synchronize = isDev;
        console.log(`Database for ${nodeEnv} at ${host}`);
        console.log(`Syncing is ${synchronize ? 'on' : 'off'}`);
        return {
          type: 'postgres',
          host,
          port: Number(configService.get('PG_PORT')),
          username: configService.get('PG_USER'),
          password: configService.get('PG_PASSWORD'),
          database: configService.get('PG_DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize,
          ssl: !isDev,
          extra: isDev
            ? undefined
            : {
                ssl: {
                  rejectUnauthorized: false,
                },
              },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
