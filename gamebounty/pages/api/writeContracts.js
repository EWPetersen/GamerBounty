import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });

export default async function writeContracts(req, res) {
  const { gameTitle, targetPlayer, contractConditions, bidAmount, expDate, acceptedBy, isVerified, verifyLink, contractStatus } = req.body;
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // generates a random id

  console.log('Request body:', req.body);

  const params = {
    TableName: 'contractsDb', // Updated table name
    Item: {
      id: { S: id },
      gameTitle: { S: gameTitle },
      targetPlayer: { S: targetPlayer },
      contractConditions: { S: contractConditions },
      bidAmount: { N: bidAmount.toString() },
      expDate: { S: expDate },
      acceptedBy: { S: 'create' },
      verifyLink: { S: verifyLink },
      isVerified: { BOOL: false },
      contractStatus: { S: contractStatus },
    },
  }; 

  console.log('params:', params);

  try {
    const command = new PutItemCommand(params);
    const response = await dynamoDBClient.send(new PutItemCommand(params));
    console.log('Successfully created contract:', response);
    res.status(200).json({ success: true, message: 'Successfully created contract.' });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ success: false, message: 'Error creating contract.' });
  }
}