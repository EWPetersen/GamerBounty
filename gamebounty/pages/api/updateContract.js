import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-west-2' });

export default async function handler(req, res) {
  const { uid, contractNumber, gameName, targetPlayer, bidAmount } = req.body;
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
