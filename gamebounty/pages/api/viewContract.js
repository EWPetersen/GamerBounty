import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();

export default async (req, res) => {
  const params = {
    TableName: 'gamerBounty',
  };

  try {
    const data = await dynamodb.scan(params).promise();
    res.status(200).json(data.Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
