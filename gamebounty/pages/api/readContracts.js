import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-west-2' });

export default async function readContracts(req, res) {
  console.log('Received request to get all contracts');
  
  const params = {
    TableName: 'contractsDb', // Updated table name
    // Add any filter or projection expressions if needed
  };

  try {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    console.log('Successfully read all contracts', response);
    res.status(200).json({ success: true, data: response.Items });
  } catch (error) {
    console.error('Error reading contracts', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
