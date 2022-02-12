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

// Delete table if it exists
db.describeTable({ TableName : tableName }, (err, data) => {
  if (err) {
    // Ignore error if it's simply because table doesn't exist
    if (err.name === 'ResourceNotFoundException') {
      return;
    }
    // If some other unexpected error, then handle
    console.error('Error describing table:', JSON.stringify(err, null, 2));
  // Otherwise, if we do have the table, and no exception, then delete it
  } else {
    db.deleteTable({ TableName : tableName }, (err, data) => {
      if (err) {
        console.error('Error deleting table:', JSON.stringify(err, null, 2));
      } else {
        console.log(`Deleted table ${tableName} successfully.`);
        console.log('Description:', JSON.stringify(data, null, 2));
      }
    });
  }
});