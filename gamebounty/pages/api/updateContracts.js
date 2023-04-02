import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-west-2' });

export default async function handler(req, res) {
  const { id, gameTitle, targetPlayer, bidAmount, expDate, acceptedBy, isVerified, verifyLink, contractStatus } = req.body;
  console.log(`Received request to update contract ${gameTitle}:`, { id, gameTitle, targetPlayer, bidAmount, expDate, acceptedBy, isVerified, verifyLink, contractStatus });

  const params = {
    TableName: 'contractsDb', // Updated table name
    Key: {
      id: { S: id }, // Updated primary key
      gameTitle: { S: gameTitle }, // Updated sort key
    },
    UpdateExpression: 'SET targetPlayer = :targetPlayer, bidAmount = :bidAmount, expDate = :expDate, acceptedBy = :acceptedBy, isVerified = :isVerified, verifyLink = :verifyLink, contractStatus = :contractStatus',
    ExpressionAttributeValues: {
      ':targetPlayer': { S: targetPlayer },
      ':bidAmount': { N: bidAmount.toString() },
      ':expDate': { S: expDate },
      ':acceptedBy': { S: acceptedBy },
      ':isVerified': { BOOL: isVerified },
      ':verifyLink': { S: verifyLink },
      ':contractStatus': { S: contractStatus },
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
}