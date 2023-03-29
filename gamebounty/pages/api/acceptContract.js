import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

export default async function handler(req, res) {
  const { uid, isAccepted, acceptedBy } = req.body;

  console.log(`Received data: uid=${uid}, isAccepted=${isAccepted}, acceptedBy=${acceptedBy}`);

  try {
    const dynamodbClient = new DynamoDBClient({ region: 'us-west-2' });

    const updateParams = {
      TableName: 'bountyContracts',
      Key: { uid: { S: uid } },
      UpdateExpression: 'set isAccepted = :isAccepted, acceptedBy = :acceptedBy',
      ExpressionAttributeValues: {
        ':isAccepted': { S: isAccepted },
        ':acceptedBy': { S: acceptedBy },
      },
    };

    await dynamodbClient.send(new UpdateItemCommand(updateParams));
    res.status(200).json({ message: `Contract ${uid} successfully updated` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating contract' });
  }
}
