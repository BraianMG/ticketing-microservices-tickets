import request from 'supertest';
import { app } from '../../app';

it('has a route listening to POST /api/tickets', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({});

  expect(response.statusCode).not.toEqual(404);
});

it('can only be accessed ifthe user is signed in', async () => {});

it('returns an error if an invalid title is provided', async () => {});

it('returns an error f an invalid price is provided', async () => {});

it('creates a ticket with valid inputs', async () => {});
