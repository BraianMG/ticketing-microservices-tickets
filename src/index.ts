import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from '../nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  try {
    await natsWrapper.connect('ticketing', 'adasd', 'http://nats-srv:4222'); // here it is "ticketing" because that is how we define it in the arguments of the NATS deployment file in the infra submodule
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!');
  });
}

start();