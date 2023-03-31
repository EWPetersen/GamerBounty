import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({ region: 'us-west-2' });

export default async function writeContracts(req, res) {
  const { gameName, targetPlayer, contractConditions, bidAmount, multiBid, multiSubmit, contractStatus, expDate } = req.body;
  const uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); // generates a random uid
  const contractNumber = 'create'; // sets contractNumber to null
  const isAccepted = 'create'; // sets isAccepted to null  
  const acceptedBy = 'create'; // sets acceptedBy to null  
  const verificationContentLink = 'create'; // sets verificationContentLink to null
  const isVerified = 'create'; // sets isVerified to null  
  const requestedBy = 'create'; // sets requestedBy to 'test'

  console.log('Request body:', req.body);

  const params = {
    TableName: 'bountyContracts',
    Item: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
      gameName: { S: gameName },
      targetPlayer: { S: targetPlayer },
      contractConditions: { S: contractConditions },
      bidAmount: { S: bidAmount },
      isAccepted: { S: isAccepted },
      acceptedBy: { S: acceptedBy },
      verificationContentLink: { S: verificationContentLink },
      isVerified: { S: isVerified },
      requestedBy: { S: requestedBy },
      multiBid: { BOOL: multiBid },
      multiSubmit: { BOOL: multiSubmit },
      contractStatus: { S: contractStatus || '' },
      expDate: { S: expDate || '' },
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
