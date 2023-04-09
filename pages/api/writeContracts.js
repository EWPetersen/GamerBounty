import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDBClient = new DynamoDBClient({ region: "us-west-2" });

export default async function writeContracts(req, res) {
  const data = req.body;
  const {
    gameTitle,
    targetPlayer,
    contractConditions,
    expDate,
    requestedBy,
    contractStatus,
    gameCurrencyDenom,
    gameCurrencyAmount,
  } = req.body;
  const id =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15); // generates a random id

  console.log("Request body:", data);

  const params = {
    TableName: "contractsDb", // Updated table name
    Item: {
      id: { S: id },
      gameTitle: { S: gameTitle },
      targetPlayer: { S: targetPlayer },
      contractConditions: { S: contractConditions },
      expDate: { S: expDate },
      requestedBy: { S: requestedBy },
      contractStatus: { S: contractStatus },
      gameCurrencyDenom: { S: gameCurrencyDenom },
      gameCurrencyAmount: { N: gameCurrencyAmount },
    },
  };

  console.log("params:", params);

  try {
    const command = new PutItemCommand(params);
    const response = await dynamoDBClient.send(new PutItemCommand(params));
    console.log("Successfully created contract:", response);
    res
      .status(200)
      .json({ success: true, message: "Successfully created contract." });
  } catch (error) {
    console.error("Error creating contract:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating contract." });
  }
}
