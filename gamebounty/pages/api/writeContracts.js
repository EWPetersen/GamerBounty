import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: 'us-west-2' });

const writeContracts = async (uid, contractNumber, gameName, targetPlayer, bidAmount) => {
  const params = {
    TableName: 'bountyContracts',
    Item: {
      uid: { S: uid },
      contractNumber: { S: contractNumber },
      gameName: { S: gameName },
      targetPlayer: { S: targetPlayer },
      bidAmount: { S: bidAmount },
    },
  };

  try {
    const command = new PutItemCommand(params);
    await client.send(command);
    console.log(`Successfully created bounty for contractNumber ${contractNumber}`);
    return { success: true };
  } catch (error) {
    console.error(`Error creating bounty for contractNumber ${contractNumber}`, error);
    return { success: false, message: error.message };
  }
};

// Example usage
// writeContracts('123456', '666', 'World of Warcraft', 'John Doe', '20')
//  .then((data) => console.log(data))
// .catch((error) => console.error(error));
