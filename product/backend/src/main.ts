import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: "*", // 本番は限定
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
