import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

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

it('returns a 401 if the user does not own the ticket', async () => {});

it('returns a 401 if the user provides an invalid title or price', async () => {});

it('updates the ticket provided valid inputs', async () => {});