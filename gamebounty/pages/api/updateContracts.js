import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({ region: 'us-west-2' });

export default async function updateContracts(req, res) {
  const { id, gameTitle, acceptedBy, isVerified, verifyLink, verifyNotes, contractStatus } = req.body;
  console.log(req.body);

  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  
  console.log('Received id:', id);

console.log(id, acceptedBy, isVerified, verifyLink, verifyNotes, contractStatus);

const params = {
  TableName: 'contractsDb',
  Key: { id: { S: id }, gameTitle: { S: gameTitle } },
  UpdateExpression:
    "SET #acceptedby = :acceptedBy, #verifyLink = :verifyLink, #isVerified = :isVerified, #verifyNotes = :verifyNotes, #contractStatus = :contractStatus",
  ExpressionAttributeNames: {
    "#acceptedby": "acceptedBy",
    "#verifyLink": "verifyLink",
    "#isVerified": "isVerified",
    "#verifyNotes": "verifyNotes",
    "#contractStatus": "contractStatus",
  },
  ExpressionAttributeValues: {
    ":acceptedBy": {S: acceptedBy },
    ":verifyLink": { S: verifyLink },
    ":isVerified": { BOOL: isVerified },
    ":verifyNotes": { S: verifyNotes },
    ":contractStatus": { S: contractStatus },
  },
};

console.log('params:', params);
  
  try {
    const command = new UpdateItemCommand(params);
    const response = await dynamodbClient.send(command);
    res.status(200).json({ updatedContract: response.Attributes });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }

}