import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export default async (req, res) => {
  const { contractNumber, gameName, targetPlayer, contractConditions, bidAmount, contentLink, contractStatus, multiBid, multiSubmit, requestedBy, acceptedBy } = req.body;
  console.log(`Received request to create gamer bounty: { contractNumber: ${contractNumber}, gameName: ${gameName}, bidAmount: ${bidAmount} }`);

  const params = {
    TableName: 'gamerBounty',
    Item: {
      contractNumber,
      gameName,
      targetPlayer,
      contractConditions,
      bidAmount,
      contentLink,
      contractStatus,
      multiBid,
      multiSubmit,
      requestedBy,
      acceptedBy
    },
  };

  try {
    await dynamodb.put(params).promise();
    console.log(`Successfully created gamer bounty: { contractNumber: ${contractNumber}, gameName: ${gameName}, bidAmount: ${bidAmount} }`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(`Error creating gamer bounty: { contractNumber: ${contractNumber}, gameName: ${gameName}, bidAmount: ${bidAmount}, contractConditions: ${contractConditions} }`);
    console.log(error);
    res.status(500).json({ success: false });
  }
};
