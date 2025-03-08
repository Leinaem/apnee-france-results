// Create service client module using ES6 syntax.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_DYNAMO_DB_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_DYNAMO_DB_SECRET_KEY,
  },
});

export { ddbClient };
