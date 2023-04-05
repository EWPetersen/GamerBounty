import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export default async function handler(req, res) {
  const dynamodbClient = new DynamoDBClient({ region: 'us-west-2' });

  const {
    id = '',
    bidAmount = '0',
    acceptedBy = '',
    isVerified = '',
    verifyLink = '',
    verifyNotes = '',
    contractStatus = '',
  } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  
  console.log('Received id:', id);

  const updateExpressionItems = [
    'acceptedBy = :acceptedBy',
    'isVerified = :isVerified',
    'verify = :verifyLink',
    'verifyNotes = :verifyNotes',
    'contractStatus = :contractStatus',
  ];

  const expressionAttributeValues = {
    ':acceptedBy': { S: acceptedBy },
    ':isVerified': { BOOL: isVerified },
    ':verifyLink': { S: verifyLink }, 
    ':verifyNotes': { S: verifyNotes }, 
    ':contractStatus': { S: contractStatus },
  };

  if (bidAmount) {
    updateExpressionItems.push('bidAmount = :bidAmount');
    expressionAttributeValues[':bidAmount'] = { N: bidAmount.toString() };
  }


  const params = {
    TableName: 'contractsDb',
    Key: {
      id: { S: id },
    },
    UpdateExpression: `SET ${updateExpressionItems.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const command = new UpdateItemCommand(params);
    const response = await dynamodbClient.send(command);
    res.status(200).json({ updatedContract: response.Attributes });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
}
