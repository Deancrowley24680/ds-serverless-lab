import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  try {
    const movieId = event.pathParameters?.movieId;
    if (!movieId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "movieId is required" }),
      };
    }

    const commandOutput = await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { movieId: Number(movieId) },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Movie deleted successfully" }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};

function createDDbDocClient() {
  const ddbClient = new DynamoDBClient({ region: process.env.REGION });
  return DynamoDBDocumentClient.from(ddbClient);
}
