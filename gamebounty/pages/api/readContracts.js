import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamoDb = new DynamoDBClient({ region: 'us-west-2' });

export default async function handler(req, res) {
  const data = await getDataFromDynamoDB();
  res.status(200).json(data);
}

async function getDataFromDynamoDB() {
    const params = {
      TableName: 'bountyContracts',
    };
    const command = new ScanCommand(params);
    const data = await dynamoDb.send(command);
    console.log('Data:', data.Items); // Add a console.log statement to check if the function is returning any data
    return data.Items.map((item) => {
      return {
        key: item.uid.S,
        gameName: item.gameName.S,
        targetPlayer: item.targetPlayer.S,
        bidAmount: item.bidAmount.S,
        contractStatus: item.contractStatus.S,
        requestedBy: item.requestedBy.S,
        contractNumber: item.contractNumber.S
      };
    });
  }
