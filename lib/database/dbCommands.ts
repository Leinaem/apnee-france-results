// Config.
import { ddbClient } from './dbconfig';

// Required AWS SDK clients and commands.
import { QueryCommandInput, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import {
  ScanCommand,
  QueryCommand
} from '@aws-sdk/lib-dynamodb';

// Type.
import { GenericStringIndex } from '@/app/type/generic';


// Old commands noSQL
export const query = async (params: QueryCommandInput) => {
  const command = new QueryCommand(params);
  const response = await ddbClient.send(command);
  console.log(response);
  return response;
}

export const queryRangeCommand = async (params: object) => {
  const command = new QueryCommand(params as QueryCommandInput);
  const response = await ddbClient.send(command);
  // console.log(response);
  return response;
} 

export const scanRangeCommand = async (params: object) => {
  const command = new ScanCommand(params as ScanCommandInput);
  const response = await ddbClient.send(command);
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


// New commands SQL
export const addMultiData = async (tableName: string, items: GenericStringIndex[]) => {
  try {
    const res = await fetch('/api/post-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table: tableName,
        data: items,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Erreur import:', json.error);
      alert(`Erreur: ${json.error}`);
      return;
    }

    alert(json.message);
  } catch (err) {
    console.error('Erreur lors de l’appel API', err);
    alert('Erreur réseau ou serveur');
  }
}
