import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const cfg = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins (Vercel, custom domain, localhost) in production
      callback(null, true);
    },
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  if (cfg.get('NODE_ENV') !== 'production') {
    const doc = new DocumentBuilder()
      .setTitle('CollectFlow API').setDescription('Multi-Business Payment Collection Platform').setVersion('1.0')
      .addBearerAuth()
      .addTag('auth').addTag('businesses').addTag('customers')
      .addTag('payment-plans').addTag('payments').addTag('mandates')
      .addTag('webhooks').addTag('reports').addTag('admin')
      .addTag('subscriptions').addTag('support')
      .build();
    SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc));
    console.log(`📖 Swagger: http://localhost:${cfg.get('PORT', 3001)}/api/docs`);
  }

  const port = cfg.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`🚀 CollectFlow API → http://localhost:${port}/api/v1`);
}

bootstrap();
