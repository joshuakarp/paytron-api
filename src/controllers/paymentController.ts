import { Payment, StoredPayment, StoredPayments } from '../models/paymentModel';
import { DynamoDB } from 'aws-sdk';

class PaymentController {

  constructor(private readonly client: DynamoDB.DocumentClient) {}
  private readonly tableName = 'Payments';

  public async create(newPayment: Payment): Promise<Payment> {
    // To keep IDs simple, this is simply a millisecond value.
    // Therefore, payments made at the same millisecond will 
    // share the same ID. Based on the simplicity of the API, 
    // this was deemed to be appropriate
    const id = new Date().valueOf();
    await this.client.put({
      TableName: this.tableName,
      Item: {
        id: id,
        amount: newPayment.amount,
        beneficiary: newPayment.beneficiary,
        description: newPayment.description,
      }
    }).promise();
    const stored: StoredPayment = {
      id,
      ...newPayment,
    };
    return stored;
  }

  public async get(id: number): Promise<StoredPayment | undefined> {
    let payment: StoredPayment | undefined;
    const result = await this.client.get({
      TableName: this.tableName,
      Key: { id: id },
    }).promise();
    if (result.Item) {
      payment = result.Item as StoredPayment;
    }
    return payment;
  }

  public async getAll(): Promise<Payment[]> {
    const result = await this.client.scan({
      TableName: this.tableName
    }).promise();
    return result.Items as Payment[];
  }

  public async update(id: number, newDetails: Payment): Promise<StoredPayment | undefined> {
    let updatedPayment: StoredPayment | undefined;
    const result = await this.client.update({
      TableName: this.tableName,
      Key: { id: id },
      UpdateExpression:
        'set #amount = :amount, #beneficiary = :beneficiary, #description = :description',
      ConditionExpression:
        'attribute_exists(id)',
      ExpressionAttributeNames: {
        '#amount': 'amount',
        '#beneficiary': 'beneficiary',
        '#description': 'description',
      },
      ExpressionAttributeValues: {
        ':amount': newDetails.amount.toString(), // dynamodb internally converts to int
        ':beneficiary': newDetails.beneficiary,
        ':description': newDetails.description,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();
    if (result.Attributes) {
      updatedPayment = result.Attributes as StoredPayment;
    }
    return updatedPayment;
  }
}

export { PaymentController };