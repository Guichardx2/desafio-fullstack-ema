//NestJS, Fastify and Swagger imports
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

//App imports
import { AppModule } from './app.module';

//Filters and Interceptors imports
import { ExceptionsFilter } from './filters/err/exceptions.filter';
import { SuccessResponseInterceptor } from './filters/interceptors/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  //Swagger Config
  configureSwagger(app);

  //Validation Pipes
  configureValidationPipes(app);

  //Global Filters
  configureGlobalFilters(app);

  //Global Interceptors
  configureGlobalInterceptors(app);

  //WebSockets Config
  configureWebSockets(app);
  
  //CORS
 const allowedOrigins = [
    'http://localhost:5173',
  ];

  app.enableCors({
    origin: function (origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  //Listening
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

//Swagger Config
/**
 * Configures Swagger for the application.
 * 
 * @param app - The NestJS application instance.
 * 
 * This function sets up Swagger documentation for the API, including its title,
 * description, version, and tags. It also initializes the Swagger UI at the `/api` endpoint.
 */
function configureSwagger(app: INestApplication){
  const config = new DocumentBuilder()
  .setTitle('NestJS Chronos API')
  .setDescription('Chronos API Documentation powered by Guichard')
  .setVersion('1.0')
  .addTag('nestjs')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

//Validation Pipes
/**
 * Configures global validation pipes for the application.
 * 
 * @param app - The NestJS application instance.
 * 
 * Options:
 * - `whitelist`: Strips properties that are not in the DTO.
 * - `forbidNonWhitelisted`: Throws an error if non-whitelisted properties are present.
 * - `transform`: Automatically transforms payloads to match DTO types.
 */
function configureValidationPipes(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
}

//Global Filters
/**
 * Configures global exception filters for the application.
 * 
 * @param app - The NestJS application instance.
 * 
 * This uses a custom `ExceptionsFilter` to handle and format exceptions globally.
 */
function configureGlobalFilters(app: INestApplication) {
  app.useGlobalFilters(new ExceptionsFilter());
}

//Global Interceptors
/**
 * Configures global interceptors for the application.
 * 
 * @param app - The NestJS application instance.
 * 
 * This uses a custom `SuccessResponseInterceptor` to format successful responses globally.
 */
function configureGlobalInterceptors(app: INestApplication) {
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
}

//WebSockets Configuration
/**
 * Configures WebSocket support for the application using Socket.IO.
 * 
 * @param app - The NestJS application instance.
 */
function configureWebSockets(app: INestApplication) {
  app.useWebSocketAdapter(new IoAdapter(app));
}

bootstrap();