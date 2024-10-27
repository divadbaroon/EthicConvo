"use server";

import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
  dbName: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
    dbName: null,
  };
}

export const connectToDatabase = async () => {
  const dbName = 'juno';

  if (cached.conn && cached.dbName === dbName) {
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL');
  }

  cached.promise = mongoose.connect(MONGODB_URL, {
    dbName,
    bufferCommands: false,
  });

  cached.conn = await cached.promise;
  cached.dbName = dbName;

  return cached.conn;
};