import request from 'supertest';
import { app } from "../../app";

it('returns a 404 if the ticket is not found', async () => {
  await request(app)
    .get('/api/ticket/1234-123-1234')
    .send()
    .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'Title';
  const price = 20;

  const response = await request(app)
    .get('/api/ticket/')
    .set('Cookie', global.signupAndGetCookie())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/ticket/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
