/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as request from 'supertest';

const API_URL = 'http://localhost:3000';

describe('Articles (e2e, Docker)', () => {
  let jwt: string;

  beforeAll(async () => {
    const res = await request(API_URL)
      .post('/auth/login')
      .send({ login: 'alice', password: 'passworda' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    jwt = res.body.accessToken;
  });

  it('/articles (POST)', async () => {
    const res = await request(API_URL)
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
    const res = await request(API_URL).get('/articles').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title');
  });
});
