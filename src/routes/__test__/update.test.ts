import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const title = 'Title 1';
const price = 20;

it('returns a 404 if the provided ID does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signupAndGetCookie())
    .send({ title, price })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', global.signupAndGetCookie())
    .send({ title, price })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signupAndGetCookie())
    .send({ title, price })
    .expect(401)
});

it('returns a 401 if the user provides an invalid title or price', async () => {
  const cookie = global.signupAndGetCookie();
  const invalidTitle = '';
  const invalidPrice = -20;

  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({ title, price })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ invalidTitle, price })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, invalidPrice })
    .expect(400)
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signupAndGetCookie();
  const newTitle = 'New Title';
  const newPrice = 10;

  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({ title, price })
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send()

    expect(ticketResponse.body.title).toEqual(newTitle);
    expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
  const cookie = global.signupAndGetCookie();
  const newTitle = 'New Title';
  const newPrice = 10;

  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({ title, price })
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})