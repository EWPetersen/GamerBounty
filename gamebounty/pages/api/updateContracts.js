import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

const dynamodbClient = new DynamoDBClient({ region: 'us-west-2' });




export default async function updateContracts(req, res) {
  const { id, gameTitle, acceptedBy, isVerified, verifyLink, verifyNotes, contractStatus, isDeleted } = req.body;
  console.log('This is the request body:',req.body);

  function buildUpdateExpression(data) {
    let UpdateExpression = 'SET';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
  
    let isFirstProperty = true;
    for (const property in data) {
      if (data[property] !== undefined) {
        UpdateExpression += `${isFirstProperty ? '' : ','} #${property} = :${property}`;
        ExpressionAttributeNames[`#${property}`] = property;
        
        if (typeof data[property] === 'boolean') {
          ExpressionAttributeValues[`:${property}`] = { BOOL: data[property] };
        } else {
          ExpressionAttributeValues[`:${property}`] = { S: data[property] };
        }
  
        isFirstProperty = false;
      }
    }
  
    // Check if UpdateExpression remains 'SET', meaning there are no properties to update
    if (UpdateExpression === 'SET') {
      throw new Error('No properties to update');
    }
  
    return {
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };
  }
  

  const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = buildUpdateExpression({
    acceptedBy,
    verifyLink,
    isVerified,
    verifyNotes,
    contractStatus,
    isDeleted,
  });
  

  const updateContractCommand = new UpdateItemCommand({
    TableName: 'contractsDb',
    Key: {
      id: { S: id },
      gameTitle: { S: gameTitle },
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  });

  if (!id) {
    res.status(400).json({ error: 'Missing or invalid id' });
    return;
  }
  
  if (!gameTitle) {
    res.status(400).json({ error: 'Missing or invalid gameTitle' });
    return;
  }
  
  console.log('Id and gameTitle are present:', id, gameTitle);

console.log('Variable data - ','acceptedBy:',acceptedBy,'isVerified:',isVerified,'verifyLink:',verifyLink,'verifyNotes:',verifyNotes,'contractStatus:',contractStatus,'isDeleted:',isDeleted);

const params = {
  TableName: 'contractsDb',
  Key: { id: { S: id }, gameTitle: { S: gameTitle } },
  UpdateExpression:
    "SET #acceptedby = :acceptedBy, #verifyLink = :verifyLink, #isVerified = :isVerified, #verifyNotes = :verifyNotes, #contractStatus = :contractStatus, #isDeleted = :isDeleted",
  ExpressionAttributeNames: {
    "#acceptedby": "acceptedBy",
    "#verifyLink": "verifyLink",
    "#isVerified": "isVerified",
    "#verifyNotes": "verifyNotes",
    "#contractStatus": "contractStatus",
    "#isDeleted": "isDeleted",
  },
  ExpressionAttributeValues: {
    ":isDeleted": { BOOL: isDeleted },
    ":acceptedBy": {S: acceptedBy },
    ":verifyLink": { S: verifyLink },
    ":isVerified": { BOOL: isVerified },
    ":verifyNotes": { S: verifyNotes },
    ":contractStatus": { S: contractStatus },
  },
};

console.log('these are the params from UpdateItemCommand:', params);
  
  try {
    const command = new UpdateItemCommand(params);
    const response = await dynamodbClient.send(command);
    res.status(200).json({ updatedContract: response.Attributes });
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }

}