// Config.
import { ddbClient } from './dbconfig';
import { ddbDocClient } from "./ddbDocClient";

// Required AWS SDK clients and commands.
import { ListTablesCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import {
  ScanCommand,
  UpdateCommand,
  PutCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';

// Type.
import { GenericStringIndex } from '@/app/type/generic';

export const fetchTableList = async (): Promise<string[] | undefined> => {
  try {
    const list = await ddbClient.send(new ListTablesCommand({}));

    return list.TableNames;
  } catch (err) {
    console.log('Error', err);
  }
};

export const query = async (params: QueryCommandInput) => {
  const command = new QueryCommand(params);

  const response = await ddbClient.send(command);
  console.log(response);
  return response;
}

export const queryRangeCommand = async (params: object) => {
  const command = new QueryCommand(params as QueryCommandInput);
  const response = await ddbClient.send(command);
  console.log(response);
  return response;
} 


export const scanTable = async (tableName: string): Promise<Record<string, number>[] | undefined> => {
  if (tableName) {
    try {
      const data = await ddbClient.send(new ScanCommand({ TableName: tableName }));
      return data.Items;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export const updateData = async (tableName: string, keys: object, data: object) => {
  const keysList = Object.keys(keys).map((key) => key);
  const expressionAttributeNames: GenericStringIndex = {};
  const expressionAttributeValues: GenericStringIndex = {};
  const updateExpression = Object.entries(data)
    .map((entry, index) => {

      if (keysList.includes(entry[0])) {
        return '';
      }

      expressionAttributeNames[`#${entry[0]}`] = entry[0];
      expressionAttributeValues[`:val${index}`] = entry[1]

      return `#${entry[0]} = :val${index}`
    })
    .filter((item) => item.length)
    .join(', ');
    
  const params = {
    TableName: tableName,
    Key: keys,
    UpdateExpression: `SET ${updateExpression}`, // Utilisation de 'SET' pour une mise à jour classique
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
  };

  try {
    const result = await ddbClient.send(new UpdateCommand(params));
    console.log('Success - updated', result);
    return result;
  } catch (err) {
    console.log('Error', err);
  }
};

export const addMultiData = async (tableName: string, items: GenericStringIndex[]) => {
  try {
    items.forEach(async (item) => {
      const params = {
        TableName: tableName,
        Item: {
          ...item,
        },
        ConditionExpression:'attribute_not_exists(id)'
      };
      const data = await ddbDocClient.send(new PutCommand(params));
      console.log("Success - item added", params, data);

    });
    
    alert(`Les données ont été importées avec succes.`);
  } catch (error) {
    let errorMessage = "Echec de l'import.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
  }
}
