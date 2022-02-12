import * as dotenv from 'dotenv';
import { DynamoDB } from 'aws-sdk';

dotenv.config();

// Set up the database
const db = new DynamoDB({
  region: process.env.REGION,
  endpoint: 'http://localhost:8000',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const tableName = 'Payments';

const params = {
  TableName : tableName,
  KeySchema : [
    { AttributeName: 'id', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'N'}
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
};

// Create the table
db.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', JSON.stringify(err, null, 2));
  } else {
    console.log(`Created table ${tableName} successfully.`);
    console.log('Description:', JSON.stringify(data, null, 2));
  }
});