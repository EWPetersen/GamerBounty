import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import updateContract from './updateContract';

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
      if (req.method === 'PUT') {
        await updateContract(req, res);
      } else {
        res.status(400).json({ success: false, message: 'Invalid HTTP method' });
      }
    }
  }


const createBounty = async ({ uid, contractNumber, gameName, targetPlayer, bidAmount }, res) => {
  const params = {
    TableName: 'bountyContracts',
    Item: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
      gameName: { S: gameName },
      targetPlayer: { S: targetPlayer },
      bidAmount: { S: bidAmount },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    console.log(`Successfully created bounty for contractNumber ${contractNumber}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error creating bounty for contractNumber ${contractNumber}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContract = async ({ uid, contractNumber, gameName, targetPlayer, bidAmount }, res) => {
  console.log(`Received request to update contract ${contractNumber}:`, { uid, gameName, targetPlayer, bidAmount });

  const params = {
    TableName: 'bountyContracts',
    Key: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
    },
    UpdateExpression: 'SET gameName = :gameName, targetPlayer = :targetPlayer, bidAmount = :bidAmount',
    ExpressionAttributeValues: {
      ':gameName': { S: gameName },
      ':targetPlayer': { S: targetPlayer },
      ':bidAmount': { S: bidAmount },
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const command = new UpdateItemCommand(params);
    const response = await client.send(command);
    console.log(`Successfully updated contract ${contractNumber}`, response);
    res.status(200).json({ success: true, data: response.Attributes });
  } catch (error) {
    console.error(`Error updating contract ${contractNumber}`, error);
    res.status(500).json({ success: false, message: error.message });
  }
};
