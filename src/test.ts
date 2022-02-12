import AWS, { DynamoDB } from 'aws-sdk';

const client = new DynamoDB({
  region: process.env.REGION,
  endpoint: 'http://localhost:8000',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const tableName = 'Payments';

const params = {
  TableName : tableName,
  KeySchema : [
    { AttributeName: 'Id', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'Id', AttributeType: 'N'}
  ]
};

client.createTable(params, (err, data) => {
  if (err) {
    console.error('Error creating table:', JSON.stringify(err, null, 2));
  } else {
    console.log(`Created table ${tableName} successfully.`);
    console.log('Description:', JSON.stringify(data, null, 2));
  }
});