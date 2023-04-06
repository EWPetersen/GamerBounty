import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import writeContracts from './writeContracts';

const client = new DynamoDBClient({ region: 'us-west-2' });

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case 'POST':
      return createBounty(body, res);
    case 'PUT':
      return updateContract(body, res);
    default:
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const createBounty = async (body, res) => {
  const { gameName, targetPlayer, contractConditions, bidAmount, expDate } = body;
  const id = uuidv4();

  const acceptedBy = null;
  const isVerified = false;
  const verifyLink = null;

  const params = {
    TableName: 'contractsDB',
    Item: {
      id: { S: id },
      gameTitle: { S: gameName },
      targetPlayer: { S: targetPlayer },
      contractConditions: { S: contractConditions },
      bidAmount: { N: String(bidAmount) },
      expDate: { S: expDate },
      acceptedBy: { S: acceptedBy },
      isVerified: { BOOL: isVerified },
      verifyLink: { S: verifyLink },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    console.log(`Successfully created bounty for gameTitle ${gameName}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error creating bounty for gameTitle ${gameName}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContract = async ({ id, gameTitle, targetPlayer, bidAmount, isVerified, verifyLink, acceptedBy }, res) => {
  console.log(`Received request to update contract ${gameTitle}:`, { id, gameTitle, targetPlayer, bidAmount, isVerified, verifyLink, acceptedBy });

  const params = {
    TableName: 'contractsDB',
    Key: {
      id: { S: id },
      gameTitle: { S: gameTitle },
    },
    UpdateExpression: 'SET targetPlayer = :targetPlayer, bidAmount = :bidAmount, isVerified = :isVerified, verifyLink = :verifyLink, acceptedBy = :acceptedBy',
    ExpressionAttributeValues: {
      ':targetPlayer': { S: targetPlayer },
      ':bidAmount': { N: String(bidAmount) },
      ':isVerified': { BOOL: isVerified },
      ':verifyLink': { S: verifyLink },
      ':acceptedBy': { S: acceptedBy },
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const command = new UpdateItemCommand(params);
    const response = await client.send(command);
    console.log(`Successfully updated contract ${gameTitle}`, response);
    res.status(200).json({ success: true, data: response.Attributes });
} catch (error) {
    console.error(`Error updating contract ${gameTitle}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};