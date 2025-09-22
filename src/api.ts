import { fetchAuthSession } from 'aws-amplify/auth';
import env from '../amplify_outputs.json';
import type { Tank, TankExtended } from './types/TankType';

export const getIdToken = async (): Promise<string> => {
  const currentSession = await fetchAuthSession();
  const idToken = currentSession.tokens?.idToken?.toString();
  return idToken || '';
}

// Helper function to convert DynamoDB item format to plain object
export const convertDynamoDBItem = (item: any): TankExtended => {
  if (item.tank && typeof item.tank === 'string') {
    return item as TankExtended;
  }
  return {
    id: item.id?.S,
    tank: item.tank?.S || '',
    tankType: item.tankType?.S || '',
    fish: item.fish?.S,
    createdAt: item.createdAt?.S || '',
    updatedAt: item.updatedAt?.S || ''
  };
};

export const fetchTablesApi = async (): Promise<TankExtended[]> => {
  const response = await fetch(env.custom.API.tankApi.endpoint + 'tanks', {
    method: 'GET',
    headers: {
      Authorization: await getIdToken(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const restData = await response.json();
  if (restData.Item) {
    return [convertDynamoDBItem(restData.Item)];
  } else if (restData.Items) {
    return restData.Items.map(convertDynamoDBItem);
  } else if (Array.isArray(restData)) {
    return restData.map((item: any) =>
      typeof item === 'object' && item !== null ? convertDynamoDBItem(item) : item
    ) as TankExtended[];
  }
  return [];
};

export const deleteTankApi = async (id: string): Promise<TankExtended[]> => {
  const response = await fetch(env.custom.API.tankApi.endpoint + 'tanks/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: await getIdToken(),
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const restData = await response.json();
  if (restData.Item) {
    return [convertDynamoDBItem(restData.Item)];
  } else if (restData.Items) {
    return restData.Items.map(convertDynamoDBItem);
  } else if (Array.isArray(restData)) {
    return restData.map((item: any) =>
      typeof item === 'object' && item !== null ? convertDynamoDBItem(item) : item
    ) as TankExtended[];
  }
  return [];
};

export const addTankApi = async (tank: Tank): Promise<TankExtended[]> => {
  const response = await fetch(env.custom.API.tankApi.endpoint + 'tanks', {
    method: 'POST',
    headers: {
      Authorization: await getIdToken(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tank),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const restData = await response.json();
  if (restData.Item) {
    return [convertDynamoDBItem(restData.Item)];
  } else if (restData.Items) {
    return restData.Items.map(convertDynamoDBItem);
  } else if (Array.isArray(restData)) {
    return restData.map((item: any) =>
      typeof item === 'object' && item !== null ? convertDynamoDBItem(item) : item
    ) as TankExtended[];
  }
  return [];
}; 