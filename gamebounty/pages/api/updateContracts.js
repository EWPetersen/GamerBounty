import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export default async function handler(req, res) {
  const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

  const {
    id = '',
    gameTitle = '',
    targetPlayer = '',
    bidAmount = '0',
    expDate = '',
    acceptedBy = '',
    isVerified = 'false',
    verifyLink = '',
    contractStatus = '',
  } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  
  const updateExpressionItems = [
    'targetPlayer = :targetPlayer',
    'acceptedBy = :acceptedBy',
    'isVerified = :isVerified',
    'contractStatus = :contractStatus',
  ];

  const expressionAttributeValues = {
    ':targetPlayer': { S: targetPlayer },
    ':acceptedBy': { S: acceptedBy },
    ':isVerified': { BOOL: isVerified },
    ':contractStatus': { S: contractStatus },
  };

  if (bidAmount) {
    updateExpressionItems.push('bidAmount = :bidAmount');
    expressionAttributeValues[':bidAmount'] = { N: bidAmount.toString() };
  }

  if (expDate) {
    updateExpressionItems.push('expDate = :expDate',);
    expressionAttributeValues[':expDate'] = { S: expDate };
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
