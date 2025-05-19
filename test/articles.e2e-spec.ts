/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as bcrypt from 'bcrypt';

describe('Articles (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);

    const password = await bcrypt.hash('test123', 10);
    const user = await prisma.user.create({
      data: {
        login: 'borivoj',
        password,
      },
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: user.login, password: 'test123' });
    const { accessToken } = res.body as { accessToken: string };
    jwt = accessToken;
  });

  afterAll(async () => {
    await prisma.vote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  it('/articles (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/articles')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        title: 'First Article',
        perex: 'This is the intro',
        content: 'This is the full content',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('First Article');
  });

  it('/articles (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/articles').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title');
  });
});
