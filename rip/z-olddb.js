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
  const { gameName, targetPlayer, contractConditions, bidAmount, multiBid, multiSubmit, contractStatus, expDate } = body;
  const uid = uuidv4();
  const contractNumber = `testNumber`;
  const isAccepted = 'create'; // sets isAccepted to null  
  const acceptedBy = 'create'; // sets acceptedBy to null  
  const verificationContentLink = 'create'; // sets verificationContentLink to null
  const isVerified = 'create'; // sets isVerified to null

 

  const writeContractsResponse = await writeContracts(
    gameName,
    targetPlayer,
    contractConditions,
    bidAmount,
    multiBid,
    multiSubmit,
    contractStatus,
    expDate,
    isAccepted,
    acceptedBy,
    verificationContentLink,
    isVerified
  );
    
  if (!writeContractsResponse.success) {
    console.error('Error creating bounty:', writeContractsResponse.message);
    res.status(500).json({ success: false, message: writeContractsResponse.message });
    return;
  }

  const params = {
    TableName: 'bountyContracts',
    Item: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
      gameName: { S: gameName },
      targetPlayer: { S: targetPlayer },
      contractConditions: { S: contractConditions },
      bidAmount: { S: bidAmount },
      multiBid: { BOOL: multiBid },
      multiSubmit: { BOOL: multiSubmit },
      contractStatus: { S: contractStatus },
      expDate: { S: expDate },
      isAccepted: { S: isAccepted },
      acceptedBy: { S: acceptedBy },
      verificationContentLink: { S: verificationContentLink },
      isVerified: { S: isVerified },
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


const updateContract = async ({ uid, contractNumber, gameName, targetPlayer, bidAmount, isAccepted, acceptedBy, multiBid, multiSubmit, contractStatus }, res) => {
  console.log(`Received request to update contract ${contractNumber}:`, { uid, gameName, targetPlayer, bidAmount, isAccepted, acceptedBy, multiBid, multiSubmit, contractStatus });

  const params = {
    TableName: 'bountyContracts',
    Key: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
    },
    UpdateExpression: 'SET gameName = :gameName, targetPlayer = :targetPlayer, bidAmount = :bidAmount, isAccepted = :isAccepted, acceptedBy = :acceptedBy, multiBid = :multiBid, multiSubmit = :multiSubmit, contractStatus = :contractStatus',
    ExpressionAttributeValues: {
      ':gameName': { S: gameName },
      ':targetPlayer': { S: targetPlayer },
      ':bidAmount': { S: bidAmount },
      ':isAccepted': { S: isAccepted },
      ':acceptedBy': { S: acceptedBy },
      ':multiBid': { S: multiBid || '' },
      ':multiSubmit': { S: multiSubmit || '' },
      ':contractStatus': { S: contractStatus || '' },
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
