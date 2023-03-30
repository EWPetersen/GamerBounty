import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: 'us-west-2' });

export default async function handler(req, res) {
  console.log('Received request with query params:', req.query);
  const { uid } = req.query;
  console.log('uid:', uid);
  
  try {
    const data = await getDataFromDynamoDB(uid);
    console.log('Data:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function getDataFromDynamoDB(uid) {
  console.log('Querying DynamoDB with uid:', uid);
  const params = {
    TableName: 'bountyContracts',
    KeyConditionExpression: 'uid = :uid',
    ExpressionAttributeValues: {
      ':uid': { S: uid },
    },
  };
  const command = new QueryCommand(params);
  const data = await dynamoDb.send(command);
  console.log('Query result:', data.Items);
  
  return data.Items.map((item) => {
    return {
      key: item.uid.S,
      gameName: item.gameName.S,
      targetPlayer: item.targetPlayer.S,
      bidAmount: item.bidAmount.S,
      contractStatus: item.contractStatus.S,
      requestedBy: item.requestedBy.S,
      contractNumber: item.contractNumber.S,
    };
  });
}
