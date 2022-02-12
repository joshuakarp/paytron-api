import * as dotenv from 'dotenv';
import { DynamoDB } from 'aws-sdk';

function createClient() {
  dotenv.config();
  return new DynamoDB.DocumentClient({
    region: process.env.REGION,
    endpoint: 'http://localhost:8000',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
}

export { createClient };